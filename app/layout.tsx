import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cyberlabs — Hands-On Lab Provisioning",
  description: "Rent hands-on lab environments for cybersecurity, networking, cloud, and devops learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: '#0e0e14',
              border: '1px solid #1a1a2e',
              color: '#e8e8ec',
              fontFamily: 'var(--font-sans), sans-serif',
            },
          }}
        />
      </body>
    </html>
  );
}
