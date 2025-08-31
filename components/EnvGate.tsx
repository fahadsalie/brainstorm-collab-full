'use client';

import React from 'react';

type Props = {
  ready?: boolean;
  missing?: string[];
  children?: React.ReactNode;
};

/**
 * EnvGate (compatible with example usage)
 * Usage in layout:
 *   <EnvGate ready={FIREBASE_READY} missing={MISSING_KEYS}>
 *     {children}
 *   </EnvGate>
 */
export default function EnvGate({ ready, missing = [], children }: Props) {
  // If explicitly ready or no missing keys, just render children
  if (ready === true || (Array.isArray(missing) && missing.length === 0)) {
    return <>{children}</>;
  }

  return (
    <div style={{ padding: 12 }}>
      <div style={{
        background: '#1f2937',
        color: 'white',
        padding: '12px 16px',
        border: '1px solid #374151',
        borderRadius: 10,
        marginBottom: 12,
        fontSize: 14
      }}>
        <strong>Missing environment variables</strong>
        <div style={{ marginTop: 6 }}>
          {missing && missing.length ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {missing.map((k) => (<li key={k}><code>{k}</code></li>))}
            </ul>
          ) : (
            <span>Some required keys are not set.</span>
          )}
        </div>
        <div style={{ opacity: 0.8, marginTop: 6 }}>
          Add these in Vercel → Project → Settings → Environment Variables, then redeploy.
        </div>
      </div>
      {/* Render children even when not ready, so the app still shows */}
      <div>
        {children}
      </div>
    </div>
  );
}
