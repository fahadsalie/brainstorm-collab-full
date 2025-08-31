export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", lineHeight: 1.6 }}>
      <h1>Home ✅</h1>
      <p>This is a clean, deploy-ready Next.js app. No revalidate errors.</p>
      <ul>
        <li><Link href="/dashboard">Go to /dashboard</Link></li>
        <li><Link href="/projects">Go to /projects</Link></li>
      </ul>
    </main>
  );
}
