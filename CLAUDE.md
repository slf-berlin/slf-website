# SLF Berlin — Redesign du Site Web

## Contexte

Site web pour **Stadt Land Fluss PartG mbB**, cabinet berlinois d'urbanisme fondé en 1992. Trois associés : Georg Börsch-Supan, Samir Hamzeh, Barbara Horst. J. Miller Stevens, fondateur, a transmis le bureau et reste consultant.

Direction choisie : **A — "Editorial Index"** (rejetée : Direction B "Archive Grid").

## Stack

- **Vite + React 18** — `npm run dev` pour démarrer (port 5173)
- **react-router-dom v6** — routing côté client (SPA)
- Pas de framework CSS — styles inline React (fidèle au design original)
- Pas de TypeScript — JSX pur

## Structure du projet

```
slf/
├── CLAUDE.md
├── _design/               ← export Claude Design original (lecture seule, référence)
│   ├── direction-a.jsx    ← source de vérité pour le design Direction A
│   ├── direction-b.jsx    ← archivé, non retenu
│   ├── screenshots/       ← captures de référence (a-home-focus.png, etc.)
│   └── ...
├── src/
│   ├── tokens.js          ← design tokens (couleurs, polices)
│   ├── main.jsx           ← point d'entrée React
│   ├── App.jsx            ← routing (BrowserRouter + Routes)
│   ├── components/
│   │   ├── Nav.jsx        ← navigation sticky
│   │   ├── Footer.jsx     ← pied de page 4 colonnes
│   │   ├── ProjectFeedItem.jsx  ← item du feed (alternance L/R)
│   │   └── ProjectImage.jsx    ← image de projet (placeholder + vraie photo)
│   ├── pages/
│   │   ├── Home.jsx       ← page d'accueil (hero + feed 6 projets + notiz)
│   │   └── Projekte.jsx   ← grille de projets (2 colonnes + filtres)
│   ├── data/
│   │   └── projects.js    ← 10 projets (tableau exporté par défaut)
│   └── assets/
│       ├── SLF_Logo.svg
│       └── deckblatt-homepage.jpg
├── index.html             ← template Vite (polices D-DIN + Barlow chargées ici)
├── vite.config.js
└── package.json
```

## Design Tokens (src/tokens.js)

| Token | Valeur | Usage |
|---|---|---|
| `bg` | `#ffffff` | Fond principal |
| `ink` | `#0e0e10` | Texte principal |
| `mute` | `#6b6b6e` | Texte secondaire, méta |
| `rule` | `#e6e5e2` | Lignes de séparation |
| `ruleSoft` | `#f1f0ed` | Séparations très subtiles |
| `accent` | `#ccc8a6` | Kaki sable (couleur logo SLF) |
| `accentSoft` | `#f3f1e3` | Teinte très claire kaki |
| `accentDeep` | `#8a8765` | Kaki foncé (labels de section) |

## Typographie

Police principale : **D-DIN** (open-source Datto, SIL OFL)
Chargée via CDN jsdelivr dans `index.html`. Fallback : Barlow (Google Fonts).

```
font: '"D-DIN", "DIN Next LT Pro", "DIN Pro", "Barlow", sans-serif'
```

- Titres : fontWeight 400, letterSpacing -0.015em
- Navigation : 14px, letterSpacing 0.01em
- Labels de section : 11px, uppercase, letterSpacing 0.12em, accentDeep
- Méta projet : 11px, uppercase, letterSpacing 0.08–0.1em

## Layout

- Grid 12 colonnes, padding horizontal **56px**, gap 24px
- Padding vertical sections : 48px–88px
- Nav sticky : 88px de hauteur (logo)
- Grille projets : 2 colonnes, gap 72px vertical / 40px horizontal

## Routes

| URL | Page | Composant |
|---|---|---|
| `/` | Accueil | `src/pages/Home.jsx` |
| `/projekte` | Projets | `src/pages/Projekte.jsx` |
| `*` | Redirect → `/` | — |

Pages à créer : `/buero`, `/kontakt`, pages détail projet.

## Données projets (src/data/projects.js)

Tableau de 10 objets avec les champs :
- `id` — slug kebab-case
- `titel`, `untertitel`, `beschreibung` — titres et description (allemand)
- `ort` — ville
- `jahr` — année ou plage (ex: "2025–2026")
- `kategorie` — type de mission
- `flaeche` — surface ou périmètre
- `auftraggeber` — maître d'ouvrage
- `tone` — `'photo'` ou `'plan'` (affecte le placeholder)
- `image` *(optionnel)* — chemin vers une vraie image (sinon placeholder affiché)

## Commandes

```bash
npm run dev      # dev server sur http://localhost:5173
npm run build    # build de production → dist/
npm run preview  # prévisualisation du build
```

## Prochaines étapes suggérées

1. **Photos réelles** : ajouter le champ `image` dans `projects.js` et importer les fichiers dans `src/assets/`
2. **Page détail projet** : route `/projekte/:id` avec layout pleine page
3. **Page Büro** : présentation de l'équipe et historique du cabinet
4. **Page Kontakt** : formulaire + carte
5. **SEO** : balises `<title>` et `<meta>` par page (react-helmet ou Vite plugin)
6. **Responsive** : breakpoints mobile (actuellement optimisé pour ≥ 1024px)

## Référence design

Voir `_design/screenshots/` :
- `a-home-focus.png` — vue de référence de la page d'accueil
- `01-all-boards.png` / `02-all-boards.png` — vue globale des deux directions
- `overview.png` — overview général

Fichier source complet du design Direction A : `_design/direction-a.jsx`
