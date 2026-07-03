# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for **Stadt Land Fluss PartG mbB**, a Berlin urban-planning practice founded 1992. Partners: Georg Börsch-Supan, Samir Hamzeh, Barbara Horst. J. Miller Stevens (founder) remains a consultant.

Design direction: **Bold Editorial** (merged from `style/bold-archi`). Reference source: `_design/direction-a.jsx` and `_design/screenshots/`.

## Commands

```bash
npm run dev      # dev server → http://localhost:5173/slf-website/
npm run sync     # fetch projects from WordPress → src/data/projects.js
npm run build    # sync + production build → dist/
npm run preview  # preview production build
npm run deploy   # build + publish dist/ to GitHub Pages (gh-pages)
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
- `base` — base style object applied to page root divs (`fontFamily`, `color`, `background`, `WebkitFontSmoothing`, `letterSpacing: '-0.005em'`)

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
| `font` | D-DIN stack | Primary font family string |
| `fontCondensed` | D-DIN Condensed stack | Condensed variant (used sparingly) |

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
- Mobile (< 768px): hamburger → full-screen overlay (links only; no dropdown children)
- Active state: `pathname` match changes link color from `mute` → `ink`; all top-level nav links use `fontWeight: 600` regardless of active state
- Underline accent: absolutely-positioned `<span>` slides in on hover and active (`width: 0 → 100%`, 0.2s ease, height 3px, `A.accent`)
- Nav items and dropdown children defined in the `navItems` array at the top of `Nav.jsx`. Projekte dropdown items generated from `PROJEKTE_NAV` in `src/data/filters.js`. Büro dropdown: "Leistungen" links to `/buero#leistungen` (hash anchor, handled by `ScrollToTop`)
- **Search** — search icon on both desktop (right of nav) and mobile (left of hamburger). Opens a compact dropdown panel (zIndex 400, anchored `top: 80` desktop / `64` mobile, `right: 56` desktop / full-width mobile, max 420px wide) backed by a transparent full-screen click-catcher (zIndex 399) for outside-click close. Input with live results as the user types (min 2 chars), up to 10 matching projects. Searches `titel`, `beschreibung`, `kategorie`. Closes on Esc, × button, or outside click. Implemented via `<SearchButton>`, `<SearchResult>` sub-components.
- **Logo intro animation** — on first full page load (not client-side navigation), the wordmark plays a staggered Stadt → Land → Fluss reveal (`slfWordIn` keyframe, 0.55s, delays 0.08 / 0.26 / 0.44s). Controlled by the module-level `logoIntroDone` flag. Respects `prefers-reduced-motion`.

**`src/components/Footer.jsx`** — 4-column grid (logo/partners | address | navigation | legal). Collapses to 2-col on tablet (< 1024px), 1-col on mobile. Navigation column includes an external link to competitionline. Logo imported from `src/assets/SLF_Logo.svg` (distinct from the public/ logos). Hover underlines via CSS class `footer-nav-link` (injected via `<style>`).

**`src/components/ProjectImage.jsx`** — reusable image tile with:
- Props: `proj`, `ratio` (`'16/10'|'4/3'|'3/2'|'1/1'`), `title`, `subtitle`, `ergebnis`, `style`
- Aspect ratio via padding-top percentage. Striped placeholder background while no image (diagonal for `tone:'photo'`, vertical for `tone:'plan'`).
- Hover: image scale(1.03) + dark gradient overlay + optional title/subtitle/ergebnis fade-in.
- Title/subtitle font sizes are responsive via `useWindowWidth()`: 20/15px (≥ 1024px), 17/13px (640–1023px), 15/12px (< 640px).

**`src/components/SmartImage.jsx`** — `<img>` wrapper with a shimmer loading skeleton that fades out on load. Props mirror `<img>` (`src`, `alt`, `style`, `onClick`, `className`, `fit`) plus `wrapperStyle` for the positioning wrapper. Shimmer keyframes are injected once via the exported `ensureImageStyles()` and respect `prefers-reduced-motion`. Use this instead of a bare `<img>` for remote/WP-CDN images so loads don't flash.

**`src/components/ProjectFeedItem.jsx`** — single project row for the Projekte list view.

**`src/components/BackToTop.jsx`** — fixed scroll-to-top button. Appears after 500px scroll (`window.scrollY > 500`). Positioned `bottom: 40, right: 40, zIndex: 200`. Inverts ink↔bg on hover. Used on Buero, Projekte, Team, and ProjectDetail pages. Add it to any new long-scroll page.

### Pages

