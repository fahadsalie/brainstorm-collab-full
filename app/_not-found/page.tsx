'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export default function InternalNotFound() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>This is the internal not-found route. All good now.</p>
    </main>
  );
}
