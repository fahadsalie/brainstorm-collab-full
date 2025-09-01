export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DashboardPage() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>This page renders dynamically with no caching conflicts.</p>
      <a href="/" className="text-blue-500 underline">Back home</a>
    </main>
  );
}