**`src/pages/Team.jsx`** — dedicated team page at `/buero/team`. Renders `TEAM` from `src/data/team.js` as a responsive photo grid (`<TeamCard>`). Clicking a card opens a `<Modal>` overlay with full bio (photo + CV timeline + Aufgabenfelder). Modal closes on Esc, outside click, or × button. Grid columns: 2 (< 640px) / 3 (640–1023px) / 4 (≥ 1024px).

**`src/pages/Buero.jsx`** — single-page layout:
- **Hero image** — office photo (WP CDN) at the top, with side padding 36px desktop / 12px mobile (not full-width), `objectPosition: 'center 30%'`, height 500px desktop / 220px mobile.
- **01 / Büro** — hardcoded intro text (two paragraphs) + 3-image gallery (Stadt / Land / Wasser, WP CDN URLs, aspect-ratio 4/3, `objectFit: cover`)
- **02 / Leistungen** — `LEISTUNGEN` array (8 services), each with an inline SVG icon, rendered as a 2-column grid spanning cols 3–11 (`3 / span 9`). Section anchored at `id="leistungen"` for hash navigation.
- **Team** ("Das Team", `id="team"`) — embeds the full team grid inline: imports `TEAM` and renders `<TeamCard>` tiles (2 / 3 / 4 cols at < 640 / 640–1023 / ≥ 1024px), clicking a card opens the bio `<Modal>`. `TeamCard` and `Modal` are defined locally in `Buero.jsx` (duplicated from `Team.jsx`). The standalone `Team.jsx` page still exists and is still routed at `/buero/team` (Nav links there), so team content currently lives in two places — keep both in sync or consolidate.
- **Closing image** — office photo (WP CDN) with the same side padding (36px / 12px), followed by `<BackToTop />` then `<Footer />`.

Note: the numbered section labels ("01 / Büro", "02 / Leistungen", …) have been removed from the page in favor of plain headings.

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
flaeche (null), auftraggeber (null), ergebnis (string|null — competition result, e.g. "1. Preis"),
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

The `projektliste` key is special: it passes all projects through (`() => true`) and renders a **sortable table view** instead of the tile grid. Columns are sortable by Jahr, Auftraggeber, Ort, and Kategorie. `ort` and `auftraggeber` are extracted from the `<dl class="slf-daten">` block inside `project.content` at render time.

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

### Home page (`src/pages/Home.jsx`)

Three sections after the hero (numbered "01 / …" labels have been removed in favor of plain headings):
- **Über uns** — intro text (hardcoded), 2 paragraphs
- **Aktuell** — "Ausgewählte Projekte" feed: 6 hardcoded project IDs in `FEATURED_IDS`, rendered as alternating left/right `<ProjectFeedItem>` rows (first item `large={true}`)
- **Notiz** — short note about the leadership transition to the three current partners

### Hero hover interaction (`src/pages/Home.jsx`)

The hero image (`deckblatt-homepage-v4.jpg`, 2831×1423) is a composite JPG of **4 sub-images** with white gaps. Seven absolutely-positioned flex segments (4 hotspots + 3 gap spacers) map to `LEISTUNGEN[0–3]`. `hoveredLeistung` state drives overlay opacity. Each hotspot is a `<Link>` to `/projekte?filter=<filterKey>` (`filterKey` field on each `LEISTUNGEN` entry; the hover reveal ends with a "Projekte ansehen →" line). The mapping is provisional until projects are re-sorted in WordPress to match the 4 hero themes: Stadtplanung → `entwicklungskonzepte`, Städtebau → `wettbewerbe`, Bauleitplanung → `bauleitplanung`, Verfahrensbetreuung → `verfahrensbetreuung`.

Flex proportions (measured against the v4 composite):

| Segment | Flex | Role |
|---|---|---|
| `0 0 23.60%` | Image 1 | Stadtplanung |
| `0 0 1.80%` | Gap 1 | inactive |
| `0 0 23.67%` | Image 2 | Städtebau |
| `0 0 1.77%` | Gap 2 | inactive |
| `0 0 23.70%` | Image 3 | Bauleitplanung |
| `0 0 1.80%` | Gap 3 | inactive |
| `1` | Image 4 | Verfahrensbetreuung, Partizipation |

