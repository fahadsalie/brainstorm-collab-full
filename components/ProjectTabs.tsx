'use client';
import { useState } from 'react';
import NotesBoard from './NotesBoard';
import FlowCanvas from './FlowCanvas';
import SimpleSheet from './SimpleSheet';
import ChatPanel from './ChatPanel';
import AuditLog from './AuditLog';

export default function ProjectTabs({ projectId }: { projectId: string }) {
  const tabs = ['Notes','Flow','Sheet','Chat','Activity'] as const;
  const [t, setT] = useState<typeof tabs[number]>('Notes');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 space-y-4">
        <div className="flex gap-2">
          {tabs.map(x => (
            <button key={x} className={`tab ${t===x ? 'tab-active' : ''}`} onClick={() => setT(x)}>{x}</button>
          ))}
        </div>
        {t==='Notes' && <NotesBoard projectId={projectId} />}
        {t==='Flow' && <FlowCanvas projectId={projectId} />}
        {t==='Sheet' && <SimpleSheet projectId={projectId} />}
        {t==='Chat' && <div className="xl:hidden"><ChatPanel projectId={projectId}/></div>}
        {t==='Activity' && <div className="xl:hidden"><AuditLog projectId={projectId}/></div>}
      </div>
      <div className="space-y-4 hidden xl:block">
        <ChatPanel projectId={projectId}/>
        <AuditLog projectId={projectId}/>
      </div>
    </div>
  );
}
