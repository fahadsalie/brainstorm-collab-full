// app/layout.tsx (example usage of EnvGate)
import "./globals.css";
import EnvGate from "@/components/EnvGate";
import { FIREBASE_READY, MISSING_KEYS } from "@/lib/firebase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brainstorm Collab",
  description: "Collaboration app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <EnvGate ready={FIREBASE_READY} missing={MISSING_KEYS}>
          {children}
        </EnvGate>
      </body>
    </html>
  );
}
