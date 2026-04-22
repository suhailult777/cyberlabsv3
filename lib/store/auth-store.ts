import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { User, Plan, LabEnvironment } from '@/types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentPlan: Plan | null;
  labEnvironment: LabEnvironment | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed';
  hasHydrated: boolean;

  login: (user: User) => void;
  logout: () => void;
  setCurrentPlan: (plan: Plan | null) => void;
  setLabEnvironment: (env: LabEnvironment | null) => void;
  setPaymentStatus: (status: 'idle' | 'processing' | 'success' | 'failed') => void;
  setHasHydrated: (value: boolean) => void;
}

const splitStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    const authStr = localStorage.getItem(name);
    const sessionStr = sessionStorage.getItem(name);
    if (!authStr && !sessionStr) return null;
    const auth = authStr ? JSON.parse(authStr) : {};
    const session = sessionStr ? JSON.parse(sessionStr) : {};
    // Deep merge: auth state (localStorage) + session state (sessionStorage)
    return JSON.stringify({
      state: { ...auth.state, ...session.state },
      version: session.version ?? auth.version,
    });
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return;
    const parsed = JSON.parse(value);
    const authPart = JSON.stringify({
      state: {
        user: parsed.state?.user ?? null,
        isAuthenticated: parsed.state?.isAuthenticated ?? false,
      },
      version: parsed.version,
    });
    const sessionPart = JSON.stringify({
      state: {
        currentPlan: parsed.state?.currentPlan ?? null,
        labEnvironment: parsed.state?.labEnvironment ?? null,
        paymentStatus: parsed.state?.paymentStatus ?? 'idle',
      },
      version: parsed.version,
    });
    localStorage.setItem(name, authPart);
    sessionStorage.setItem(name, sessionPart);
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      currentPlan: null,
      labEnvironment: null,
      paymentStatus: 'idle',
      hasHydrated: false,

      login: (user) => set({ user, isAuthenticated: true }),

      logout: () => {
        // Clear all persisted storage on explicit logout
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cyberlabs-store');
          sessionStorage.removeItem('cyberlabs-store');
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        }
        set({
          user: null,
          isAuthenticated: false,
          currentPlan: null,
          labEnvironment: null,
          paymentStatus: 'idle',
        });
      },

      setCurrentPlan: (plan) => set({ currentPlan: plan }),
      setLabEnvironment: (env) => set({ labEnvironment: env }),
      setPaymentStatus: (status) => set({ paymentStatus: status }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'cyberlabs-store',
      storage: createJSONStorage(() => splitStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentPlan: state.currentPlan,
        labEnvironment: state.labEnvironment,
        paymentStatus: state.paymentStatus,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
