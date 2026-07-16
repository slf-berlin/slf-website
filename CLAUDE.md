# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for **Stadt Land Fluss PartG mbB**, a Berlin urban-planning practice founded 1992. Partners: Georg Börsch-Supan, Samir Hamzeh, Barbara Horst. J. Miller Stevens (founder) remains a consultant.

Design direction: **Bold Editorial** (merged from `style/bold-archi`). Reference source: `_design/direction-a.jsx`.

## Commands

```bash
npm run dev      # regénère projects.js depuis content/ + dev server → http://localhost:5173/slf-website/
npm run inhalt   # content/projekte/*.yml → src/data/projects.js (build du contenu CMS)
npm run mirror   # download all WP media → public/wp-media/ + manifest + backup/wp-posts-raw.json
npm run sync     # snapshot WordPress → backup/projects-wp-snapshot.js (secours uniquement, n'alimente PLUS le site)
npm run backup   # sync + mirror (snapshot WordPress complet)
npm run build    # inhalt + mirror + sitemap + production build → dist/
npm run preview  # preview production build
npm run deploy   # build + publish dist/ to GitHub Pages (gh-pages)
```

**CMS (Sveltia)** : le contenu est édité via `/admin` (en dev : `http://localhost:5173/slf-website/admin/index.html`, bouton « Work with Local Repository », Chrome/Edge requis). Guide éditeur : `docs/redaktion-anleitung.md`. Config : `public/admin/config.yml`.

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
- Nav items and dropdown children defined in the `navItems` array at the top of `Nav.jsx`. Projekte dropdown items generated from `PROJEKTE_NAV` in `src/data/filters.js`. Büro dropdown: "Arbeitsweise", "Leistungen", "Team", "Netzwerk & Kooperationen" link to `/buero#arbeitsweise` / `/buero#leistungen` / `/buero/team` / `/buero#netzwerk` (hash anchors handled by `ScrollToTop`, except Team which is a real route)
- **Search** — search icon on both desktop (right of nav) and mobile (left of hamburger). Opens a compact dropdown panel (zIndex 400, anchored `top: 80` desktop / `64` mobile, `right: 56` desktop / full-width mobile, max 420px wide) backed by a transparent full-screen click-catcher (zIndex 399) for outside-click close. Input with live results as the user types (min 2 chars), up to 10 matching projects. Searches `titel`, `beschreibung`, `kategorie`. Closes on Esc, × button, or outside click. Implemented via `<SearchButton>`, `<SearchResult>` sub-components.
- **Logo intro animation** — on first full page load (not client-side navigation), the wordmark plays a staggered Stadt → Land → Fluss reveal (`slfWordIn` keyframe, 0.55s, delays 0.08 / 0.26 / 0.44s). Controlled by the module-level `logoIntroDone` flag. Respects `prefers-reduced-motion`.

**`src/components/Footer.jsx`** — 4-column grid (logo/partners | address | navigation | legal). Collapses to 2-col on tablet (< 1024px), 1-col on mobile. Navigation column includes an external link to competitionline. Logo imported from `src/assets/SLF_Logo.svg` (distinct from the public/ logos). Hover underlines via CSS class `footer-nav-link` (injected via `<style>`).

**`src/components/ProjectImage.jsx`** — reusable image tile with:
- Props: `proj`, `ratio` (`'16/10'|'4/3'|'3/2'|'1/1'`), `title`, `subtitle`, `ergebnis`, `themen` (array of theme labels), `style`
- Aspect ratio via padding-top percentage. Striped placeholder background while no image (diagonal for `tone:'photo'`, vertical for `tone:'plan'`).
- Hover: image scale(1.03); if any of `title`/`subtitle`/`ergebnis`/`themen` are passed, a khaki overlay + text fade in. Without these props there is no overlay at all, just the zoom. The Projekte grid passes all four and additionally shows title + year below the tile.
- Title/subtitle font sizes are responsive via `useWindowWidth()`: 20/15px (≥ 1024px), 17/13px (640–1023px), 15/12px (< 640px).

