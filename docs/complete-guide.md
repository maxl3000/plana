# Komplette Anleitung: Neues Webflow-Projekt aufsetzen

> Von Null bis zum Live-Deployment fuer deinen Kunden.

---

## Uebersicht: Was passiert wo?

```
Du programmierst          Vercel baut & hostet       Webflow laedt den Code
in Cursor (lokal)    -->  JS + CSS Dateien      -->  und zeigt ihn an
     |                         |                          |
  src/modules/*.ts        app.js, out.css           data-module="..."
  src/styles/*.css        app.css                   im Head Code verlinkt
     |                         |
  git push             automatischer Deploy
```

**Dein Kunde sieht die Webflow-Seite. Dein Code wird ueber Vercel geladen.**

---

## Phase 1: Neues Projekt erstellen

### 1.1 — GitHub: Repo aus Template erstellen

1. Gehe zu **https://github.com/maxl3000/webflow-dev-setup**
2. Klicke auf **"Use this template"** → **"Create a new repository"**
3. Name: z.B. `kundenname-webflow` (private empfohlen)
4. Klicke **"Create repository"**

### 1.2 — Mac Terminal: Projekt klonen

Oeffne das Terminal (oder das Cursor-Terminal) und fuehre aus:

```bash
cd ~/Cursor\ Projects
git clone https://github.com/maxl3000/kundenname-webflow.git
cd kundenname-webflow
```

### 1.3 — Cursor: Projekt oeffnen

In Cursor: **File → Open Folder** → den geklonten Ordner auswaehlen.

---

## Phase 2: Vercel einrichten

### 2.1 — Vercel: Projekt importieren

1. Gehe zu **https://vercel.com/new**
2. Klicke **"Import Git Repository"** → waehle dein neues Repo aus
3. Vercel erkennt die Build-Einstellungen automatisch aus `vercel.json`
4. Klicke **"Deploy"**
5. Warte bis der erste Deploy fertig ist (ca. 30 Sekunden)
6. **Notiere die URL**, z.B. `https://kundenname-webflow.vercel.app`

### 2.2 — Vercel: Deploy Hook erstellen (optional, aber empfohlen)

1. Im Vercel Dashboard: dein Projekt auswaehlen
2. **Settings** → **Git** → runterscrollen zu **"Deploy Hooks"**
3. **Create Hook**:
   - Name: `manual`
   - Branch: `main`
4. Die angezeigte URL kopieren (sieht aus wie `https://api.vercel.com/v1/integrations/deploy/...`)

### 2.3 — Cursor Terminal: Setup-Wizard ausfuehren

```bash
npm run setup
```

Der Wizard fragt:
- **Vercel URL** → die URL aus Schritt 2.1 einfuegen
- **Deploy Hook** → die URL aus Schritt 2.2 einfuegen (oder leer lassen)

Das erstellt die `.env`-Datei und installiert alle Dependencies.

---

## Phase 3: Webflow einrichten

### 3.1 — Webflow Designer: Taxi.js Attribute setzen

Diese Attribute braucht jede Seite fuer Page Transitions:

1. Oeffne dein Webflow-Projekt im Designer
2. Waehle das Element **`div.page-wrapper`** aus
3. Rechts unter **Settings (Zahnrad)** → **Custom Attributes**:
   - Name: `data-taxi`
   - Value: _(leer lassen)_
4. Waehle das Element **`main.main-wrapper`** aus
5. Custom Attributes:
   - Name: `data-taxi-view`
   - Value: _(leer lassen)_

### 3.2 — Webflow: Head Code einfuegen

Gehe zu **Project Settings** → **Custom Code** → **Head Code** und fuege ein:

```html
<!-- Performance Timing (optional) -->
<script>
(function(){ window.TICK_FIRST_HIT = performance.now(); })();
</script>

<!-- JS: versucht zuerst localhost (Dev), faellt auf Vercel zurueck -->
<script>
  function onErrorLoader() {
    var s = document.createElement("script");
    s.src = "https://DEINE-URL.vercel.app/app.js";
    s.defer = true;
    document.head.appendChild(s);
  }
</script>
<script defer src="http://localhost:6545/app.js" onerror="onErrorLoader()"></script>

<!-- CSS: versucht zuerst localhost (Dev), faellt auf Vercel zurueck -->
<link rel="stylesheet" href="http://localhost:6545/out.css"
  onerror="this.onerror=null;this.href='https://DEINE-URL.vercel.app/out.css'" />
<link rel="stylesheet" href="http://localhost:6545/app.css"
  onerror="this.onerror=null;this.href='https://DEINE-URL.vercel.app/app.css'" />
```

**Wichtig:** Ersetze `DEINE-URL.vercel.app` durch deine echte Vercel-URL!

### 3.3 — Webflow: Publish

Klicke **"Publish"** in Webflow damit die Head-Code-Aenderungen live gehen.

---

## Phase 4: Entwickeln in Cursor

### 4.1 — Dev Server starten

Im Cursor-Terminal:

