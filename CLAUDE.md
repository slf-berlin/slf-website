# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for **Stadt Land Fluss PartG mbB**, a Berlin urban-planning practice founded 1992. Partners: Georg Börsch-Supan, Samir Hamzeh, Barbara Horst. J. Miller Stevens (founder) remains a consultant.

Design direction: **Bold Editorial** (merged from `style/bold-archi`). Reference source: `_design/direction-a.jsx` and `_design/screenshots/`.

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

- Section labels: 11px, `letterSpacing: '0.12em'`
- Project meta: 11px, `letterSpacing: '0.08–0.1em'`
- Titles: `fontWeight: 400`, `letterSpacing: '-0.015em'`

#### Style conventions (apply everywhere)

- **No uppercase text** — do not use `textTransform: 'uppercase'`. Labels keep their natural casing.
- **No khaki text** — do not use `accent` / `accentDeep` (`#ccc8a6` / `#8a8765`) as a text color. Use `ink` for primary and `mute` for secondary text. The khaki tokens are reserved for non-text accents only.
- **No border-radius** — all interactive elements (buttons, BackToTop, overlays) use `borderRadius: 0`. Flat geometry only.
- **Hover inversion** — interactive buttons invert ink↔bg on hover (`background: A.ink, color: A.bg`) with a 0.15s transition. Use for BackToTop and similar standalone action buttons.
- **Animated underlines on nav/filter tabs** — use an absolutely-positioned `<span>` with `width: 0% → 100%` transition (`0.25s ease`) rather than `borderBottom`. Active state: no transition (instant). Hovered non-active state: animated slide-in.
- **Font weight for active states** — active filter/nav links use `fontWeight: 600`; inactive use `fontWeight: 500`.

### Layout conventions

- Horizontal padding: **56px** desktop, **20px** mobile
- 12-column grid via `gridTemplateColumns: 'repeat(12, 1fr)'`, gap 24px
- Section label: column 1 (`'1 / span 1'`), content: columns 3–10
- Global max-width: `1400px`, centered in `App.jsx`

### Responsive breakpoints

All components use the `useWindowWidth()` hook (`src/hooks/useWindowWidth.js`) — no CSS media queries.

| Breakpoint | Used by |
|---|---|
| `< 640px` | Projekte grid, Team grid, ProjectDetail prose |
| `< 768px` | Nav, Home, Kontakt, Buero, Team, Footer |
| `< 1024px` | Footer, Team grid |

### Routing (`src/App.jsx`)

| URL | Component |
|---|---|
| `/` | `src/pages/Home.jsx` |
| `/projekte` | `src/pages/Projekte.jsx` |
| `/projekte/:id` | `src/pages/ProjectDetail.jsx` |
| `/buero` | `src/pages/Buero.jsx` |
| `/buero/ueber-uns` | `src/pages/Buero.jsx` |
| `/buero/leistungen` | `src/pages/Buero.jsx` |
| `/buero/team` | `src/pages/Team.jsx` |
| `/kontakt` | `src/pages/Kontakt.jsx` |
| `/impressum` | `src/pages/Impressum.jsx` |
| `/datenschutz` | `src/pages/Datenschutz.jsx` |
| `*` | Redirect → `/` |

`ScrollToTop` in `App.jsx` scrolls to top on route change, or smooth-scrolls to hash anchors with an 80px offset (nav height).

### Components

**`src/components/Nav.jsx`** — sticky nav with:
- Desktop: hover-activated dropdown panels (120ms close delay via `closeTimer` ref)
- Mobile (< 768px): hamburger → full-screen overlay
- Active state: `pathname` match highlights link with `accent` underline
- Nav items and dropdown children defined in the `navItems` array at the top of `Nav.jsx`. Projekte dropdown items generated from `PROJEKTE_NAV` in `src/data/filters.js`.

**`src/components/Footer.jsx`** — 4-column grid (logo/partners | address | navigation | legal). Collapses to 2-col on tablet (< 1024px), 1-col on mobile.

**`src/components/ProjectImage.jsx`** — reusable image tile with:
- Props: `proj`, `ratio` (`'16/10'|'4/3'|'3/2'|'1/1'`), `title`, `style`
- Aspect ratio via padding-top percentage. Striped placeholder background while no image (diagonal for `tone:'photo'`, vertical for `tone:'plan'`).
- Hover: image scale(1.03) + dark gradient overlay + optional title fade-in.

