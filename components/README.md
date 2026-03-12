# Bunny Player Component

Eigenständige Komponente für den Bunny.net Video Player. Enthält HTML, CSS und JavaScript – funktioniert ohne das Haupt-App-Bundle.

## Verwendung

### Option A: Webflow Embed (empfohlen für mehrere Seiten)

1. Öffne **Project Settings → Custom Code** in Webflow
2. Füge den **kompletten Inhalt** von `bunny-player-embed.html` in **Footer Code** (vor `</body>`) ein
3. Auf jeder Seite: Füge ein **Embed**-Element ein und nutze nur den Player-Container:

```html
<div
  data-bunny-player
  data-library="759"
  data-video="eb1c4f77-0cda-46be-b47d-1118ad7c2ffe"
  data-thumbnail="https://example.com/poster.jpg"
  data-autoplay="false"
  data-muted="true"
  data-loop="false"
></div>
```

### Option B: Pro Seite

Kopiere den gesamten Inhalt von `bunny-player-embed.html` in ein Embed-Element auf der jeweiligen Seite (z.B. vor dem schließenden Body).

### Option C: Als Webflow Symbol (wiederverwendbar)

1. Füge den **kompletten Inhalt** von `bunny-player-embed.html` einmalig in **Footer Code** ein (wie Option A)
2. Erstelle ein **Symbol** mit einem **Embed**-Element
3. Im Embed nur den Player-Container einfügen (siehe HTML unten)
4. Über **Symbol Settings** kannst du `data-library` und `data-video` als Custom Attributes hinzufügen, damit sie pro Instanz überschrieben werden können

**Hinweis:** Style und Script müssen nur einmal pro Seite/Website geladen werden. Der Player-Container (`<div data-bunny-player ...>`) kann beliebig oft vorkommen.

## Attribute

| Attribut | Typ | Beschreibung |
|----------|-----|--------------|
| `data-library` | string | **Pflicht.** Video Library ID |
| `data-video` | string | **Pflicht.** Video ID |
| `data-thumbnail` | string | Custom Poster-URL |
| `data-autoplay` | boolean | Autoplay (`true`/`false`) |
| `data-muted` | boolean | Stumm starten |
| `data-loop` | boolean | Endlosschleife |
| `data-preload` | boolean | Vorladen |
| `data-start` | string | Startzeit (z.B. `30` oder `1m30s`) |
| `data-fullscreen` | boolean | Fullscreen erlauben |
| `data-playsinline` | boolean | Inline auf Mobile |
| `data-remember-position` | boolean | Position merken |
| `data-captions` | string | Caption-Code |

## Mehrere Player pro Seite

Mehrere Player werden automatisch erkannt:

```html
<div data-bunny-player data-library="759" data-video="video-1"></div>
<div data-bunny-player data-library="759" data-video="video-2" data-thumbnail="https://..."></div>
```

## CSS-Anpassung

Die Komponente nutzt `[data-bunny-player]` als Hauptselektor. Überschreibe Styles z.B. so:

```css
[data-bunny-player] {
  aspect-ratio: 4 / 3; /* z.B. anderes Format */
  border-radius: 8px;
}
```
