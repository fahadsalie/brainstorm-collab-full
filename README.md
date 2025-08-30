# Brainstorm Collab — Apple-style

- White Visio canvas (shapes, connectors, pen, text)
- Multi-project dashboard, chat (dashboard + project), notes, audit
- Invite by email + copy share link (invited users auto-added on first visit)
- Light/Dark theme, mobile friendly
- Next.js App Router + Firebase Auth/Firestore

## Deploy
1. Push to GitHub → Import on Vercel.
2. In **Vercel → Settings → Environment Variables**, add all keys from `.env.example`.
3. In **Firebase Console → Firestore → Rules**, paste `firestore.rules` and **Publish**.
4. Redeploy in Vercel with **Clear build cache**.


## Environment variables (Vercel)
Set these in your Vercel project (Project Settings → Environment Variables). Do **not** commit `.env.local` inside the repo.

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- (optional) NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

## Local development
1. Copy `.env.example` to `.env.local` at the **project root**, fill values.
2. `npm i`
3. `npm run dev`

## Firestore rules
Use `firestore.rules` from the repo, and publish them in Firebase Console.

## Troubleshooting
- If you see “Firebase not configured”, it means one or more env vars are missing. The dashboard page will print which keys are missing.
- If builds fail on Vercel after code changes, try “Clear build cache” and redeploy.
- Keep Node 18+ on Vercel (the default is fine). You can also add to `package.json`:
  ```json
  "engines": { "node": ">=18" }
  ```
