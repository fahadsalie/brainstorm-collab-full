'use client';

import React from 'react';

type Props = {
  ok?: boolean;
  missing?: string[];
};

export default function EnvGate(props: Props) {
  let ready: boolean | null = null;
  let missing: string[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@/lib/firebase');
    ready = typeof mod.FIREBASE_READY === 'boolean' ? mod.FIREBASE_READY : null;
    missing = Array.isArray(mod.MISSING_KEYS) ? mod.MISSING_KEYS : [];
  } catch (_) {
    ready = props.ok ?? null;
    missing = props.missing ?? [];
  }

  if (ready === true || (Array.isArray(missing) && missing.length === 0)) return null;

  return (
    <div style={{
      background: '#1f2937', color: 'white', padding: '12px 16px',
      border: '1px solid #374151', borderRadius: 10, margin: 12, fontSize: 14
    }}>
      <strong>Missing environment variables</strong>
      <div style={{ marginTop: 6 }}>
        {missing && missing.length ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {missing.map((k) => (<li key={k}><code>{k}</code></li>))}
          </ul>
        ) : <span>Some required keys are not set.</span>}
      </div>
      <div style={{ opacity: 0.8, marginTop: 6 }}>
        Add these in Vercel → Project → Settings → Environment Variables, then redeploy.
      </div>
    </div>
  );
}
