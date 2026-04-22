# AGENTS.md — cyberlabsv3

## What this is
A **mock prototype** (not production) for a student lab-provisioning platform called Cyberlabs.
Students log in with demo credentials, pick a lab plan, go through a payment flow, and get a provisioned lab.

---

## Quick Start

```bash
# 1. Install the frontend-design skill FIRST (before writing UI components)
npx skills add https://github.com/anthropics/skills --skill frontend-design

# 2. Standard Next.js commands
npm install
npm run dev          # Dev server on http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
```

---

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 15+ (App Router) | Use App Router unless a specific page requires legacy Pages Router |
| Language | TypeScript | Strict mode preferred |
| Styling | `frontend-design` skill | Do NOT default to raw Tailwind/manual CSS if the skill provides patterns. Always check skill output first. |
| State | Zustand | Keep auth + current plan + lab env in one store |
| Forms | React Hook Form + Zod | Validate all inputs, even mock ones |
| Payments | Easebuzz | **Must websearch for current docs before implementing** |
| Backend | Mock REST API only | Next.js Route Handlers (`app/api/**/*.route.ts`) |

---

## Demo Credentials (Hardcoded)

```
Username: suhail@gmail.com
Password: astr0000
```

These are the ONLY valid login credentials. Registration accepts any input but stores nothing persistently.

---

## User Flow (Do Not Rearrange Without Confirming)

1. **Hero/Landing** (`/`) → student clicks Login
2. **Login / Register** (`/auth`) → mock auth with demo credentials
3. **Plan Form** (`/dashboard`) → student fills details, selects a lab, sets hours
4. **Payment** (`/payment`) → Easebuzz checkout flow
5. **Lab Provisioning** (`/provision`) → on clicking "Provision Lab", fire mock REST API call, then show lab environment

---

## Critical Constraints

- **Mock only**: All API calls, auth, and provisioning are mocks. Do not build a real backend, DB migrations, or infra unless explicitly asked.
- **Easebuzz integration**: Always check the latest official docs via websearch; the spec explicitly requires this. Search for "Easebuzz payment gateway integration docs" and "Easebuzz Node.js example".
- **UI polish**: Leverage the `frontend-design` skill for styling; do not default to raw Tailwind/manual CSS if the skill provides patterns.
- **No persistence**: All data lives in memory and session state. No database required.

---

## Architecture Decisions

### Why Zustand over Context?
- Simpler boilerplate for global auth + plan + lab state
- Avoids prop drilling in the dashboard/provision flow
- Easy persistence via `persist` middleware to sessionStorage

### Why App Router?
- Route handlers (`app/api/...`) keep mock API colocated with UI
- Server Components can fetch initial lab data without useEffect
- Middleware for auth protection is straightforward

### Mock API Pattern
All mock endpoints follow this pattern:
```typescript
// app/api/something/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Validate with Zod
  // Return mock data
  return NextResponse.json({ id: 'mock-id', ...body });
}
```

---

## File Structure

```
app/
  (auth)/auth/page.tsx              # Login/Register
  (dashboard)/
    dashboard/page.tsx              # Plan form
    payment/page.tsx                # Payment
    payment/callback/page.tsx       # Easebuzz callback handler
    provision/page.tsx              # Provisioning + Lab env
    layout.tsx                      # Auth guard
  admin/
    page.tsx                        # Admin dashboard
    layout.tsx                      # Admin layout
  api/                              # Mock REST API routes (use route.ts, NOT .route.ts)
components/
  ui/                               # Base UI (from skill)
  labs/, provision/, layout/        # Feature components
lib/
  data/labs.ts                      # Hardcoded lab data (4 labs min)
  store/auth-store.ts               # Zustand store with persist
  utils/api.ts                      # Fetch wrappers
  utils/format.ts                   # INR currency formatter, expiry calculator
  validators/schemas.ts             # Zod schemas
types/index.ts                      # Shared TypeScript interfaces
middleware.ts                       # Auth redirect: unauthenticated → /auth
vitest.config.ts                    # Vitest config
vitest.setup.ts                     # Test setup
```

---

## State Management (Zustand)

```typescript
// lib/store/auth-store.ts
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentPlan: Plan | null;
  labEnvironment: LabEnvironment | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed';

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentPlan: (plan: Plan) => void;
  setLabEnvironment: (env: LabEnvironment) => void;
}
```

**Persistence rule**: Auth token → `localStorage`. Plan + Lab env → `sessionStorage` (lost on tab close is fine for mock).

---