**`src/components/ProjectFeedItem.jsx`** — single project row for the Projekte list view.

**`src/components/BackToTop.jsx`** — fixed scroll-to-top button. Appears after 500px scroll (`window.scrollY > 500`). Positioned `bottom: 40, right: 40, zIndex: 200`. Inverts ink↔bg on hover. Used on Buero, Projekte, Team, and ProjectDetail pages. Add it to any new long-scroll page.

### Pages

**`src/pages/Team.jsx`** — dedicated team page at `/buero/team`. Renders `TEAM` from `src/data/team.js` as a responsive photo grid (`<TeamCard>`). Clicking a card opens a `<Modal>` overlay with full bio (photo + CV timeline + Aufgabenfelder). Modal closes on Esc, outside click, or × button. Grid columns: 2 (< 640px) / 3 (640–1023px) / 4 (≥ 1024px).

**`src/pages/Buero.jsx`** — single-page layout, three numbered sections:
- **01 / Büro** — intro text (from WP page ID 18) + 3-image gallery (Stadt / Land / Wasser, WP CDN URLs)
- **02 / Leistungen** — `LEISTUNGEN` array (8 services), rendered as a 2-column grid spanning cols 3–11
- **03 / Team** — inline preview of partners; links to `/buero/team` for the full team page.
- **Closing image** — full-width office photo at the bottom (WP CDN), followed by `<BackToTop />` then `<Footer />`.

**`src/pages/Kontakt.jsx`** — contact info (address + phone/email) in cols 3–6, then a full-width `<Anfahrt>` section with a local SVG map (`public/anfahrt_karte.svg`, served via `import.meta.env.BASE_URL`).

**`src/pages/Impressum.jsx`** — static Impressum legal page.

**`src/pages/Datenschutz.jsx`** — static Datenschutz (privacy policy) page.

### Data

**`src/data/team.js`** — `TEAM` array (7 members). Each entry: `name`, `email` (null if not public), `photo` (WP CDN URL), `ausbildung`, `rolle`, `cv` (array of `[jahre, text]` tuples), `aufgaben`, `isPartner` (bool). Partners are Börsch-Supan, Hamzeh, Horst, and Stevens (as Freier Mitarbeiter).

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

`ort`, `flaeche`, `auftraggeber` are `null` — WP has no dedicated ACF fields for these. If the client wants more structured metadata, add ACF fields in WordPress and update `scripts/sync-from-wordpress.mjs`.

**`src/data/filters.js`** — three exports:
- `PROJEKTE_NAV` — array of `{ label, key }` filter tabs (key `null` = show all)
- `FILTER_FN` — map of `key → (project) => boolean` predicate functions
- `filterHref(key)` — returns `/projekte` or `/projekte?filter=<key>`

Filtering on `/projekte` reads `?filter=` from `useSearchParams()` and applies `FILTER_FN[key]`.

**`scripts/sync-from-wordpress.mjs`** — Node ESM script. Paginates WP posts, maps each to a project object, writes `src/data/projects.js`. WordPress category slugs → React `kategorie` label:

| WP slug | `kategorie` |
|---|---|
| `entwicklungskonzepte` | `Entwicklungskonzepte` |
| `wettbewerbe` | `Wettbewerbe` |
| `bauleitplanung` | `Bauleitplanung` |
| `verfahrensbetreuung` | `Verfahrensbetreuung` |

Posts in multiple WP categories: first matching category wins. Posts with no known category are silently skipped (with a warning log). If WP is unreachable and `projects.js` already exists, the script exits cleanly so the build succeeds with stale data.

**`content` field** — the `extractLayout` function parses Elementor HTML and outputs compact layout-preserving HTML:

| Elementor section | Output HTML |
|---|---|
| `col-100` (text or image) | content directly |
| `col-50` + `col-50` | `<div class="slf-row"><div class="slf-col-50">…</div><div class="slf-col-50">…</div></div>` |
| `col-33` × 3 | `<div class="slf-row">` with three `slf-col-33` children |
| `col-33` + `col-66` (Projektdaten rows) | aggregated into `<dl class="slf-daten">` |
| Spacers, dividers | skipped |
| Captioned images | `<figure><img/><figcaption>…</figcaption></figure>` |

