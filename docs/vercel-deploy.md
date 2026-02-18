# Vercel Deployment

## Automatic Deploys (GitHub → Vercel)

When you connect your GitHub repo to Vercel, every `git push` to `main` triggers an automatic build and deployment.

### Setup

1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository
2. Vercel auto-detects the build settings from `vercel.json`
3. The first deploy happens immediately

### Important: No pnpm-lock.yaml

This project uses `npm`. If a `pnpm-lock.yaml` file exists, Vercel will try to use `pnpm` instead, which breaks the build. Make sure only `package-lock.json` is present.

## Manual Deploy (CLI)

If automatic deploys aren't working (e.g. Git author not authorized on the Vercel team), you can deploy manually:

```bash
# Build locally
npm run bundle

# Build for Vercel
npx vercel build --prod

# Deploy from a clean directory (bypasses git author check)
mkdir -p /tmp/wds-deploy
cp -r .vercel /tmp/wds-deploy/
cp -r dist /tmp/wds-deploy/
npx vercel deploy --prebuilt --prod --yes --cwd /tmp/wds-deploy
rm -rf /tmp/wds-deploy
```

## Deploy Hook

A Deploy Hook lets you trigger a deploy via HTTP POST (useful for scripts or CI):

```bash
npm run dep
```

Set `VERCEL_DEPLOY_HOOK` in your `.env` file. Create a hook in the Vercel Dashboard under **Settings → Git → Deploy Hooks**.

## Troubleshooting

### Build fails with "spawn pnpm ENOENT"
Delete `pnpm-lock.yaml` from the repo. Only `package-lock.json` should exist.

### "Git author must have access to the team"
The Vercel CLI checks the local git author email against the Vercel team members. Either add the email to your team or use the manual deploy method above.

### Files return 404 on Vercel
Check that `outputDirectory` in `vercel.json` is set to `"dist"` and that `npm run bundle` produces files in `dist/`.
