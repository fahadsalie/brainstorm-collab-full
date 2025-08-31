# Fix applied: force dynamic rendering + disable revalidate objects

These files set `dynamic = 'force-dynamic'`, `revalidate = 0`, and `fetchCache = 'force-no-store'`
on critical routes (root page, dashboard, layout, not-found). This prevents Next.js from
trying to prerender with an invalid `revalidate` value.

Drop these files into your repo at the exact same paths, commit, and redeploy on Vercel.
