'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthProvider';

export default function ProjectMembers({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [ownerUid, setOwnerUid] = useState<string>('');
  const [memberEmails, setMemberEmails] = useState<string[]>([]);
  const [membersCount, setMembersCount] = useState<number>(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!db) return;
    (async () => {
      const ref = doc(db, 'projects', projectId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as any;
        setOwnerUid(data.ownerUid);
        setMemberEmails(data.memberEmails || []);
        setMembersCount((data.members || []).length);
      }
    })();
  }, [projectId]);

  const invite = async () => {
    if (!db || !email.trim()) return;
    const ref = doc(db, 'projects', projectId);
    const lower = email.trim().toLowerCase();
    await updateDoc(ref, { memberEmails: arrayUnion(lower) });
    setMemberEmails((prev) => prev.includes(lower) ? prev : [...prev, lower]);
    setEmail('');
    alert('Invite added. Share link copied — ask them to sign in with that email.');
    copyLink();
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/project/${projectId}`;
    await navigator.clipboard.writeText(url);
  };

  const isOwner = user?.uid && user.uid === ownerUid;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-3">
        <div className="font-medium">Share link</div>
        <div className="text-sm text-neutral-500 mb-2">
          Invited users must sign in with their email to be auto-added.
        </div>
        <button onClick={copyLink} className="px-3 py-1.5 rounded-lg border hover:bg-neutral-50 dark:hover:bg-neutral-800">
          Copy project link
        </button>
      </div>

      <div className="rounded-xl border p-3">
        <div className="font-medium mb-2">Members</div>
        <div className="text-sm">Confirmed members: <span className="font-medium">{membersCount}</span></div>
      </div>

      <div className="rounded-xl border p-3">
        <div className="font-medium mb-2">Invited emails</div>
        <ul className="list-disc ml-5 text-sm">
          {memberEmails.map((e) => <li key={e}>{e}</li>)}
          {memberEmails.length === 0 && <li className="text-neutral-500">None yet.</li>}
        </ul>

        {isOwner && (
          <div className="mt-3 flex gap-2">
            <input className="flex-1 rounded-xl border px-3 py-2 bg-white dark:bg-neutral-950"
              placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={invite} className="px-4 py-2 rounded-xl bg-neutral-900 text-white">Invite</button>
          </div>
        )}
        {!isOwner && <div className="text-sm text-neutral-500 mt-2">Only the owner can invite.</div>}
      </div>
    </div>
  );
}
