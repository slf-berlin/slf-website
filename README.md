# Stadt Land Fluss – Website

Diese Anleitung richtet sich an alle, die Inhalte auf der Website pflegen möchten – auch ohne Programmierkenntnisse.

---

## Wie funktioniert das System?

Die Website besteht aus **zwei getrennten Teilen**, die zusammenarbeiten:

```
WordPress (slf-berlin.de)          →  Website (slf-website)
Hier schreibt ihr eure Projekte       Hier werden sie angezeigt
```

**WordPress** ist euer gewohntes Redaktionssystem. Projekte werden dort genau wie bisher gepflegt: Text, Fotos, Kategorien.

**Die Website** liest diese Projekte automatisch aus WordPress aus und zeigt sie in dem neuen Design an.

Die Verbindung zwischen beiden erfolgt über einen **Sync-Vorgang** (s. unten).

---

## Was passiert wo?

| Aufgabe | Wo? |
|---|---|
| Projekt anlegen oder bearbeiten | WordPress |
| Fotos hochladen | WordPress |
| Projekttext schreiben | WordPress |
| Kategorie / Ergebnis festlegen | WordPress |
| Büro-Text, Impressum, Datenschutz | Entwickler kontaktieren |
| Team-Seite aktualisieren | Entwickler kontaktieren |

---

## Projekte synchronisieren

Wenn ihr in WordPress ein Projekt **neu angelegt, geändert oder veröffentlicht** habt und die Änderung auf der Website erscheinen soll, muss ein Sync durchgeführt werden.

### Wer kann das machen?

Jede Person, die Zugang zum Projektordner auf dem Computer hat und einmal die technische Einrichtung abgeschlossen hat (einmalig, s. unten).

### So funktioniert der Sync

1. Terminal (macOS: `Cmd + Leertaste` → „Terminal" eingeben) öffnen
2. In den Website-Ordner navigieren:
   ```
   cd ~/Desktop/SLF\ WEBSITE/Website
   ```
3. Diesen Befehl eingeben und Enter drücken:
   ```
   npm run sync
   ```
4. Warten, bis „Fertig" (oder „Done") erscheint – dauert wenige Sekunden
5. Dann die Änderungen veröffentlichen:
   ```
   npm run deploy
   ```

Nach einigen Minuten sind die Änderungen live auf der Website sichtbar.

---

## Website lokal ansehen (Vorschau)

Ihr könnt die Website auf eurem eigenen Computer ansehen, ohne sie zu veröffentlichen:

```
npm run dev
```

Dann im Browser öffnen: **http://localhost:5173/slf-website/**

Mit `Ctrl + C` im Terminal stoppt ihr den Server wieder.

---

## Technische Einrichtung (einmalig)

Diese Schritte sind nur einmalig notwendig, wenn jemand neu am Projekt arbeitet.

**Voraussetzungen:**
- [Node.js](https://nodejs.org/) installiert (empfohlen: aktuelle LTS-Version)
- Zugang zum GitHub-Repository

**Einrichtung:**
```
cd ~/Desktop/SLF\ WEBSITE/Website
npm install
```

---

## Häufige Fragen

**Ein neues Projekt erscheint nicht auf der Website.**  
→ Prüfen, ob das Projekt in WordPress **veröffentlicht** (nicht nur Entwurf) ist.  
→ Dann `npm run sync` und `npm run deploy` ausführen.

**Ein Projekt ist auf WordPress gelöscht, aber noch auf der Website.**  
→ `npm run sync` und `npm run deploy` ausführen.

**Die Fotos eines Projekts werden nicht angezeigt.**  
→ Prüfen, ob in WordPress ein **Beitragsbild** (Featured Image) gesetzt ist.

**Ich habe etwas geändert, aber auf der Website hat sich nichts getan.**  
→ Browser-Cache leeren (`Cmd + Shift + R`) und kurz warten (bis zu 5 Minuten nach dem Deploy).

---

## Kontakt bei technischen Fragen

Bei Problemen oder Änderungswünschen (Design, Texte, Team-Seite etc.) bitte an den Entwickler wenden:  
**Jan – janhamza917@gmail.com**
