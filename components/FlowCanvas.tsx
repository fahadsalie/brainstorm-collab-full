'use client';
import React, { useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Connection, Edge, useEdgesState, useNodesState, Node, OnConnect } from 'reactflow';
import 'reactflow/dist/style.css';
import { collection, onSnapshot, addDoc, doc, setDoc, serverTimestamp, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthProvider';
import { v4 as uuid } from 'uuid';

export default function FlowCanvas({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, 'projects', projectId, 'flowNodes'), snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      setNodes(list as any);
    });
    const unsub2 = onSnapshot(collection(db, 'projects', projectId, 'flowEdges'), snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      setEdges(list as any);
    });
    return () => { unsub1(); unsub2(); };
  }, [projectId, setNodes, setEdges]);

  const onConnect: OnConnect = useCallback(async (params: Edge | Connection) => {
    const id = uuid();
    await setDoc(doc(db, 'projects', projectId, 'flowEdges', id), { ...params, id });
    await addDoc(collection(db, 'projects', projectId, 'audit'), { text: `${user?.displayName} connected nodes`, createdAt: serverTimestamp() });
  }, [projectId, user]);

  const addNode = async () => {
    const id = uuid();
    await setDoc(doc(db, 'projects', projectId, 'flowNodes', id), {
      id, data: { label: 'New Node' }, position: { x: Math.random()*400, y: Math.random()*200 }
    });
  };

  const onNodeDragStop = async (_: any, node: Node) => {
    await setDoc(doc(db, 'projects', projectId, 'flowNodes', node.id), node, { merge: true });
  };

  const renameFirst = async () => {
    const first = (nodes as any[])[0];
    if (!first) return;
    const label = prompt('Node label', (first.data as any)?.label || '') ?? '';
    await setDoc(doc(db, 'projects', projectId, 'flowNodes', first.id), { data: { label } }, { merge: true });
  };

  const clearAll = async () => {
    if (!confirm('Clear all nodes and edges?')) return;
    const nSnap = await getDocs(collection(db, 'projects', projectId, 'flowNodes'));
    for (const d of nSnap.docs) await deleteDoc(d.ref);
    const eSnap = await getDocs(collection(db, 'projects', projectId, 'flowEdges'));
    for (const d of eSnap.docs) await deleteDoc(d.ref);
  };

  return (
    <div className="card p-3 h-[60vh]">
      <div className="flex gap-2 mb-2">
        <button className="btn" onClick={addNode}>Add Node</button>
        <button className="btn" onClick={renameFirst}>Rename First</button>
        <button className="btn" onClick={clearAll}>Clear</button>
      </div>
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onConnect={onConnect} onNodeDragStop={onNodeDragStop}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
