# Redaktions-Anleitung — Projekte und Texte bearbeiten

Die Inhalte der Website (Projekte, Texte der Seiten Start / Büro / Kontakt) werden
über eine Redaktionsoberfläche (CMS) bearbeitet — **nicht mehr über WordPress**.

## Voraussetzungen (einmalig)

- **Google Chrome** oder **Microsoft Edge** (Safari und Firefox funktionieren im
  lokalen Modus nicht)
- **GitHub Desktop** ist installiert und das Projekt (`slf-website`) ist geklont
- Node.js ist installiert (`npm` verfügbar)

## Inhalte bearbeiten — Schritt für Schritt

1. **Terminal öffnen**, in den Projektordner wechseln und den Entwicklungsserver starten:

   ```bash
   npm run dev
   ```

2. **Chrome öffnen** und die Redaktionsoberfläche aufrufen:

   ```
   http://localhost:5173/slf-website/admin/index.html
   ```

3. Beim ersten Mal auf **„Work with Local Repository“** klicken und den
   Projektordner (`Website`) auswählen. Chrome fragt einmalig nach der Berechtigung.

4. Links **„Projekte“** oder **„Seitentexte“** wählen und bearbeiten:
   - **Projekte** — jedes Projekt hat Felder (Titel, Kategorie, Themen, Ergebnis,
     Titelbild, Datum …) und eine **Inhalts-Liste aus Blöcken**: Text, Bild,
     Spalten (mehrspaltige Zeilen), Projektdaten, „Mehr Informationen“.
     Neue Projekte: oben rechts **„Neuer Projekt“** / „Create“.
   - **Seitentexte** — die Texte der Startseite (inkl. Auswahl der
     „Ausgewählten Projekte“), der Büro-Seite und der Kontakt-Seite.

5. **Speichern** — die Änderung wird direkt in die Projektdateien geschrieben.
   Die Website unter `http://localhost:5173/slf-website/` lädt automatisch neu:
   dort das Ergebnis **kontrollieren**.

6. **Veröffentlichen** — in **GitHub Desktop**:
   - die Änderungen erscheinen als geänderte Dateien (`content/…`)
   - unten links eine kurze Beschreibung eintragen → **Commit to main**
   - oben **Push origin** klicken

   Danach baut und veröffentlicht sich die Website automatisch (ein paar Minuten).

## Hinweise

- **Datum** bestimmt die Reihenfolge der Projekte (neueste zuerst).
- **Themen** sind die zweite Filterebene auf der Projektseite — bei neuen
  Projekten nicht vergessen.
- Bilder, die über das CMS hochgeladen werden, landen in `public/uploads/`
  und werden mitversioniert.
- Die Felder `srcset` / `sizes` / `CSS-Klasse` bei alten Bildern **nicht ändern** —
  sie stammen aus WordPress und steuern das responsive Laden.
- Ein Block „HTML (roh)“ ist ein Auffangbecken für Sonderfälle — im Zweifel
  nicht anfassen und Jan fragen.
- WordPress läuft nur noch als Archiv weiter und wird für die Website nicht
  mehr benötigt.
