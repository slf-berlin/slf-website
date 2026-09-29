# Migrationsplan: neue Website auf slf-berlin.de, WordPress auf alt.slf-berlin.de

> Französische Fassung: [migration-domain-fr.md](migration-domain-fr.md)

## Ziel

| Adresse | Vorher | Nachher |
|---|---|---|
| `slf-berlin.de` / `www.slf-berlin.de` | Alte WordPress-Website | **Neue React-Website** |
| `alt.slf-berlin.de` | — | **WordPress**, weiterhin zur Eingabe der Inhalte |
| `cloud.slf-berlin.de` | Nextcloud | Nextcloud (unverändert) |
| E-Mail `@slf-berlin.de` | IONOS Mail / Exchange | Unverändert |

**WordPress bleibt die Quelle der Inhalte.** Projekte und Bilder werden weiterhin in WordPress angelegt. Die neue Website holt sie bei jedem Build ab. Das integrierte CMS (Branch `cms-migration`) folgt später. Online geht daher der Branch **`main`**.

Es muss nichts dazugekauft werden: Alles läuft im Vertrag **IONOS Webhosting Premium**.

---

## 1. Ist-Zustand (Stand 23.09.2026)

### IONOS-Verträge

| Vertrag | Funktion |
|---|---|
| Webhosting Premium | Webspace, Domain `slf-berlin.de`, WordPress, Nextcloud |
| PHP 7.4 Extended Support | Kostenpflichtige Option für das aktuelle WordPress |
| Mail Business / Microsoft Exchange | E-Mail |
| Webhosting Plus | **Gekündigt zum 04.11.2026**: prüfen, ob leer |

### Webspace (Webhosting Premium)

```
/                    ← slf-berlin.de zeigt hierher (Stammverzeichnis)
├── index.php        ┐ WordPress-Dateien, die die Website
├── .htaccess        ┘ auf www.slf-berlin.de ausliefern
├── wordpress/       ← WordPress-Kern (Admin: /wordpress/wp-admin)
├── cloud/           ← Nextcloud (cloud.slf-berlin.de) — NICHT ANFASSEN
├── backup/, dokumentation/, logs/, Ordner db…   ← nicht anfassen
```

- SFTP-Zugang: IONOS → Hosting → Webhosting Premium → **SFTP & SSH** (dort stehen Server, Benutzer und Passwort)
- WordPress heute: Website `https://www.slf-berlin.de`, Admin `https://www.slf-berlin.de/wordpress/wp-admin`

### DNS von slf-berlin.de

| Einträge | Funktion | Aktion |
|---|---|---|
| MX, `*._domainkey`, TXT SPF, `_dmarc`, `autodiscover` | E-Mail | **Niemals ändern** |
| A `@` und A `www` | Website | Werden beim Umschalten von IONOS selbst neu gesetzt |
| A `ftp` | FTP | Nicht ändern |
| `cloud` (von IONOS verwaltet) | Nextcloud | Nicht ändern |

Welche Website angezeigt wird, entscheidet das **Ziel der Domain** (der Ordner im Webspace), nicht die IP-Adresse. **Es werden daher keine DNS-Einträge von Hand geändert.**

---

## 2. Funktionsweise nach der Migration

```
WordPress (alt.slf-berlin.de)        Mac (Branch main)                    IONOS-Server
  Projekte / Bilder eingeben   →   npm run build                    →   dist/ hochladen
                                   (holt Beiträge + Bilder ab)           nach /slf-neu
```

- `npm run build` führt automatisch `sync` (WordPress-Beiträge → `src/data/projects.js`), `mirror` (Bilder → lokale Kopien) und die Sitemap-Erzeugung aus.
- Die Aktualisierung erfolgt **nicht sofort**: Ein in WordPress veröffentlichter Inhalt erscheint auf `slf-berlin.de` erst nach Build und Upload.

---

## 3. Vorbereitung im Code (Branch `main`)

Diese Änderungen erfolgen im Branch **`main`**, nicht in `cms-migration`.

1. **Vite-Basis:** in `vite.config.js` `base: '/slf-website/'` → `base: '/'`
2. **SPA-Fallback für Apache:** `public/.htaccess` anlegen
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
3. **WordPress-Adresse in den Skripten:** `www.slf-berlin.de` → `alt.slf-berlin.de`
   - `scripts/sync-from-wordpress.mjs` (`WP_BASE`)
   - `scripts/mirror-wp-media.mjs` (`WP_API` und Download-URL)

   ⚠️ **Unverzichtbar.** Sonst würde das Skript die Bilder nach dem Umschalten bei `www` anfragen. `www` würde dann die HTML-Seite der neuen Website zurückgeben, und diese Seite würde anstelle der Bilder gespeichert.
