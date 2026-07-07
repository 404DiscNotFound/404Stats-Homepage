# 404Stats — Minecraft Design System

## Verwendung

1. CSS-Datei einbinden:
```html
<link rel="stylesheet" href="404stats-minecraft-design.css">
```

2. Tokens in CSS nutzen:
```css
.my-element {
  background: var(--mc-surface);
  border: 1px solid var(--mc-border);
  color: var(--mc-text);
}
```

## Farbpalette

| Token | Hex | Verwendung |
|---|---|---|
| `--mc-bg` | `#121213` | Seitenhintergrund |
| `--mc-surface` | `#313233` | Karten / Panels |
| `--mc-surface-2` | `#3A3A3B` | Hover / erhöht |
| `--mc-surface-3` | `#48494A` | Border-Hover |
| `--mc-border` | `#1E1E1F` | Standardrahmen |
| `--mc-green` | `#5BA033` | Primärfarbe (Grasgrün) |
| `--mc-green-dark` | `#2D5E1A` | Primärfarbe gedrückt |
| `--mc-purple` | `#8B4FE8` | Akzentfarbe (Lila) |
| `--mc-red` | `#B33A3A` | Destructive |
| `--mc-text` | `#FFFFFF` | Text |
| `--mc-text-muted` | `#8A8A8A` | Sekundärer Text |
| `--mc-text-dim` | `#5A5A5A` | Gedimmter Text |

## Fonts

- **Headings:** `MinecraftTen` (Pixel-Display-Font)
- **Body:** `MinecraftRegular` (Pixel-Body-Font)
- **Mono:** `ui-monospace` (System)

Fonts werden automatisch via CDN geladen.

## Utility-Klassen

| Klasse | Effekt |
|---|---|
| `.mc-btn-3d` | 3D-Minecraft-Button mit Inset-Schatten |
| `.mc-panel` | Panel mit eingraviertem Border-Effekt |
| `.mc-card` | Standard-Karte (Surface + Border) |
| `.pixelated` | Pixelated image rendering |
| `.mc-grid-bg` | Subtile 40px-Raster-Hintergrund |
| `.glitch-text` | Glitch-Animation (benötigt `data-text` Attribut) |
| `.mc-text-green` / `.mc-text-purple` | Akzentfarben |
| `.mc-border-green` / `.mc-border-purple` | Akzent-Border |
| `.mc-bg-green` / `.mc-bg-purple` | Akzent-Hintergrund |

## Beispiel

```html
<button class="mc-btn-3d">Klick mich</button>

<div class="mc-card mc-panel">
  <h3>Panel-Titel</h3>
  <p>Inhalt hier</p>
</div>

<h1 class="glitch-text" data-text="404">404</h1>
```

## Radius

Alle Ecken sind **0px** — Minecraft-typisch scharfkantig.