```bash
npm run dev
```

Das startet einen lokalen Server auf `http://localhost:6545`.
Solange der laeuft, laedt Webflow deinen lokalen Code (Live-Reload!).

### 4.2 — Module erstellen

Erstelle eine neue Datei in `src/modules/`, z.B. `src/modules/hero.ts`:

```typescript
import { onMount, onDestroy, onView } from "@/modules/_";

export default function (element: HTMLElement) {
  onMount(() => {
    console.log("Hero geladen!", element);
    // Dein Code hier
  });

  onView(element, {
    threshold: 0.2,
    callback: ({ isIn }) => {
      element.classList.toggle("in-view", isIn);
    },
  });

  onDestroy(() => {
    // Aufraemen bei Page Transition
  });
}
```

### 4.3 — Modul in Webflow aktivieren

Im Webflow Designer:
1. Waehle das Element aus, das das Modul nutzen soll
2. **Settings (Zahnrad)** → **Custom Attributes**:
   - Name: `data-module`
   - Value: `hero` ← der Dateiname ohne `.ts`

### 4.4 — CSS bearbeiten

- **`src/styles/app.css`** → Haupt-Stylesheet (wird zu `app.css`)
- **`src/styles/out.css`** → Separates Stylesheet (wird zu `out.css`)

Aenderungen werden automatisch im Browser aktualisiert wenn `npm run dev` laeuft.

### 4.5 — Testen

1. Oeffne deine Webflow-Seite im Browser (die `.webflow.io` URL)
2. Druecke **F12** → **Console**
3. Du solltest deine `console.log` Meldungen sehen
4. Die Dateien werden von `localhost:6545` geladen (sichtbar im **Network** Tab)

---

## Phase 5: Aenderungen fuer den Kunden live schalten

### Das ist der wichtigste Teil!

Wenn du lokal entwickelst, sieht nur DU die Aenderungen (weil sie von `localhost` kommen).
Damit dein Kunde sie auch sieht, musst du deployen.

### Methode A: Git Push (empfohlen)

```bash
# Im Cursor-Terminal:
git add -A
git commit -m "Feature: Hero-Animation hinzugefuegt"
git push
```

Vercel baut automatisch und nach ca. 30-60 Sekunden ist die neue Version live.
Dein Kunde sieht die Aenderungen sofort auf der Webflow-Seite.

### Methode B: Deploy Hook

```bash
npm run dep
```

Loest manuell einen Vercel-Deploy aus (wenn du die .env konfiguriert hast).

### Methode C: Manueller CLI Deploy (Notfall)

Falls der automatische Deploy nicht funktioniert:

```bash
npm run bundle
npx vercel build --prod
mkdir -p /tmp/wds-deploy
cp -r .vercel /tmp/wds-deploy/
cp -r dist /tmp/wds-deploy/
npx vercel deploy --prebuilt --prod --yes --cwd /tmp/wds-deploy
rm -rf /tmp/wds-deploy
```

---

## Taeglich wiederkehrender Workflow

```
1. Cursor oeffnen, Projekt laden
2. npm run dev                     ← Dev-Server starten
3. Code schreiben / CSS aendern    ← du siehst Aenderungen sofort
4. Testen im Browser (F12)
5. git add -A && git commit -m "..." && git push   ← Live fuer Kunden
```

Das war's. Schritt 5 ist der einzige, den du brauchst um Aenderungen
fuer deinen Kunden sichtbar zu machen.

---

## Checkliste: Neues Kundenprojekt

- [ ] GitHub: Repo aus Template erstellen
- [ ] Mac: Repo klonen, in Cursor oeffnen
- [ ] Vercel: Repo importieren, URL notieren
- [ ] Vercel: Deploy Hook erstellen (optional)
- [ ] Cursor Terminal: `npm run setup` ausfuehren
- [ ] Webflow: `data-taxi` auf page-wrapper setzen
- [ ] Webflow: `data-taxi-view` auf main-wrapper setzen
- [ ] Webflow: Head Code einfuegen (JS + CSS mit Vercel-URL)
- [ ] Webflow: Publish
- [ ] Cursor: `npm run dev` → testen → `git push` → live!

---

## Haeufige Probleme

| Problem | Loesung |
|---------|---------|
| Aenderungen nur lokal sichtbar | `git push` vergessen! |
| `ERR_CONNECTION_REFUSED` in Console | Normal wenn Dev-Server nicht laeuft. Vercel-Fallback greift. |
| 404 fuer app.js auf Vercel | Vercel-Build pruefen. `npm run bundle` lokal testen. |
| Modul wird nicht geladen | `data-module="name"` in Webflow pruefen. Name = Dateiname ohne `.ts` |
| CSS aendert sich nicht | Hard-Refresh (Cmd+Shift+R) im Browser |
| `pnpm ENOENT` Build-Fehler | `pnpm-lock.yaml` loeschen, nur `package-lock.json` behalten |
| Taxi.js Fehler | `data-taxi` und `data-taxi-view` Attribute in Webflow pruefen |
