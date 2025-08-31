# What this patch changes

1) **layout.tsx is now a Server Component** (no 'use client') and is the ONLY place exporting:
   - `export const dynamic = 'force-dynamic'`
   - `export const revalidate = 0`
   - `export const fetchCache = 'force-no-store'`

2) **Pages no longer export `revalidate`** or `dynamic`. They inherit from `layout.tsx`.

3) **not-found.tsx** is simplified with **no exports**. Special files like `not-found.tsx` must NOT export `revalidate`.

4) **If your repo has `app/_not-found/page.tsx`, DELETE that file.**
   Only keep `app/not-found.tsx`.

## How to apply

- Replace the files at the exact paths below.
- Delete `app/_not-found/page.tsx` if it exists.
- Commit & push.
- In Vercel, Redeploy (Clear build cache).

Paths:
- app/layout.tsx
- app/page.tsx
- app/dashboard/page.tsx
- app/not-found.tsx
