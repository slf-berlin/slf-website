# Plan de migration : nouveau site sur slf-berlin.de, WordPress sur alt.slf-berlin.de

> Version allemande : [migration-domain-de.md](migration-domain-de.md)

## Objectif

| Adresse | Avant | Après |
|---|---|---|
| `slf-berlin.de` / `www.slf-berlin.de` | Ancien site WordPress | **Nouveau site React** |
| `alt.slf-berlin.de` | — | **WordPress**, toujours utilisé pour saisir les contenus |
| `cloud.slf-berlin.de` | Nextcloud | Nextcloud (inchangé) |
| E-mails `@slf-berlin.de` | IONOS Mail / Exchange | Inchangé |

**WordPress reste la source des contenus.** Les projets et les images continuent d'être ajoutés dans WordPress. Le nouveau site les récupère à chaque build. Le CMS intégré (branche `cms-migration`) viendra plus tard. On met donc en ligne la branche **`main`**.

Aucun achat n'est nécessaire : tout se fait dans le contrat **IONOS Webhosting Premium**.

---

## 1. État actuel (relevé le 23.09.2026)

### Contrats IONOS

| Contrat | Rôle |
|---|---|
| Webhosting Premium | Webspace, domaine `slf-berlin.de`, WordPress, Nextcloud |
| PHP 7.4 Extended Support | Option payante nécessaire au WordPress actuel |
| Mail Business / Microsoft Exchange | E-mails |
| Webhosting Plus | **Résilié au 04.11.2026** : vérifier qu'il est vide |

### Webspace (Webhosting Premium)

```
/                    ← slf-berlin.de pointe ici (racine)
├── index.php        ┐ fichiers WordPress qui affichent le site
├── .htaccess        ┘ sur www.slf-berlin.de
├── wordpress/       ← cœur de WordPress (admin : /wordpress/wp-admin)
├── cloud/           ← Nextcloud (cloud.slf-berlin.de) — NE PAS TOUCHER
├── backup/, dokumentation/, logs/, dossier db…   ← ne pas toucher
```

- Accès SFTP : IONOS → Hosting → Webhosting Premium → **SFTP & SSH** (serveur, utilisateur et mot de passe y sont indiqués)
- WordPress aujourd'hui : site `https://www.slf-berlin.de`, admin `https://www.slf-berlin.de/wordpress/wp-admin`

### DNS de slf-berlin.de

| Enregistrements | Rôle | Action |
|---|---|---|
| MX, `*._domainkey`, TXT SPF, `_dmarc`, `autodiscover` | E-mails | **Ne jamais toucher** |
| A `@` et A `www` | Site web | IONOS les réécrit lui-même à la bascule |
| A `ftp` | FTP | Ne pas toucher |
| `cloud` (géré par IONOS) | Nextcloud | Ne pas toucher |

C'est la **destination du domaine** (le dossier du webspace) qui détermine le site affiché, pas l'adresse IP. **On ne modifie donc aucun enregistrement DNS à la main.**

---

## 2. Principe de fonctionnement après la migration

```
WordPress (alt.slf-berlin.de)        Mac (branche main)                  Serveur IONOS
  saisie projets / images    →    npm run build                  →   envoi de dist/
                                  (récupère articles + images)        dans /slf-neu
```

- `npm run build` lance automatiquement `sync` (articles WordPress → `src/data/projects.js`), `mirror` (images → copies locales) et la génération de la sitemap.
- La mise à jour **n'est pas instantanée** : un contenu publié dans WordPress apparaît sur `slf-berlin.de` après le build et l'envoi.

---

## 3. Préparation du code (branche `main`)

Ces changements sont faits sur la branche **`main`**, pas sur `cms-migration`.

1. **Base Vite** : dans `vite.config.js`, `base: '/slf-website/'` → `base: '/'`
2. **Fallback SPA pour Apache** : créer `public/.htaccess`
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
3. **Adresse de WordPress dans les scripts** : `www.slf-berlin.de` → `alt.slf-berlin.de`
   - `scripts/sync-from-wordpress.mjs` (`WP_BASE`)
   - `scripts/mirror-wp-media.mjs` (`WP_API` et URL de téléchargement)

   ⚠️ **Indispensable.** Sinon, après la bascule, le script demanderait les images à `www`. `www` renverrait la page HTML du nouveau site, et cette page serait enregistrée à la place des images.
