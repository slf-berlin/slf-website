# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for **Stadt Land Fluss PartG mbB**, a Berlin urban-planning practice founded 1992. Partners: Georg Börsch-Supan, Samir Hamzeh, Barbara Horst. J. Miller Stevens (founder) remains a consultant.

Design direction: **A — "Editorial Index"**. Reference source: `_design/direction-a.jsx` and `_design/screenshots/`.

## Commands

```bash
npm run dev      # dev server → http://localhost:5173
npm run sync     # fetch projects from WordPress → src/data/projects.js
npm run build    # sync + production build → dist/
npm run preview  # preview production build
```

No test runner is configured.

## Stack

- **Vite + React 18**, pure JSX (no TypeScript)
- **react-router-dom v6** — client-side SPA routing
- All styles are **inline React styles** — no CSS framework, no CSS files
- Design tokens imported from `src/tokens.js` as `{ tokens as A, base }`

## Architecture

### Tokens (`src/tokens.js`)

Two named exports used everywhere:

- `tokens` — color and font values (always imported as `A`)
- `base` — base style object applied to page root divs (`fontFamily`, `color`, `background`, `WebkitFontSmoothing`)

| Token | Value | Role |
|---|---|---|
| `bg` | `#ffffff` | Page background |
| `ink` | `#0e0e10` | Primary text |
| `mute` | `#6b6b6e` | Secondary text, meta |
| `rule` | `#e6e5e2` | Dividers |
| `ruleSoft` | `#f1f0ed` | Subtle dividers |
| `accent` | `#ccc8a6` | Sand khaki (logo color) |
| `accentSoft` | `#f3f1e3` | Very light khaki tint |
| `accentDeep` | `#8a8765` | Dark khaki (section labels) |

### Typography

Primary font: **D-DIN** loaded via CDN in `index.html`. Fallback chain: `"DIN Next LT Pro", "DIN Pro", "Barlow", sans-serif`.

- Section labels: 11px, uppercase, `letterSpacing: '0.12em'`, `accentDeep`
- Project meta: 11px, uppercase, `letterSpacing: '0.08–0.1em'`
- Titles: `fontWeight: 400`, `letterSpacing: '-0.015em'`

### Layout conventions

- Horizontal padding: **56px** desktop, **20px** mobile
- 12-column grid via `gridTemplateColumns: 'repeat(12, 1fr)'`, gap 24px
- Section label: column 1 (`'1 / span 1'`), content: columns 3–10

### Responsive breakpoints

All components use the `useWindowWidth()` hook (`src/hooks/useWindowWidth.js`) — no CSS media queries.

| Breakpoint | `isMobile` context |
|---|---|
| `< 768px` | Nav, Home, ProjectFeedItem |
| `< 640px` | Projekte page |

### Routing (`src/App.jsx`)

| URL | Component |
|---|---|
| `/` | `src/pages/Home.jsx` |
| `/projekte` | `src/pages/Projekte.jsx` |
| `*` | Redirect → `/` |

Pages not yet built: `/buero`, `/buero/ueber-uns`, `/buero/leistungen`, `/buero/team`, `/kontakt`.

### Navigation (`src/components/Nav.jsx`)

Sticky nav with:
- Desktop: hover-activated dropdown panels (120ms close delay via `closeTimer` ref)
- Mobile (< 768px): hamburger → full-screen overlay
- Active state: `pathname` match highlights link with `accent` underline

Nav items and their dropdown children are defined in the `navItems` array at the top of `Nav.jsx`. Projekte dropdown items are generated from `PROJEKTE_NAV` in `src/data/filters.js`.

### Data

**`src/data/projects.js`** — ⚠️ **auto-generated** — do not edit by hand. Regenerated each `npm run build` and on demand with `npm run sync`. Source: WordPress REST API (`https://www.slf-berlin.de/wp-json/wp/v2/posts`). Keep committed in git as a build-time fallback.

Fields per project object:
```
id (WP slug), titel, untertitel (''), beschreibung (WP excerpt stripped),
ort (null), jahr (string|null extracted from Projektdaten), kategorie,
flaeche (null), auftraggeber (null),
tone ('photo'|'plan'), image (WP featured media URL or null),
content (layout-preserving HTML, see below),
wpId, wpDate, wpLink
```