**`src/components/SmartImage.jsx`** — `<img>` wrapper with a shimmer loading skeleton that fades out on load. Props mirror `<img>` (`src`, `alt`, `style`, `onClick`, `className`, `fit`) plus `wrapperStyle` for the positioning wrapper. Shimmer keyframes are injected once via the exported `ensureImageStyles()` and respect `prefers-reduced-motion`. Use this instead of a bare `<img>` for remote/WP-CDN images so loads don't flash.

**`src/components/ProjectFeedItem.jsx`** — single project row for the Projekte list view.

**`src/components/BackToTop.jsx`** — fixed scroll-to-top button. Appears after 500px scroll (`window.scrollY > 500`). Positioned `bottom: 40, right: 40, zIndex: 200`. Inverts ink↔bg on hover. Used on Buero, Projekte, Team, and ProjectDetail pages. Add it to any new long-scroll page.

### Pages

**`src/pages/Team.jsx`** — dedicated team page at `/buero/team`. Renders `TEAM` from `src/data/team.js` as a responsive photo grid (`<TeamCard>`). Clicking a card opens a `<Modal>` overlay with full bio (photo + CV timeline + Aufgabenfelder). Modal closes on Esc, outside click, or × button. Grid columns: 2 (< 640px) / 3 (640–1023px) / 4 (≥ 1024px).

**`src/pages/Buero.jsx`** — single-page layout:
- **Hero image** — office photo (WP CDN) at the top, with side padding 36px desktop / 12px mobile (not full-width), `objectPosition: 'center 30%'`, height 500px desktop / 220px mobile.
- **01 / Büro** — intro text (éditable, `content/pages/buero.json`) + 3-image gallery (Stadt / Land / Wasser, WP CDN URLs, aspect-ratio 4/3, `objectFit: cover` — reste dans le code)
- **Arbeitsweise** ("Unsere Arbeitsweise", `id="arbeitsweise"`) — `ARBEITSWEISE` array (5 principles), each with title + intro paragraph + bullet list (`<BulletList>`), rendered as a 2-column grid spanning cols 3–11 (`3 / span 9`).
- **02 / Leistungen** — `LEISTUNGEN` array (8 services), each with an inline SVG icon, title and a `punkte` array rendered via `<BulletList>` (small khaki square markers), as a 2-column grid spanning cols 3–11 (`3 / span 9`). Section anchored at `id="leistungen"` for hash navigation.
- **Team** ("Das Team", `id="team"`) — embeds the full team grid inline: imports `TEAM` and renders `<TeamCard>` tiles (2 / 3 / 4 cols at < 640 / 640–1023 / ≥ 1024px), clicking a card opens the bio `<Modal>`. `TeamCard` and `Modal` are defined locally in `Buero.jsx` (duplicated from `Team.jsx`). The standalone `Team.jsx` page still exists and is still routed at `/buero/team` (Nav links there), so team content currently lives in two places — keep both in sync or consolidate.
- **Netzwerk & Kooperationen** (`id="netzwerk"`) — short intro paragraph + `NETZWERK` array of partner offices (`{ name, url }`), rendered as an inline-flex wrapped list of `<NetLink>` entries separated by small khaki square dividers.
- Sections from Leistungen onward (`#leistungen`, `#team`, `#netzwerk`) each open with a `borderTop: 1px solid A.rule` divider.
- **Closing image** — office photo (WP CDN) with the same side padding (36px / 12px), followed by `<BackToTop />` then `<Footer />`.

Note: the numbered section labels ("01 / Büro", "02 / Leistungen", …) have been removed from the page in favor of plain headings.

**`src/pages/Kontakt.jsx`** — contact info (address + phone/email) in cols 3–6, then a full-width `<Anfahrt>` section with a local SVG map (`public/anfahrt_karte.svg`, served via `import.meta.env.BASE_URL`).

**`src/pages/Impressum.jsx`** — static Impressum legal page.

**`src/pages/Datenschutz.jsx`** — static Datenschutz (privacy policy) page.

### Data

