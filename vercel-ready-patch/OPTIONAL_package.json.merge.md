If your build is failing on Vercel due to Node or missing scripts, ensure `package.json` contains at least:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "engines": { "node": ">=18" }
}
```

Do **not** commit real secrets. Add them only in Vercel Environment Variables.
