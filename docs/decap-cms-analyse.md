# Analyse : remplacer WordPress par Decap CMS (ou Sveltia CMS)

*Rédigé le 08/07/2026 — exploration de l'idée d'utiliser un CMS git-based pour l'édition et l'ajout des projets, à la place de WordPress/Elementor.*

## Est-ce possible de garder exactement le même format ? Oui, à 100 %

Le site React ne connaît pas WordPress. Il consomme uniquement `src/data/projects.js`, généré par `scripts/sync-from-wordpress.mjs`. Tout le rendu (les lignes `slf-row`, colonnes `slf-col-50`/`slf-col-33`, le bloc `<dl class="slf-daten">`, les figures avec légendes) est déjà un format intermédiaire *maison*, que le script de sync fabrique en désossant le HTML d'Elementor.

Avec Decap, le pipeline deviendrait :

```
Aujourd'hui :  WordPress/Elementor → sync script (parse le HTML) → projects.js → React
Avec Decap :   fichiers content/projekte/*.md (édités via /admin) → script de build → projects.js → React
```

Un projet serait un fichier avec des champs structurés (titel, untertitel, kategorie, themen, ergebnis, image, Projektdaten…) et le contenu modélisé comme une **liste de blocs typés** : texte, image avec légende, ligne 50/50, ligne 33/33/33, bloc Projektdaten. Le script de build convertit ces blocs vers exactement le même HTML `slf-*` qu'aujourd'hui. **Zéro changement dans les pages React** — `ProjectDetail.jsx`, la grille, la Projektliste, le lightbox, tout continue de fonctionner à l'identique.

C'est même une amélioration de la qualité des données :

