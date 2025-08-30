'use client';

import { useState } from 'react';
import FlowCanvas from './FlowCanvas';
import NotesBoard from './NotesBoard';
import ProjectChat from './ProjectChat';
import AuditLog from './AuditLog';
import ProjectMembers from './ProjectMembers';

export default function ProjectTabs({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [tab, setTab] = useState<'canvas'|'notes'|'chat'|'members'|'audit'>('canvas');

  const TabBtn = ({ id, label }: { id: typeof tab; label: string }) => (
    <button
      className={`px-4 py-2 rounded-xl border ${tab===id ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
      onClick={() => setTab(id)}
    >
      {label}
    </button>
  );

  return (
    <div className="p-3 md:p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-semibold">{projectName}</h1>
        <div className="flex gap-2">
          <TabBtn id="canvas" label="Canvas" />
          <TabBtn id="notes" label="Notes" />
          <TabBtn id="chat" label="Chat" />
          <TabBtn id="members" label="Members" />
          <TabBtn id="audit" label="Audit" />
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft p-3 md:p-4">
        {tab === 'canvas' && <FlowCanvas projectId={projectId} />}
        {tab === 'notes' && <NotesBoard projectId={projectId} />}
        {tab === 'chat' && <ProjectChat projectId={projectId} />}
        {tab === 'members' && <ProjectMembers projectId={projectId} />}
        {tab === 'audit' && <AuditLog projectId={projectId} />}
      </div>
    </div>
  );
}