These classes are styled in the `PROSE_STYLES` constant in `src/pages/ProjectDetail.jsx` using flexbox (`flex: 1 1 0` for col-50/33, `flex: 2 1 0` for col-66). Mobile (< 640px) collapses all rows to a single column.

### Project grid (`src/pages/Projekte.jsx`)

Responsive column count: `< 640px` → 1 col · `640–1023px` → 2 cols · `≥ 1024px` → 3 cols.

### Hero hover interaction (`src/pages/Home.jsx`)

The hero image (`deckblatt-homepage-v3.jpg`) is a composite JPG of 3 sub-images with white gaps. Five absolutely-positioned flex segments (3 hotspots + 2 gap spacers) map to `LEISTUNGEN[0–2]`. `hoveredLeistung` state drives overlay opacity.

Flex proportions (measured at 1400px width):

| Segment | Flex | Role |
|---|---|---|
| `0 0 31.64%` | Image 1 | Konzeptionell |
| `0 0 2.43%` | Gap 1 | inactive |
| `0 0 31.79%` | Image 2 | Städtebau |
| `0 0 2.36%` | Gap 2 | inactive |
| `1` | Image 3 | Bauleitplanung |

If the hero image is replaced, re-measure gaps and update the segment array in `Home.jsx`.

Hero overlay text sizing is computed dynamically: `titleFontSize = Math.min(max, Math.floor(segWidth / (charCount * 0.52)))` where 0.52 is the D-DIN character width ratio. This prevents "Quartiersentwicklung" (20 chars) from wrapping. Description text is hidden below `width < 1000` (`showDesc` flag).

### Project detail page (`src/pages/ProjectDetail.jsx`)

Route: `/projekte/:id`. Layout:
- **Hero image** — full-bleed width, aligned to text column (cols 3–10), touches the nav. `← Alle Projekte` overlaid at `top: 20px, left: 56px`.
- **Content** — rendered via `dangerouslySetInnerHTML` from `project.content`. All transforms done at sync time.
- **Prev/Next navigation** — links to adjacent projects by index in `projects` array.

## Design tooling

**`project/design-canvas.jsx`** — standalone Figma-style design canvas for mocking up page variants. Drop it into any HTML file that loads React + ReactDOM as globals.

API:
```jsx
<DesignCanvas>
  <DCSection id="buero" title="Büro variants" subtitle="Layout options">
    <DCArtboard id="a" label="Option A" width={1280} height={800}>…</DCArtboard>
  </DCSection>
</DesignCanvas>
```

- **Pan/zoom** — trackpad pinch, two-finger scroll, mouse wheel, middle-drag, or primary-drag on background
- **Reorder** — grip-drag artboards within a section
- **Rename** — click label to inline-edit; section titles also editable
- **Delete** — kebab menu → two-click confirm
- **Focus mode** — expand button or click label → fullscreen; ←/→ within section, ↑/↓ across sections, Esc exits
- **Export** — PNG (3×) or standalone HTML per artboard
- **Persistence** — viewport → `localStorage`; order/labels/hidden → `.design-canvas.state.json` via `window.omelette.writeFile`

Exports: `window.{DesignCanvas, DCSection, DCArtboard, DCPostIt}`.

## Static assets (`public/`)

| File | Role |
|---|---|
| `public/favicon.svg` | Site favicon, referenced in `index.html` |
| `public/anfahrt_karte.svg` | Anfahrt map on Kontakt page (local copy, not WP CDN) |
| `public/SLF_Logo_notext.svg` | Logo without text (light version) |
| `public/SLF_Logo_notext_b.svg` | Logo without text (dark/bold version) |

Always serve static assets via `import.meta.env.BASE_URL + 'filename'` so the path resolves correctly when deployed to a subdirectory (GitHub Pages).

## Suggested next steps

1. **SEO** — per-page `<title>` / `<meta>` (react-helmet or Vite plugin)
2. **Responsive** — currently optimized for ≥ 768px desktop; sub-768 needs further work
