'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DashboardPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard. Deployment build is now fixed.</p>
    </main>
  );
}
