'use client';

export const revalidate = false;
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { FIREBASE_READY, MISSING_KEYS, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import ProjectTabs from '@/components/ProjectTabs';

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const { user, loading, signIn } = useAuth();
  const [name, setName] = useState<string>('Loading…');
  const id = params?.id as string | undefined;

  if (!FIREBASE_READY) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Firebase not configured</h1>
        <pre style={{ background: '#f5f5f5', padding: 12 }}>{JSON.stringify(MISSING_KEYS, null, 2)}</pre>
      </main>
    );
  }

  useEffect(() => {
    const go = async () => {
      if (!db || !id) return;
      const ref = doc(db, 'projects', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as any;
        setName(data.name || 'Untitled');
        if (user?.email && (data.memberEmails || []).includes(user.email) && user.uid) {
          await updateDoc(ref, { members: arrayUnion(user.uid) });
        }
      } else {
        setName('Project not found');
      }
    };
    void go();
  }, [id, user?.email, user?.uid]);

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;
  if (!user) {
    return (
      <main style={{ padding: 24 }}>
        <p>You’re signed out.</p>
        <button onClick={signIn}>Sign in with Google</button>
      </main>
    );
  }
  if (!id) return <main style={{ padding: 24 }}>Invalid project</main>;

  return (
    <main style={{ padding: 0 }}>
      <ProjectTabs projectId={id} projectName={name} />
    </main>
  );
}