## Mock API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/login` | Only accepts `suhail@gmail.com` / `astr0000` |
| `POST /api/auth/register` | Always succeeds, in-memory only |
| `GET /api/labs` | Returns 4 hardcoded labs |
| `POST /api/plans` | Creates plan with calculated total |
| `POST /api/payments/initiate` | Returns Easebuzz form data or mock fallback |
| `POST /api/payments/verify` | Verifies txn hash; mock: always succeeds |
| `POST /api/provision` | Returns LabEnvironment after 3-5s delay |

---

## Payment (Easebuzz) Implementation Notes

1. **Research first**: Websearch "Easebuzz integration docs 2024" before writing any payment code.
2. **Expected flow**: Initiate → Redirect to Easebuzz → Callback → Verify → Redirect to provision.
3. **Mock fallback**: If no Easebuzz keys in `.env.local`, show "Simulate Payment" button that auto-succeeds after 2s.
4. **Hash generation**: Easebuzz usually requires a hash of `key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt`. Check current docs for exact format.

---

## Adding a New Lab

To add a new lab to the platform:

1. Edit `lib/data/labs.ts`
2. Add a new object to the `labs` array following the `Lab` interface
3. Provide a thumbnail image in `public/images/labs/`
4. The UI will automatically pick it up (no other changes needed)

**Required lab fields**: `id`, `name`, `description`, `category`, `difficulty`, `hourlyPrice`, `imageUrl`, `tags`, `specs`.

---

## Zod Schemas Reference

```typescript
// lib/validators/schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match', path: ['confirmPassword'],
});

export const planSchema = z.object({
  labId: z.string().min(1),
  hours: z.number().min(1).max(48),
});
```

## API Utility Pattern

```typescript
// lib/utils/api.ts
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(endpoint, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}
```

## Formatters

```typescript
// lib/utils/format.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function calculateExpiry(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
```

## Auth Guard (middleware.ts)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtected = ['/dashboard','/payment','/provision'].some(p => request.nextUrl.pathname.startsWith(p));

  if (!token && isProtected) return NextResponse.redirect(new URL('/auth', request.url));
  if (token && isAuthPage) return NextResponse.redirect(new URL('/dashboard', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
```

## Image Fallbacks

Use Unsplash URLs for lab thumbnails. Add to `next.config.js`:
```javascript
images: { remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }] }
```

## Common Pitfalls

- **Do NOT** build a real database or ORM. Use in-memory arrays and hardcoded data.
- **Do NOT** implement real password hashing. Compare plaintext for the mock.
- **Do NOT** skip the Easebuzz websearch. The integration changes frequently.
- **Do NOT** use Pages Router unless you have a specific reason. App Router is the default.
- **Do NOT** store sensitive data in localStorage besides the mock token.
- **Do NOT** name API routes `.route.ts` — App Router requires `route.ts`.
- **Always** check `frontend-design` skill output before writing custom Tailwind classes.

---

## Environment Variables

Create `.env.local` from `.env.local.example`:

```env
# Easebuzz (optional - mock fallback works without these)
EASEBUZZ_KEY=your_key_here
EASEBUZZ_SALT=your_salt_here
EASEBUZZ_ENV=test

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Testing

- **Unit**: Zod schemas, utility formatters, API client (Vitest)
- **Integration**: Auth flow, plan creation
- **Manual QA Checklist**:
  - [x] Demo credentials login works
  - [x] All 4 labs display with correct pricing
  - [x] Price calculator = hourlyRate × hours
  - [x] Payment flow completes (or mock simulation)
  - [x] Provisioning animation shows all steps
  - [x] Lab environment shows correct countdown
  - [x] Logout clears all state

---

## Dependencies

Core packages to install:
```bash
npm install zustand react-hook-form zod @hookform/resolvers lucide-react sonner framer-motion date-fns
```

Dev dependencies:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

Also included in Next.js init:
- TypeScript, Tailwind CSS, ESLint, PostCSS

---

## Project State

Scaffolded and implemented. All core pages, API routes, and components are in place.
Build passes (`npm run build`).

**Implemented**:
- `frontend-design` skill installed and applied to admin dashboard
- Easebuzz real payment gateway with SHA-512 hash generation, callback handling, and mock fallback
- Unit tests for schemas, formatters, and API client (20 tests passing)
- Admin dashboard at `/admin` with stats, labs, and recent plans
- Zustand `persist` middleware: auth → localStorage, plan/lab → sessionStorage

**Not yet implemented**:
- (none)

**When extending**:
1. Follow the file structure above
2. Add new labs in `lib/data/labs.ts`
3. Add new API routes under `app/api/**/route.ts`
4. Update Zod schemas in `lib/validators/schemas.ts` for new forms

---

**Document Version**: 1.2
**Last Updated**: April 2026
