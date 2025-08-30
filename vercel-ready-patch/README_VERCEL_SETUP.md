# GitHub → Vercel setup (no local runs)

Commit these files at the repo root (keeping the same folders: `.github/`, `lib/`, `components/`, etc.).
Then either:
- Use Vercel's GitHub integration (recommended), or
- Use the provided GitHub Action and add secrets.

## 1) Vercel project settings
1. Connect your GitHub repo in Vercel.
2. In **Vercel → Project → Settings → Environment Variables**, add values for all keys from `.env.example`.
3. Redeploy from Vercel.

## 2) Firebase Firestore rules
Paste `firestore.rules` into Firebase Console → Firestore → Rules → **Publish**.

## 3) Optional: GitHub Actions deploy
If you use the provided workflow, add **Actions Secrets** in your repo:
- `VERCEL_TOKEN` (from Vercel Account → Tokens)
- The firebase envs:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)

## 4) Use the EnvGate banner (optional)
If you want a helpful banner in Preview when envs are missing, import `EnvGate` in your `app/layout.tsx` as shown in `app/USAGE_EnvGate_in_layout.example.tsx`.
