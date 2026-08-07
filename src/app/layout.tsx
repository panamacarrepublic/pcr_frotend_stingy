import type { Metadata } from "next";
import { Inter } from "next/font/google";

import ThemeRegistry from "@/theme/ThemeRegistry";
import { Providers } from "@/app/providers";

// Sentry: client SDK loads via withSentryConfig in next.config; server/edge
// load via src/instrumentation.ts. Each is a no-op when its DSN env is unset.

import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Panama Car Republic",
  description: "Marketplace automotriz de Panama - vehiculos, repuestos y coleccionables.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={sans.variable}>
      <body>
        <ThemeRegistry>
          <Providers>{children}</Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