`ort`, `flaeche`, `auftraggeber` are `null` — WP has no dedicated ACF fields for these. `jahr` is extracted from the Projektdaten "Zeitraum" row via `extractZeitraum`. If the client wants more structured metadata, add ACF fields in WordPress and update `scripts/sync-from-wordpress.mjs`.

**`src/data/filters.js`** — three exports:

- `PROJEKTE_NAV` — array of `{ label, key }` filter tabs (key `null` = show all)
- `FILTER_FN` — map of `key → (project) => boolean` predicate functions (exact match on WP category name)
- `filterHref(key)` — returns `/projekte` or `/projekte?filter=<key>`

Filtering on `/projekte` reads `?filter=` from `useSearchParams()` and applies `FILTER_FN[key]`.

**`scripts/sync-from-wordpress.mjs`** — Node ESM script. Paginates through all published WP posts, maps each to a project object, writes `src/data/projects.js`. WordPress category slugs → React `kategorie` label:

| WP slug | `kategorie` |
|---|---|
| `entwicklungskonzepte` | `Entwicklungskonzepte` |
| `wettbewerbe` | `Wettbewerbe` |
| `bauleitplanung` | `Bauleitplanung` |
| `verfahrensbetreuung` | `Verfahrensbetreuung` |

Posts in multiple WP categories: first matching category wins. Posts with no known category are silently skipped (with a warning log). If WP is unreachable and `projects.js` already exists, the script exits cleanly (warning, no overwrite) so the build succeeds with stale data.

**`content` field** — the `extractLayout` function in the sync script parses the full Elementor HTML from `content.rendered` and outputs compact layout-preserving HTML:

| Elementor section | Output HTML |
|---|---|
| `col-100` (text or image) | content directly |
| `col-50` + `col-50` | `<div class="slf-row"><div class="slf-col-50">…</div><div class="slf-col-50">…</div></div>` |
| `col-33` × 3 | `<div class="slf-row">` with three `slf-col-33` children |
| `col-33` + `col-66` (Projektdaten rows) | aggregated into `<dl class="slf-daten">` |
| Spacers, dividers | skipped |
| Captioned images (`<figure class="wp-caption">`) | `<figure><img/><figcaption>…</figcaption></figure>` |

These classes are styled in the `PROSE_STYLES` constant in `src/pages/ProjectDetail.jsx` using flexbox (`flex: 1 1 0` for col-50/33, `flex: 2 1 0` for col-66). Mobile (`< 640px`) collapses all rows to a single column.

### Project grid (`src/pages/Projekte.jsx`)

Responsive column count driven by `useWindowWidth()`:
- `< 640px` → 1 column
- `640–1023px` → 2 columns
- `≥ 1024px` → 3 columns

### Hero hover interaction (`src/pages/Home.jsx`)

The hero image (`deckblatt-homepage-v3.jpg`) is a composite JPG of 3 sub-images with white gaps. Five absolutely-positioned flex segments (3 hotspots + 2 gap spacers) map to `LEISTUNGEN[0–2]`. `hoveredLeistung` state (index or `null`) drives overlay opacity.

Flex proportions (measured at 1400px width):

| Segment | Flex | Role |
|---|---|---|
| `0 0 31.64%` | Image 1 | Konzeptionell |
| `0 0 2.43%` | Gap 1 | inactive |
| `0 0 31.79%` | Image 2 | Städtebau |
| `0 0 2.36%` | Gap 2 | inactive |
| `1` | Image 3 | Bauleitplanung |

If the hero image is replaced, re-measure gaps and update the segment array in `Home.jsx`.

### Project detail page (`src/pages/ProjectDetail.jsx`)

Route: `/projekte/:id`. Layout:
- **Hero image** — full-bleed width, aligned to text column (cols 3–10), touches the nav. `← Alle Projekte` overlaid in absolute position at `top: 20px, left: 56px`.
- **Content** — rendered via `dangerouslySetInnerHTML` from `project.content` (layout HTML from sync). `processContent` is a no-op passthrough — all transforms are done at sync time.
- **Prev/Next navigation** — at the bottom, links to adjacent projects by index in `projects` array.

## Suggested next steps

1. **Büro page** — team presentation and firm history
2. **Kontakt page** — form + map
3. **SEO** — per-page `<title>` / `<meta>` (react-helmet or Vite plugin)
4. **Responsive** — currently optimized for ≥ 768px desktop
