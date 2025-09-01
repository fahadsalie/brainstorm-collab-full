export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Home ✅</h1>
      <p>This is a clean, deploy-ready Next.js app. No revalidate errors.</p>
      <a href="/dashboard" className="text-blue-500 underline">Go to /dashboard</a>
    </main>
  );
}
