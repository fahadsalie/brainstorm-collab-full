import './globals.css'
import AuthProvider from '@/components/AuthProvider';
import TopNav from '@/components/TopNav';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brainstorm — Real-time collaboration',
  description: 'Brainstorm, flowchart, sheets, chat & audit history',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TopNav />
          <main className="max-w-7xl mx-auto p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