4. **Accepter les deux adresses d'images** (`www.` et `alt.`). Après l'étape C3, WordPress renvoie des URLs en `alt.slf-berlin.de`, alors que les anciens contenus peuvent encore contenir `www`. Les expressions régulières à élargir sont :
   - `UPLOADS_RE` dans `scripts/mirror-wp-media.mjs`
   - `UPLOADS_PREFIX_RE` et `UPLOADS_GLOBAL_RE` dans `src/lib/wpMedia.js`

   Sans ce changement, les nouvelles images ne seraient pas copiées en local et s'afficheraient depuis WordPress.
5. **Sitemap / robots.txt** : ils pointent déjà vers `https://www.slf-berlin.de`, il n'y a rien à changer.

---

## 4. Étape A : créer alt.slf-berlin.de (sans impact sur le site actuel)

1. IONOS → **Domains & SSL** → **Subdomain erstellen** → `alt`
2. Destination / utilisation : **Webspace** → dossier **`/`** (la racine, comme le site actuel)
3. Activer le **certificat SSL** pour `alt.slf-berlin.de` (1 certificat sur 2 est encore disponible)
4. Test : `https://alt.slf-berlin.de` **redirige vers `www.slf-berlin.de`**. C'est normal à ce stade.

---

## 5. Étape B : construire et déposer le nouveau site (sans impact)

1. Sur le Mac, branche `main`, avec les modifications du chapitre 3 :
   ```bash
   npm run build
   ```
   Le résultat est `dist/`, environ 1,2 Go avec les médias. Vérifier qu'aucune erreur de téléchargement ne s'affiche.
2. Test local : `npm run preview`, puis vérifier quelques pages, images et projets.
3. IONOS → Hosting → Webhosting Premium → **Webspace nutzen** → à la racine `/` : **Neuer Ordner** → `slf-neu`
4. Envoyer **le contenu** de `dist/` (pas le dossier `dist` lui-même) dans `slf-neu/` avec **FileZilla**, en SFTP (port 22, identifiants dans « SFTP & SSH »).
5. Vérifier que le fichier caché **`.htaccess`** est bien présent dans `slf-neu/`. Dans FileZilla, activer « Serveur → Forcer l'affichage des fichiers cachés ».

> Il faut **un dossier séparé** : le `.htaccess` du nouveau site écraserait celui de WordPress s'il était déposé à la racine.

---

## 6. Étape C : la bascule (environ 15 minutes, l'ordre est essentiel)

> ⚠️ **D'abord WordPress, ensuite le domaine.** Dans l'ordre inverse, l'admin WordPress devient inaccessible : `alt` redirigerait vers `www`, qui afficherait déjà le nouveau site.

**Avant de commencer :** faire une **sauvegarde complète de WordPress** (fichiers et base de données), par exemple avec le plugin UpdraftPlus ou l'export de la base dans IONOS.

### C1. Changer l'adresse de WordPress
1. Se connecter sur `https://www.slf-berlin.de/wordpress/wp-admin`
2. **Einstellungen → Allgemein** :
   - WordPress-Adresse (URL) : `https://alt.slf-berlin.de/wordpress`
   - Website-Adresse (URL) : `https://alt.slf-berlin.de`
3. Enregistrer. La session se ferme.
4. Se reconnecter sur **`https://alt.slf-berlin.de/wordpress/wp-admin`**

### C2. Pointer slf-berlin.de vers le nouveau site
1. IONOS → **Domains & SSL** → `slf-berlin.de` → **⋮** → modifier la destination (« Ziel / Verwendung anpassen »)
2. **Contrôle :** la destination actuelle affichée doit être `/`. **Si ce n'est pas le cas, s'arrêter** et faire une capture d'écran.
3. Nouvelle destination : **Webspace** → dossier **`/slf-neu`**
4. Vérifier que `www.slf-berlin.de` suit aussi. Sinon, faire la même chose pour `www`.
5. IONOS remplace lui-même les enregistrements A `@` / `www`. Les enregistrements e-mail ne changent pas.

