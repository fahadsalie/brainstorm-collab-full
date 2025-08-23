export const dynamic = 'force-dynamic'; // add this at top

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function Home() {
  const { user, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  return (
    <div className="max-w-3xl mx-auto text-center mt-20 space-y-6">
      <h1 className="text-4xl font-bold">Brainstorm & Collaborate in Real-Time</h1>
      <p className="text-slate-400">Create projects with notes, flowcharts, sheets, chat, and full audit history.</p>
      <button className="btn" onClick={signIn}>Get Started with Google</button>
    </div>
  );
}