4. **Beide Bildadressen akzeptieren** (`www.` und `alt.`). Nach Schritt C3 liefert WordPress URLs mit `alt.slf-berlin.de`, ältere Inhalte können aber noch `www` enthalten. Zu erweiternde reguläre Ausdrücke:
   - `UPLOADS_RE` in `scripts/mirror-wp-media.mjs`
   - `UPLOADS_PREFIX_RE` und `UPLOADS_GLOBAL_RE` in `src/lib/wpMedia.js`

   Ohne diese Änderung würden neue Bilder nicht lokal gespiegelt, sondern direkt von WordPress geladen.
5. **Sitemap / robots.txt:** zeigen bereits auf `https://www.slf-berlin.de`, hier ist nichts zu ändern.

---

## 4. Schritt A: alt.slf-berlin.de anlegen (ohne Auswirkung auf die aktuelle Website)

1. IONOS → **Domains & SSL** → **Subdomain erstellen** → `alt`
2. Ziel / Verwendung: **Webspace** → Ordner **`/`** (Stammverzeichnis, wie die aktuelle Website)
3. **SSL-Zertifikat** für `alt.slf-berlin.de` aktivieren (1 von 2 Zertifikaten ist noch frei)
4. Test: `https://alt.slf-berlin.de` **leitet auf `www.slf-berlin.de` weiter**. Das ist zu diesem Zeitpunkt normal.

---

## 5. Schritt B: Neue Website bauen und hochladen (ohne Auswirkung)

1. Am Mac, Branch `main`, mit den Änderungen aus Kapitel 3:
   ```bash
   npm run build
   ```
   Ergebnis ist `dist/`, ca. 1,2 GB inklusive Medien. Prüfen, dass keine Download-Fehler erscheinen.
2. Lokaler Test: `npm run preview`, dann einige Seiten, Bilder und Projekte prüfen.
3. IONOS → Hosting → Webhosting Premium → **Webspace nutzen** → im Stammverzeichnis `/`: **Neuer Ordner** → `slf-neu`
4. **Den Inhalt** von `dist/` (nicht den Ordner `dist` selbst) mit **FileZilla** per SFTP nach `slf-neu/` hochladen (Port 22, Zugangsdaten unter „SFTP & SSH“).
5. Prüfen, dass die versteckte Datei **`.htaccess`** in `slf-neu/` liegt. In FileZilla dazu „Server → Anzeige versteckter Dateien erzwingen“ aktivieren.

> Die neue Website braucht einen **eigenen Ordner**: Ihre `.htaccess` würde im Stammverzeichnis die von WordPress überschreiben.

---

## 6. Schritt C: Umschalten (ca. 15 Minuten, die Reihenfolge ist entscheidend)

> ⚠️ **Erst WordPress, dann die Domain.** In umgekehrter Reihenfolge ist der WordPress-Admin nicht mehr erreichbar: `alt` würde auf `www` weiterleiten, wo bereits die neue Website läuft.

**Vorher:** **vollständiges WordPress-Backup** anlegen (Dateien und Datenbank), z. B. mit dem Plugin UpdraftPlus oder über den Datenbank-Export bei IONOS.

### C1. WordPress-Adresse ändern
1. Anmelden unter `https://www.slf-berlin.de/wordpress/wp-admin`
2. **Einstellungen → Allgemein**:
   - WordPress-Adresse (URL): `https://alt.slf-berlin.de/wordpress`
   - Website-Adresse (URL): `https://alt.slf-berlin.de`
3. Speichern. Sie werden abgemeldet.
4. Neu anmelden unter **`https://alt.slf-berlin.de/wordpress/wp-admin`**

### C2. slf-berlin.de auf die neue Website zeigen lassen
1. IONOS → **Domains & SSL** → `slf-berlin.de` → **⋮** → Ziel ändern („Ziel / Verwendung anpassen“)
2. **Kontrolle:** Das angezeigte aktuelle Ziel muss `/` sein. **Falls nicht: abbrechen** und einen Screenshot machen.
3. Neues Ziel: **Webspace** → Ordner **`/slf-neu`**
4. Prüfen, ob `www.slf-berlin.de` mit umgestellt wurde, sonst dasselbe für `www` wiederholen.
5. IONOS ersetzt die A-Einträge `@` / `www` selbst. Die E-Mail-Einträge bleiben unverändert.