### C3. Mettre à jour les liens internes de WordPress
Dans l'admin WordPress sur `alt` :
1. Installer le plugin **Better Search Replace**
2. Remplacer `https://www.slf-berlin.de` par `https://alt.slf-berlin.de` dans toutes les tables. Faire d'abord un « dry run », puis le vrai remplacement.
3. Elementor → Tools → **CSS regenerieren**
4. **Einstellungen → Lesen** → cocher « Suchmaschinen davon abhalten, diese Website zu indexieren », pour que Google n'indexe pas deux fois le même contenu.

### C4. Premier build après la bascule
Sur le Mac : `npm run build`, puis renvoyer `dist/` dans `slf-neu/`. Ce build confirme que la chaîne fonctionne avec WordPress sur `alt`.

---

## 7. Étape D : vérifications

- [ ] `https://slf-berlin.de` et `https://www.slf-berlin.de` affichent le nouveau site
- [ ] Une page profonde rechargée avec F5 fonctionne (par exemple `/projekte/…`, `/buero/team`) et ne renvoie pas d'erreur 404
- [ ] Les images s'affichent, sans requête vers `alt.slf-berlin.de` dans l'onglet Réseau du navigateur
- [ ] Le cadenas SSL est valide sur `slf-berlin.de`, `www` et `alt`
- [ ] `https://alt.slf-berlin.de` affiche l'ancien site, et l'admin fonctionne
- [ ] `https://alt.slf-berlin.de/wp-json/wp/v2/posts` répond (le build en a besoin)
- [ ] `https://cloud.slf-berlin.de` (Nextcloud) fonctionne
- [ ] Un e-mail envoyé et un e-mail reçu

---

## 8. Retour en arrière (en cas de problème)

1. IONOS → `slf-berlin.de` → destination : dossier **`/`**
2. WordPress (sur `alt`) → Einstellungen → Allgemein → remettre `https://www.slf-berlin.de/wordpress` et `https://www.slf-berlin.de`
3. Si le remplacement C3 a déjà été fait, le relancer dans l'autre sens (`alt` → `www`)

Le site d'origine est de nouveau en ligne en quelques minutes.

---

## 9. Travail courant après la migration

### Publier un nouveau contenu
1. Saisir le projet ou les images dans WordPress : `https://alt.slf-berlin.de/wordpress/wp-admin`
2. Sur le Mac, branche `main` : `npm run build`
3. Envoyer le contenu de `dist/` dans `slf-neu/` avec FileZilla. On peut n'envoyer que les fichiers modifiés : FileZilla propose d'écraser seulement les fichiers plus récents.

### Sécurité de WordPress
WordPress reste un outil de travail, il faut donc l'entretenir :
- Mettre à jour WordPress, le thème et les plugins. IONOS signale le site comme « gefährdet » (Site Scan).
- Protéger l'**admin** (mot de passe fort, éventuellement un plugin de protection de la connexion). **Ne pas bloquer l'API** `/wp-json` : le build en a besoin.
- Ne pas mettre de mot de passe sur le `.htaccess` de la racine : ses règles s'appliquent aussi aux sous-dossiers `slf-neu/` et `cloud/`.
- L'option **PHP 7.4 Extended Support** reste nécessaire tant que WordPress n'est pas passé à une version plus récente de PHP.

### Autres points
- **Webhosting Plus** (résilié au 04.11.2026) : vérifier que son webspace ne contient rien d'utile.
- **Google Search Console** : envoyer la nouvelle `sitemap.xml` et surveiller les erreurs 404 des anciennes adresses WordPress (`/2023/01/…`). Des redirections 301 pourront être ajoutées dans `public/.htaccess`.

### Plus tard : passage au CMS
La branche `cms-migration` contient un CMS intégré et un script (`migrate-projects-to-content.mjs`) qui reprend tout le contenu WordPress. Ce qui aura été ajouté dans WordPress d'ici là sera donc récupéré au moment du passage. Les adaptations des chapitres 3.3 et 3.4 devront aussi être reportées sur cette branche.
