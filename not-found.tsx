'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function NotFound() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </main>
  );
}
