# Webbased Academy Creator V0.16.13

Entwicklungsstand ohne Release.

## Neu in V0.16.13
- sauberer dunkler Electron-Programmstart: Fenster bleibt unsichtbar, bis der Renderer darstellungsbereit ist
- lokaler Entwicklungsavatar mit deterministischen, kostenlosen Bewegungen
- Lippenbewegung nur während laufender lokaler Systemstimme
- leichte Kopfbewegung, Atmung/Körperbewegung und Blinzeln
- neutrales/frontal sprechendes Verhalten und einfache Zeige-/Präsentationsgeste
- Ganzkörper, Bis Nabel und Ohne Avatar bleiben erhalten
- 40-Sekunden-Produktionsmodus nutzt die lokale Bewegungslogik, ohne seine Zeitgrenzen zu ändern
- HeyGen-Testintegration bleibt vorhanden, wird aber ausschließlich nach bewusstem Benutzerklick aktiv

## Unverändert
- 3440×1440-Layout und Lesbarkeitsregeln
- Update-Center und Auto-Updater
- Projekte, Medienbibliothek, Schultafel und bestehende Datenstrukturen
- 40-Sekunden-Phasengrenzen 0–10 / 10–25 / 25–33 / 33–40 Sekunden
- `.github/workflows` ist nicht Bestandteil dieses Upload-Pakets

## Prüfung
- `npm test`: 34/34 Tests bestanden
- JavaScript-Syntax geprüft: main.js, preload.js, production-mode.js, heygen-service.js, local-avatar-motion.js
- 5 eingebettete JavaScript-Blöcke in index.html syntaktisch geprüft
