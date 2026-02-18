#!/usr/bin/env bash
set -euo pipefail

# ─── Webflow Dev Setup — Project Initializer ───────────────────────
# Run once after cloning the template:  ./scripts/setup.sh

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   Webflow Dev Setup — Project Setup      ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── 1. Vercel URL ──────────────────────────────────────────────────
read -rp "Vercel Production URL (e.g. https://my-project.vercel.app): " VERCEL_URL
VERCEL_URL="${VERCEL_URL%/}"  # strip trailing slash

if [[ -z "$VERCEL_URL" ]]; then
  echo "⚠  No URL provided — you can set VERCEL_URL in .env later."
  VERCEL_URL='https://YOUR-PROJECT.vercel.app'
fi

# ── 2. Deploy Hook (optional) ─────────────────────────────────────
echo ""
echo "Deploy Hook URL triggers a Vercel redeploy via POST."
echo "Create one at: Vercel Dashboard → Settings → Git → Deploy Hooks"
read -rp "Deploy Hook URL (leave empty to skip): " DEPLOY_HOOK

# ── 3. Write .env ─────────────────────────────────────────────────
cat > .env <<EOF
## Project environment variables (git-ignored)

VERCEL_URL="${VERCEL_URL}"
VERCEL_DEPLOY_HOOK="${DEPLOY_HOOK}"
USE_SSL=false
EOF

echo ""
echo "✅  .env created"

# ── 4. Install dependencies ───────────────────────────────────────
echo ""
echo "Installing dependencies …"
npm install --silent 2>/dev/null || npm install
echo "✅  Dependencies installed"

# ── 5. Summary ────────────────────────────────────────────────────
echo ""
echo "┌──────────────────────────────────────────┐"
echo "│  Setup complete!                         │"
echo "├──────────────────────────────────────────┤"
echo "│                                          │"
echo "│  Next steps:                             │"
echo "│                                          │"
echo "│  1. In Webflow Designer:                 │"
echo "│     • page-wrapper → data-taxi           │"
echo "│     • main-wrapper → data-taxi-view      │"
echo "│                                          │"
echo "│  2. In Webflow Head Code, add:           │"
echo "│     <script defer                        │"
echo "│       src=\"http://localhost:6545/app.js\"  │"
echo "│       onerror=\"onErrorLoader()\">          │"
echo "│     </script>                            │"
echo "│     (see README for full snippet)        │"
echo "│                                          │"
echo "│  3. Start developing:                    │"
echo "│     npm run dev                          │"
echo "│                                          │"
echo "│  4. Deploy:                              │"
echo "│     git push  (auto-deploys to Vercel)   │"
echo "│     npm run dep  (manual deploy hook)    │"
echo "│                                          │"
echo "└──────────────────────────────────────────┘"
echo ""
