# Brainstorm Clean Working (Next.js 14, App Router)

This is a minimal, deploy-ready baseline that fixes the `Invalid revalidate value "[object Object]"` errors on Vercel.

## Deploy steps
1. Upload all files to your GitHub repo (replace existing files).
2. In Vercel → Project → Settings:
   - Install Command: `npm i`
   - Build Command: `npm run build`
   - Root Directory: (leave blank; package.json is at root)
3. Redeploy (Clear build cache).

## Optional Firebase
Add env vars in Vercel if you want Firebase:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- (optional) `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

This project will run even if you don't set those values.
