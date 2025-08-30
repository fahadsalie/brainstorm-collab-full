// components/EnvGate.tsx
"use client";
import React from "react";

export default function EnvGate({
  ready,
  missing,
  children
}: {
  ready: boolean;
  missing: string[];
  children: React.ReactNode;
}) {
  if (ready) return <>{children}</>;
  return (
    <div className="p-4 bg-yellow-100 text-yellow-900 text-sm">
      <p><strong>Firebase not configured:</strong></p>
      <ul className="list-disc ml-5">
        {missing.map((k) => <li key={k}>{k}</li>)}
      </ul>
      <p className="mt-2">
        Add these in Vercel → Project → Settings → Environment Variables, then redeploy.
      </p>
    </div>
  );
}