The 4th strip (Verfahrensbetreuung) is a photo recropped to the same vertical strip format (≈670×1423) and appended to the original 3-image composite. To rebuild after swapping images: detect the white gap columns and re-paste strips with Pillow (no ImageMagick available; `sips` can't concatenate). Then update the segment percentages and the `heroHeight` aspect ratio (`1423 / 2831`) in `Home.jsx`.

Hero overlay text sizing is computed dynamically: `titleFontSize = Math.min(max, Math.floor(segWidth / (19 * 0.52)))` where 0.52 is the D-DIN character width ratio, sized to fit the longest single word ("Verfahrensbetreuung", 19 chars). Titles are allowed to wrap (no `whiteSpace: nowrap`). Description text is hidden below `width < 1000` (`showDesc` flag).

### Project detail page (`src/pages/ProjectDetail.jsx`)

Route: `/projekte/:id`. Layout:
- **Hero image** — desktop: aligned to text column (`gridColumn: '3 / span 8'`, cols 3–10) within the 12-col grid, `← Alle Projekte` overlaid at `top: 20px, left: 56px`. Mobile: full-width, back link displayed above the image.
- **Title** — `fontWeight: 700`, 38px desktop / 26px mobile, `letterSpacing: '-0.02em'`
- **Ergebnis badge** — if `project.ergebnis` is set, shown as a bordered inline tag below the title.
- **Content** — passed through `processContent()` before `dangerouslySetInnerHTML`. `processContent()` does three things: (1) strips empty `<dt>/<dd>` pairs, (2) merges "Mehr Informationen" slf-rows into the preceding `<dl class="slf-daten">` (or creates a new one), (3) removes slf-rows where every column after the first is empty. Bare URLs in "Mehr Informationen" are auto-linked.
- **Image lightbox** — clicking the hero image or any content `<img>` opens a full-screen lightbox (Esc or click to close). `wpFullSize()` strips the WordPress CDN size suffix (e.g. `-1024x683.jpg`) so the lightbox loads the full-resolution original; `<figcaption>` text is carried through as the lightbox caption.
- **Prev/Next navigation** — links to adjacent projects by index in `projects` array.
- `<BackToTop />` is rendered on this page.

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
| `src/assets/SLF_Logo.svg` | Full logo with text — imported by `Footer.jsx` (Vite asset, not a `public/` file) |
| `src/assets/SLF_Logo_Lang.svg` | Long/horizontal logo — imported raw by `Nav.jsx` (`?raw` import, injected as inline SVG) |

Always serve static assets via `import.meta.env.BASE_URL + 'filename'` so the path resolves correctly when deployed to a subdirectory. `import.meta.env.BASE_URL` resolves to `/slf-website/` (configured in `vite.config.js` as `base: '/slf-website/'`).

## Déploiement

### Architecture cible

```
slf-berlin.de        → nouveau site React (hébergé sur Netlify)
wp.slf-berlin.de     → WordPress existant (déplacé sur sous-domaine IONOS)
```

WordPress reste accessible pour l'admin et l'API REST. Le script de sync tourne toujours normalement.

### Étapes à suivre (hébergeur : IONOS)

**1. Déplacer WordPress sur `wp.slf-berlin.de`**
- Dans le panneau IONOS : créer le sous-domaine `wp.slf-berlin.de` et le pointer vers le dossier WordPress existant
- Dans WordPress > Réglages > Général : changer l'URL du site en `https://wp.slf-berlin.de`
- Vérifier que `https://wp.slf-berlin.de/wp-json/wp/v2/posts` répond bien

**2. Mettre à jour le script de sync**
Dans `scripts/sync-from-wordpress.mjs`, remplacer l'URL de base :
```js
// avant
https://www.slf-berlin.de/wp-json/wp/v2/posts
// après
https://wp.slf-berlin.de/wp-json/wp/v2/posts
```

**3. Déployer le React sur Netlify**
- Créer un compte sur [netlify.com](https://netlify.com)
- Connecter le repo GitHub → Netlify déploie automatiquement à chaque `git push`
- Réglages de build : `npm run build` / dossier de sortie : `dist`
- Ajouter un fichier `public/_redirects` avec `/* /index.html 200` pour le SPA routing

**4. Pointer le domaine `slf-berlin.de` vers Netlify**
- Dans Netlify : Domaines > ajouter `slf-berlin.de`
- Dans IONOS : modifier les enregistrements DNS de `slf-berlin.de` pour pointer vers Netlify (Netlify fournit les valeurs exactes)
- Prévoir 24–48h de propagation DNS

### Notes SEO
Le nouveau site a une structure d'URLs différente de WordPress. Les anciennes URLs WP (ex. `/2023/01/nom-projet/`) deviendront des 404. Impact limité car les projets individuels n'étaient pas mis en avant dans le référencement, mais à surveiller dans Google Search Console après le déploiement.

## Suggested next steps

1. **SEO** — per-page `<title>` / `<meta>` (react-helmet or Vite plugin)
2. **Responsive** — currently optimized for ≥ 768px desktop; sub-768 needs further work
