'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Home Page</h1>
      <p>This is the main landing page. Deployment build is now fixed.</p>
    </main>
  );
}
