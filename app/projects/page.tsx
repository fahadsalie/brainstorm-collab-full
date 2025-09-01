import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ProjectsPage() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Projects</h1>
      <p>Projects page is alive. Connect Firebase later for data.</p>
    </main>
  );
}
