'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export default function NotFound() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, we couldn’t find that page.</p>
    </main>
  );
}