**`src/data/team.js`** — `TEAM` array (7 members). Each entry: `name`, `email` (null if not public), `photo` (WP CDN URL), `ausbildung`, `rolle`, `cv` (array of `[jahre, text]` tuples), `aufgaben`, `isPartner` (bool). Partners are Börsch-Supan, Hamzeh, Horst, and Stevens (as Freier Mitarbeiter).

**`content/projekte/*.yml`** — ✅ **source de vérité des projets** (un fichier par projet, nom de fichier = `id`/slug). Édités via le CMS `/admin` (Sveltia) ou à la main. Champs : `titel`, `untertitel`, `beschreibung`, `ergebnis`, `jahr`, `kategorie` (labels), `themen` (keys), `datum` (tri, ex-wpDate), `image`, `wpId`/`wpLink` (héritage WordPress, cachés dans le CMS), `inhalt` (liste de **blocs typés** — voir ci-dessous).

**`src/data/projects.js`** — ⚠️ **auto-generated** — do not edit by hand. Généré depuis `content/projekte/` par `scripts/build-projects-from-content.mjs` (`npm run inhalt`, lancé automatiquement par `dev` et `prebuild`). Même forme d'objet qu'à l'époque WordPress (+ champ `themen`) :
```
id (slug), titel, untertitel (''), beschreibung,
content (HTML slf-* sérialisé depuis les blocs), ergebnis (string|null),
ort (null), jahr (string|null), kategorie, flaeche (null), auftraggeber (null),
tone ('photo'|'plan', calculé), image, wpId, wpDate (= datum), wpLink, themen
```

**Blocs typés (`inhalt`)** — définis dans `scripts/lib/projekt-blocks.mjs` (`parseContent`/`serializeBlocks`, partagé par migration et build). La sérialisation reproduit exactement le HTML maison historique :