### C3. Interne Links in WordPress aktualisieren
Im WordPress-Admin auf `alt`:
1. Plugin **Better Search Replace** installieren
2. `https://www.slf-berlin.de` durch `https://alt.slf-berlin.de` ersetzen, in allen Tabellen. Zuerst „Dry Run“, dann echt ausführen.
3. Elementor → Tools → **CSS regenerieren**
4. **Einstellungen → Lesen** → „Suchmaschinen davon abhalten, diese Website zu indexieren“ aktivieren, damit Google denselben Inhalt nicht doppelt indexiert.

### C4. Erster Build nach dem Umschalten
Am Mac: `npm run build`, dann `dist/` erneut nach `slf-neu/` hochladen. Dieser Build bestätigt, dass die Kette mit WordPress auf `alt` funktioniert.

---

## 7. Schritt D: Kontrolle

- [ ] `https://slf-berlin.de` und `https://www.slf-berlin.de` zeigen die neue Website
- [ ] Eine Unterseite lädt nach Neuladen mit F5 ohne Fehler 404 (z. B. `/projekte/…`, `/buero/team`)
- [ ] Bilder werden angezeigt, ohne Anfragen an `alt.slf-berlin.de` im Netzwerk-Tab des Browsers
- [ ] Das SSL-Schloss ist gültig auf `slf-berlin.de`, `www` und `alt`
- [ ] `https://alt.slf-berlin.de` zeigt die alte Website, der Admin funktioniert
- [ ] `https://alt.slf-berlin.de/wp-json/wp/v2/posts` antwortet (wird für den Build benötigt)
- [ ] `https://cloud.slf-berlin.de` (Nextcloud) funktioniert
- [ ] Eine E-Mail senden und eine empfangen

---

## 8. Zurück zum alten Zustand (bei Problemen)

1. IONOS → `slf-berlin.de` → Ziel: Ordner **`/`**
2. WordPress (auf `alt`) → Einstellungen → Allgemein → wieder `https://www.slf-berlin.de/wordpress` und `https://www.slf-berlin.de` eintragen
3. Falls Schritt C3 schon ausgeführt wurde: rückwärts wiederholen (`alt` → `www`)

Die ursprüngliche Website ist dann innerhalb weniger Minuten wieder online.

---

## 9. Laufender Betrieb nach der Migration

### Neue Inhalte veröffentlichen
1. Projekt oder Bilder in WordPress eingeben: `https://alt.slf-berlin.de/wordpress/wp-admin`
2. Am Mac, Branch `main`: `npm run build`
3. Den Inhalt von `dist/` mit FileZilla nach `slf-neu/` hochladen. Es genügt, die geänderten Dateien zu übertragen: FileZilla bietet an, nur neuere Dateien zu überschreiben.

### Sicherheit von WordPress
WordPress bleibt ein Arbeitswerkzeug und muss daher gepflegt werden:
- WordPress, Theme und Plugins aktualisieren. IONOS meldet die Website als „gefährdet“ (Site Scan).
- Den **Admin** schützen (starkes Passwort, ggf. ein Plugin zum Schutz des Logins). **Die API** `/wp-json` **nicht sperren**: Der Build braucht sie.
- Keinen Passwortschutz über die `.htaccess` im Stammverzeichnis einrichten: Deren Regeln gelten auch für die Unterordner `slf-neu/` und `cloud/`.
- Die Option **PHP 7.4 Extended Support** bleibt nötig, solange WordPress nicht auf eine neuere PHP-Version umgestellt ist.

### Weitere Punkte
- **Webhosting Plus** (gekündigt zum 04.11.2026): prüfen, dass der Webspace nichts Wichtiges enthält.
- **Google Search Console:** neue `sitemap.xml` einreichen und 404-Fehler alter WordPress-Adressen (`/2023/01/…`) beobachten. 301-Weiterleitungen können in `public/.htaccess` ergänzt werden.

### Später: Umstieg auf das CMS
Der Branch `cms-migration` enthält ein integriertes CMS und ein Skript (`migrate-projects-to-content.mjs`), das alle WordPress-Inhalte übernimmt. Was bis dahin in WordPress hinzugefügt wurde, wird beim Umstieg also mitgenommen. Die Anpassungen aus Kapitel 3.3 und 3.4 müssen dann auch in diesem Branch nachgezogen werden.
