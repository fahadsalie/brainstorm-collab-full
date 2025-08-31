'use client';
import React from 'react';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, addDoc, collection } from 'firebase/firestore';
import { useAuth } from './AuthProvider';

// Replace uuid package with the Web Crypto API (built-in)
const uuid = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

export default function FlowCanvas() {
  const { user } = useAuth();
  return (
    <div style={{ padding: '1rem', border: '1px solid #334', borderRadius: 8 }}>
      <p>Flow Canvas (placeholder)</p>
      <p>Example id: {uuid()}</p>
      <p>User: {user ? user.displayName || user.email || user.uid : 'signed out'}</p>
    </div>
  );
}