| Type | Champs | HTML produit |
|---|---|---|
| `text` | `html` | verbatim (texte nu → wrap `<p style="font-weight: 400;">`) |
| `bild` | `src, alt, breite, hoehe, srcset, sizes, klass, figur, caption` | `<img … />` (ordre d'attributs WP) ; si `figur` → `<figure>… <figcaption>` |
| `spalten` | liste `{ breite: 25\|33\|50\|66\|100, html }` | `<div class="slf-row"><div class="slf-col-NN">…</div>…</div>` |
| `projektdaten` | `eintraege: [{ label, wert }]` | `<p class="slf-daten-heading">…</p><dl class="slf-daten">` |
| `mehr_info` | `html` | la slf-row « Mehr Informationen » |
| `html` | `html` | verbatim (fallback pour cas non modélisés) |

`ort`, `flaeche`, `auftraggeber` restent `null` au niveau objet — la Projektliste les extrait du `<dl class="slf-daten">` au rendu (inchangé).

**`src/data/filters.js`** — exports:
- `PROJEKTE_NAV` — array of `{ label, key }` category filter tabs (key `null` = show all). Categories: Stadt- und Quartiersentwicklung (`stadtentwicklung`), Städtebau (`staedtebau`), Bauleitplanung, Verfahrensbetreuung, plus the special `projektliste` tab.
- `FILTER_FN` — map of `key → (project) => boolean` predicate functions over `kategorie`
- `THEMEN_NAV` — array of `{ label, key }` for the second, orthogonal **Themen** filter dimension (9 themes: Wohnungsbau, Gewerbeentwicklung, Klimaanpassung, Spielplätze, Nachverdichtung / Innenentwicklung, Transformation, Autoarmes Quartier, Partizipation, Wettbewerbe)
- `projectThemen(p)` / `themaFilterFn(key)` / `themaLabel(key)` — theme lookup helpers (lisent `p.themen` sur l'objet projet)
- `filterHref(key, thema)` — builds `/projekte`, `/projekte?filter=<key>`, `/projekte?thema=<key>` or both combined

Filtering on `/projekte` reads `?filter=` and `?thema=` from `useSearchParams()` and applies both predicates (AND). The Themen bar is a second, more discreet row under the category tabs — single-select, clicking the active theme toggles it off, and the theme is preserved when switching categories (including the Projektliste table view).

**Themen** — champ `themen` de chaque projet (`content/projekte/*.yml`, multi-select dans le CMS). L'ancien `src/data/themen.js` a été supprimé. A project with no themes is valid (it just matches no theme filter). Theme tags are also rendered on `ProjectDetail` as clickable links to `/projekte?thema=<key>`.

**`content/pages/*.json`** — textes éditables des pages (collection « Seitentexte » du CMS), importés directement par les pages React (import JSON natif Vite, pas de build) : `home.json` (titres, intro, `featuredIds`), `buero.json` (intro, `arbeitsweise`, `leistungen` — les icônes SVG restent dans `Buero.jsx` via `LEISTUNGEN_ICONS[key]` —, `netzwerk`), `kontakt.json` (adresse, téléphone, email). Les phrases du hero de la Home restent dans le code (couplées au composite image).

The `projektliste` key is special: it passes all projects through (`() => true`) and renders a **sortable table view** instead of the tile grid. Columns are sortable by Jahr, Auftraggeber, Ort, and Kategorie. `ort` and `auftraggeber` are extracted from the `<dl class="slf-daten">` block inside `project.content` at render time.

### Local media mirror (WordPress backup)

The site is **fully self-hosted**: all WordPress images are mirrored locally and served from `public/wp-media/`, so the site displays without any request to the WP CDN.

- **`scripts/mirror-wp-media.mjs`** (`npm run mirror`, also part of `prebuild`) — scans `src/` for `wp-content/uploads/` URLs (incl. srcset variants and full-size originals used by the lightbox), downloads them to `../wp-media/<year>/<month>/<file>` (incremental — existing files are skipped), writes `src/data/wp-media-manifest.json` (list of files actually present locally), and dumps the raw WP posts JSON to `backup/wp-posts-raw.json` (disaster-recovery backup, non-fatal on failure). If WP is unreachable, existing files are kept and the build proceeds.
- **`src/lib/wpMedia.js`** — runtime substitution helpers backed by the manifest: `localMedia(url)` (single image URL → local copy), `localizeMediaHtml(html)` (rewrites all WP URLs in `project.content`, src + srcset), `fullSizeMedia(src)` (lightbox: strips the `-WxH` size suffix and returns the local full-size original). URLs not in the manifest fall back to the WP CDN unchanged.
- Wired up in: `ProjectImage.jsx`, `ProjectDetail.jsx` (hero, content, lightbox), `Team.jsx`, `Buero.jsx` (`ImgWithSkeleton` + TeamCard). Any new component rendering a WP URL must wrap it in `localMedia()` / `localizeMediaHtml()`.
- The media files (~1.2 GB, largest ~33 MB) live **outside the repo** at `../wp-media/` (i.e. `SLF WEBSITE/wp-media/`, NOT committed). `public/wp-media` is only a **symlink** to it (gitignored, recreated automatically by `npm run mirror`). Vite follows the symlink in dev and copies the files into `dist/` at build time, so deploys remain self-contained. `backup/` (raw WP JSON, small) IS committed.
- Les blocs `bild` migrés et le champ `image` stockent toujours les URLs WordPress d'origine ; la substitution se fait au rendu uniquement. Les **nouveaux uploads du CMS** vont dans `public/uploads/` (commité), référencés `/uploads/…` et préfixés `BASE_URL` par `localMedia()`/`localizeMediaHtml()`.

**`scripts/sync-from-wordpress.mjs`** — ⚠️ relégué en **snapshot de secours** depuis la migration CMS : il écrit dans `backup/projects-wp-snapshot.js` (jamais dans `src/data/`) et ne peut plus écraser le contenu édité via le CMS. Il conserve tout le parsing Elementor historique (`extractLayout` → HTML `slf-*`) au cas où il faudrait re-migrer depuis WordPress. Catégories WP historiques : `entwicklungskonzepte` → Stadt- und Quartiersentwicklung, `wettbewerbe` → Städtebau, `bauleitplanung`, `verfahrensbetreuung` (les ex-Wettbewerbe portent aussi le **theme** `wettbewerbe`).

Les classes `slf-row` / `slf-col-NN` / `slf-daten` du `content` sont stylées dans la constante `PROSE_STYLES` de `src/pages/ProjectDetail.jsx` en flexbox (`flex: 1 1 0` pour col-50/33, `flex: 2 1 0` pour col-66). Mobile (< 640px) : une seule colonne.

**Scripts CMS** :
- `scripts/build-projects-from-content.mjs` (`npm run inhalt`) — content/ → projects.js ; tri par `datum` desc ; `tone` calculé.
- `scripts/lib/projekt-blocks.mjs` — parse/serialize des blocs (source de vérité du format HTML).
- `scripts/migrate-projects-to-content.mjs` — migration one-shot WordPress → content/ (historique ; écrase content/projekte/ si relancé).
- `scripts/verify-content-roundtrip.mjs [ref]` — vérifie que le projects.js régénéré est identique à celui d'une ref git (utilisé pour valider la migration : 0 diff vs `main`).
- En dev, le plugin `slf-content-rebuild` (vite.config.js) regénère projects.js à chaque modification de `content/projekte/` (sauvegarde CMS → rechargement auto).

### Project grid (`src/pages/Projekte.jsx`)

Responsive column count: `< 640px` → 1 col · `640–1023px` → 2 cols · `≥ 1024px` → 3 cols.

### Home page (`src/pages/Home.jsx`)

Three sections after the hero (numbered "01 / …" labels have been removed in favor of plain headings):
- **Über uns** — intro text (éditable via `content/pages/home.json`)
- **Aktuell** — "Ausgewählte Projekte" feed: project IDs éditables (`featuredIds` dans `home.json`), rendered as alternating left/right `<ProjectFeedItem>` rows (first item `large={true}`)
- **Notiz** — short note about the leadership transition to the three current partners

### Hero phrase reveal (`src/pages/Home.jsx`)

The hero image (`deckblatt-homepage-v3.jpg`, 2110×1423) is a composite JPG of **3 sub-images** with white gaps. Five absolutely-positioned flex segments (3 panels + 2 gap spacers) overlay one phrase fragment per panel (`HERO_PHRASEN`): "Von der Idee und dem Leitbild …" / "… über das Konzept und den Entwurf …" / "… bis zur Umsetzung." The panels are **not clickable** — no links, only a subtle hover tint (see below).

Flex proportions (measured against the v3 composite):

| Segment | Flex | Phrase |
|---|---|---|
| `0 0 31.66%` | Image 1 | Von der Idee und dem Leitbild … |
| `0 0 2.42%` | Gap 1 | — |
| `0 0 31.75%` | Image 2 | … über das Konzept und den Entwurf … |
| `0 0 2.37%` | Gap 2 | — |
| `1` | Image 3 | … bis zur Umsetzung. |

**Light-khaki swipe animation** — each panel has a white plate at the bottom (`rgba(255,255,255,0.9)`); on first full page load a solid `A.accentSoft` block sweeps across the plate (`slfHeroSwipe`: scaleX 0→1 origin left, then 1→0 origin right, 0.9s) and "deposits" the phrase behind it (`slfHeroText`: opacity 0→1 at the sweep midpoint). Panels are staggered (delays 0.3 / 0.85 / 1.4s) so the sentence reads left to right. Controlled by the module-level `heroIntroDone` flag (same pattern as `logoIntroDone` in `Nav.jsx`) — client-side navigation shows the final state without animation. Respects `prefers-reduced-motion`. Keyframes live in the `HERO_STYLES` constant, injected via a `<style>` tag.

**Hover effect** (desktop only, `hoveredSeg` state) — hovering a panel tints its plate to `A.accentSoft` and slides a 3px `A.accent` line in along the plate's bottom edge (width 0→100%, 0.25s ease, echoing the nav underlines). The panels are still not clickable — cursor stays default.

Phrase font sizing is computed dynamically: `phraseFontSize = Math.min(max, Math.floor(segWidth / (22 * 0.52)))` where 0.52 is the D-DIN character width ratio, sized so the longest fragment fits on ≤ 2 lines (~22 chars/line). Wrapping is allowed.

`deckblatt-homepage-v4.jpg` (4-strip variant, 2831×1423, with a Verfahrensbetreuung photo appended) is kept in `src/assets/` as a reserve. To rebuild a composite after swapping images: detect the white gap columns and re-paste strips with Pillow (no ImageMagick available; `sips` can't concatenate), then update the segment percentages in `Home.jsx`.

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

**Tout est hébergé chez IONOS** — le site React et le WordPress source. Aucun service tiers (pas de Netlify, pas de GitHub Pages en production). La Datenschutz nomme donc IONOS SE comme hébergeur (serveurs en Allemagne / UE) — cette mention est correcte tant que l'hébergement reste chez IONOS ; à corriger si l'hébergeur change un jour.

### Architecture cible

```
slf-berlin.de        → nouveau site React statique (webspace IONOS)
wp.slf-berlin.de     → WordPress existant (sous-domaine IONOS, admin + API REST)
```

Depuis la migration CMS, WordPress n'alimente plus le site (le contenu vit dans `content/`). Il ne sert plus que de source aux **médias historiques** (`npm run mirror`) et au snapshot de secours (`npm run sync`). Une fois les médias définitivement hébergés avec le site (uploadés une fois sur le webspace IONOS ou commités ailleurs), WordPress peut être éteint.

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

**3. Régler la base Vite sur la racine du domaine**
Le site sera servi à la racine de `slf-berlin.de`, plus dans un sous-dossier `/slf-website/`. Dans `vite.config.js` :
```js
// avant (GitHub Pages)
base: '/slf-website/',
// après (racine IONOS)
base: '/',
```
Le routeur suit automatiquement (`basename={import.meta.env.BASE_URL}` dans `App.jsx`) et tous les assets servis via `import.meta.env.BASE_URL + 'filename'` restent corrects. `BASE_URL` vaudra alors `/`.

**4. Ajouter le fallback SPA Apache (`.htaccess`)**
IONOS sert le webspace via **Apache**. Sans réécriture, tout rechargement d'une route profonde (ex. `/projekte/xyz`) renvoie un 404. Créer `public/.htaccess` (Vite copie tel quel le contenu de `public/` dans `dist/`) :
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
(Ne PAS créer de `public/_redirects` — c'est un format Netlify, ignoré par Apache.)

**5. Build et upload du dossier `dist/`**
- `npm run build` génère `dist/` (le `prebuild` lance le build du contenu CMS + le mirror des médias + la sitemap)
- Uploader **le contenu** de `dist/` (pas le dossier lui-même) à la racine du webspace IONOS via SFTP/FTP, ou brancher **IONOS Deploy Now** sur le repo GitHub (build `npm run build`, dossier de sortie `dist`) pour un déploiement automatique à chaque `git push`
- Le script `npm run deploy` (gh-pages) n'est plus utilisé en production — le laisser ou le remplacer par la commande d'upload IONOS retenue

**6. Vérifier le domaine `slf-berlin.de`**
- Le domaine étant déjà chez IONOS, il suffit de pointer `slf-berlin.de` (et `www`) vers le webspace qui contient le `dist/` uploadé — pas de changement de DNS externe ni de propagation vers un tiers
- Vérifier le certificat SSL (Let's Encrypt IONOS) sur le domaine principal et le sous-domaine WordPress

### Notes SEO
Le nouveau site a une structure d'URLs différente de WordPress. Les anciennes URLs WP (ex. `/2023/01/nom-projet/`) deviendront des 404. Impact limité car les projets individuels n'étaient pas mis en avant dans le référencement, mais à surveiller dans Google Search Console après le déploiement. Penser à mettre à jour l'URL de base dans `sitemap.xml` / `robots.txt` (générés au build) si elle pointe encore vers l'ancienne structure.

## Suggested next steps

1. **SEO** — per-page `<title>` / `<meta>` (react-helmet or Vite plugin)
2. **Responsive** — currently optimized for ≥ 768px desktop; sub-768 needs further work
