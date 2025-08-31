'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brainstorm Collab',
  description: 'Collaboration app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
