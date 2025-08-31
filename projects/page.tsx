'use client';

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        if (db) {
          const snap = await getDocs(collection(db, "projects"));
          setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error("Error loading projects:", err);
      }
    }
    loadProjects();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Projects</h1>
      {db ? (
        <ul>
          {projects.map(p => (
            <li key={p.id}>{p.name || "Untitled Project"}</li>
          ))}
        </ul>
      ) : (
        <p><b>Firebase not configured.</b><br/>Add your keys in Vercel → Settings → Environment Variables.</p>
      )}
    </main>
  );
}
