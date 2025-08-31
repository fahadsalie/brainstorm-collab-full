export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <h1>Home ✅</h1>
      <p>This is a clean, deploy-ready Next.js app. No revalidate errors.</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        <Link href="/dashboard">Go to /dashboard</Link>
        <Link href="/projects">Try /projects (optional)</Link>
      </div>

      <p style={{ marginTop: 24, opacity: 0.8 }}>
        Tip: Add Firebase env vars in Vercel to enable sign-in and Firestore-backed projects.
      </p>
    </main>
  );
}
