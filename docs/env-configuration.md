# .Env Configuration

Dieses Projekt nutzt Umgebungsvariablen aus einer lokalen `.env` (wird von Git ignoriert).

## Minimal-Setup (empfohlen)

Lege im Projekt-Root eine Datei `.env` an (oder kopiere `.env.example` → `.env`) und setze:

- `VERCEL_URL`: **Production-URL** deines Vercel-Projekts (z. B. `https://my-project.vercel.app`)
- `VERCEL_DEPLOY_HOOK`: Deploy-Hook-URL aus Vercel (siehe unten)
- `USE_SSL`: nur für lokale Dev-SSL (optional)

Beispiel:

```env
VERCEL_URL="https://my-project.vercel.app"
VERCEL_DEPLOY_HOOK="https://api.vercel.com/v1/integrations/deploy/...."
USE_SSL=false
```

## Deploy Hook erstellen (Vercel Dashboard)

1. Vercel Dashboard öffnen → Projekt auswählen
2. **Settings** → **Git** → Abschnitt **Deploy Hooks**
3. **Create Hook**
   - Name: z. B. `manual-hook`
   - Branch: normalerweise `main`
   - Environment: **Production** (oder Preview, falls gewünscht)
4. Hook-URL kopieren und als `VERCEL_DEPLOY_HOOK` in `.env` eintragen

## Deploy per Hook auslösen

Sobald `VERCEL_DEPLOY_HOOK` gesetzt ist:

```bash
npm run dep
```

Das sendet einen `POST` an die Hook-URL und startet einen neuen Deploy.
