export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Project: {params.id}</h1>
      <p>This minimal page replaces missing imports so your build succeeds.</p>
      <p>You can add real features later.</p>
    </main>
  );
}