- `ort` et `auftraggeber` deviennent de vrais champs (aujourd'hui `null`, extraits du `<dl>` au rendu pour la Projektliste)
- les **Themen** deviennent éditables dans le CMS au lieu d'être maintenus à la main dans `src/data/themen.js` (aujourd'hui, chaque nouveau projet WP arrive sans thèmes jusqu'à édition manuelle de ce fichier)
- `ergebnis` devient un champ au lieu d'être scrapé par regex depuis la page du thème WP (les ~150 lignes de `fetchWpPageData` + fallbacks + retries disparaissent)

## Les trade-offs

### Ce qu'on gagne

| | WordPress actuel | Decap/git-based |
|---|---|---|
| Infrastructure | Hébergement WP IONOS à maintenir, mises à jour, sécurité | Rien — le CMS est une page statique `/admin`, le contenu vit dans le repo |
| Fiabilité du sync | ~900 lignes de parsing Elementor fragile, scraping de pages, serveur WP lent (batching, retries) | Build local instantané, déterministe, pas de réseau |
| Versionnage | Non (révisions WP limitées) | Chaque modification = un commit git, historique complet, rollback trivial |
| Coût | Hébergement WP | Gratuit (Netlify free tier + GitHub) |
| Cohérence visuelle | Les éditeurs peuvent casser la mise en page dans Elementor | Impossible de sortir des blocs prévus |

### Ce qu'on perd / points de friction

1. **Liberté de mise en page.** Elementor permet n'importe quel layout ; Decap impose les blocs définis. Dans notre cas c'est peu douloureux — les pages projets actuelles utilisent déjà exactement 5-6 motifs récurrents — mais un layout inédit demanderait d'ajouter un type de bloc (petit travail de dev).

2. **Expérience d'édition.** Formulaires structurés au lieu d'édition visuelle. Decap a un panneau de prévisualisation personnalisable (on peut y brancher les vrais composants React pour un aperçu fidèle), mais ce n'est pas du WYSIWYG drag-and-drop.

3. **Authentification — le vrai point faible de Decap en 2026.** Netlify Identity (l'auth historique « clé en main ») est déprécié. La voie actuelle : backend GitHub + un petit proxy OAuth (une fonction serverless ou un worker, setup unique de ~1h). Conséquence pratique : **chaque éditeur du bureau doit avoir un compte GitHub** avec accès au repo. Pour une petite équipe c'est gérable, mais c'est moins « grand public » qu'un login WordPress.

4. **Délai de publication.** Chaque sauvegarde = un commit → rebuild Netlify → ~1-2 min avant mise en ligne. (WordPress est instantané, mais le site actuel nécessite de toute façon un `npm run sync` + redéploiement manuel, donc c'est en fait *plus rapide* que le workflow actuel.)

5. **Migration des images.** Pour couper WordPress définitivement, il faut rapatrier les images du CDN WP dans le repo (probablement quelques centaines de Mo — dans les limites GitHub, mais le repo grossit). Point d'attention : `wpFullSize()` dans `ProjectDetail.jsx` et les `srcset` générés par WP supposent les suffixes de taille WordPress — le lightbox et le responsive images demanderaient un petit ajustement.

6. **Migration du contenu existant.** Il faut un script one-shot qui convertit les projets actuels vers le nouveau format. Bonne nouvelle : le `projects.js` actuel est déjà propre et structuré, et le HTML `slf-*` est régulier donc parsable — c'est très faisable. Alternative : les anciens projets gardent leur HTML tel quel dans un champ « brut » et seuls les nouveaux projets utilisent les blocs.

## Options d'implémentation

### Option A — Remplacement complet (la cible propre)

Tous les projets migrés en fichiers `content/projekte/*.md`, images dans le repo, le script de build remplace le sync WP, WordPress peut être éteint. Cohérent avec le plan de déploiement Netlify déjà documenté dans le CLAUDE.md (et ça élimine l'étape « déplacer WP sur wp.slf-berlin.de »). Effort : le plus gros chantier (config CMS + script de build + script de migration contenu + images), mais un seul système à terme.

### Option B — Hybride transitoire

Le sync WP continue pour les projets existants ; Decap gère uniquement les nouveaux ; le script de build fusionne les deux sources dans `projects.js`. Migration quasi nulle au départ, on valide le workflow d'édition en réel, puis on migre le stock plus tard. Inconvénient : deux systèmes en parallèle, WordPress doit rester en ligne.

### Option C — Migration minimale

Tout migrer d'un coup mais en gardant le `content` HTML existant tel quel (champ caché) ; les éditeurs ne modifient que les métadonnées + un corps de texte simple pour les nouveaux projets, sans layouts multi-colonnes. Le moins cher, mais les nouveaux projets perdent les mises en page riches.

## Choix du logiciel : Decap vs Sveltia

Recommandation : **Sveltia CMS** plutôt que Decap classique — fork moderne, drop-in compatible (même `config.yml`, même format de contenu, interchangeables en une ligne), UI nettement plus rapide, ~280 bugs Decap corrigés, auth GitHub plus simple. En beta (v1.0 prévue fin 2026) mais déjà largement utilisé en production.

Seule raison de préférer Decap classique : le workflow éditorial (brouillons relus via PR avant publication), que Sveltia n'a pas encore. Comme la config est identique, on peut commencer avec l'un et basculer vers l'autre sans rien migrer.

## Recommandation globale

**Option A avec Sveltia**, éventuellement précédée d'un proof of concept (CMS + script de build + 2-3 projets migrés) pour que les partenaires valident l'expérience d'édition avant d'engager la migration complète.

Le facteur décisif à vérifier avec le bureau : **est-ce que les éditeurs acceptent des comptes GitHub et des formulaires structurés à la place d'Elementor ?** Si oui, le reste est purement mécanique et le site rendu ne change pas d'un pixel.

## Sources

- [Decap — Choosing a Backend](https://decapcms.org/docs/choosing-a-backend/)
- [Decap — GitHub backend](https://decapcms.org/docs/github-backend/)
- [Netlify — Git Gateway (déprécié)](https://docs.netlify.com/manage/security/secure-access-to-sites/git-gateway/)
- [Sveltia CMS — successor to Netlify/Decap CMS](https://sveltiacms.app/en/docs/successor-to-netlify-cms)
- [Sveltia CMS — migration depuis Decap](https://sveltiacms.app/en/docs/migration/netlify-decap-cms)
- [sveltia/sveltia-cms (GitHub)](https://github.com/sveltia/sveltia-cms)
