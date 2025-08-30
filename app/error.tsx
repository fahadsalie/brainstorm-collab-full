'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App crashed:', error);
  }, [error]);

  return (
    <html>
      <body style={{ padding: 24 }}>
        <h2>Something went wrong</h2>
        <pre style={{ whiteSpace: 'pre-wrap', color: '#555' }}>{error.message}</pre>
        <button
          onClick={() => reset()}
          style={{
            marginTop: 12,
            borderRadius: 999,
            border: '1px solid #000',
            padding: '8px 14px',
            background: '#000',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}