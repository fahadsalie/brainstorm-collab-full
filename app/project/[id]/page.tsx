'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import ProjectTabs from '@/components/ProjectTabs';

export default function ProjectPage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const [name, setName] = useState('Project');

  useEffect(() => {
    (async () => {
      const ref = doc(db, 'projects', id);
      const snap = await getDoc(ref);
      const data = snap.data();
      if (data?.name) setName(data.name);
      if (user && data && !(data.memberIds || []).includes(user.uid)) {
        await updateDoc(ref, { memberIds: arrayUnion(user.uid) });
      }
    })();
  }, [id, user]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{name}</h1>
        <ShareButton projectId={id} />
      </div>
      <ProjectTabs projectId={id} />
    </div>
  );
}

function ShareButton({ projectId }: { projectId: string }) {
  const url = typeof window !== 'undefined' ? `${location.origin}/project/${projectId}` : '';
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    alert('Invite link copied! Share with teammates.');
  };
  return <button className="btn" onClick={copy}>Copy Invite Link</button>;
}
