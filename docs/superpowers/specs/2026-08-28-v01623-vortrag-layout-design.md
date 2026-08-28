# V0.16.23 Vortrag-Layout – Design

## Ziel
Der Vortrag-Bereich erhält genau eine zuständige Layout-Struktur. Das gewünschte Bedienbild bleibt maßgeblich: links unverändert das globale Creator-Menü, daneben Szenen, zentral die Bühne, rechts „Szene bearbeiten“, unten die visuelle Medienbibliothek.

## Schutzbereiche
Nicht verändert werden: globale Creator-Navigation, Avatar-/Tafel-/Medienlogik, 40-Sekunden-Produktionsablauf, Auto-Updater, Release-/Workflow-Automatik und bestehende Projekte/Medien.

## Layout-Struktur
- Globales Creator-Menü bleibt 230 px breit und unverändert.
- Vortrag-Arbeitsbereich wird als eine einzige Grid-Struktur geführt.
- Große Ansicht: Szenen | Bühne | Szene bearbeiten; Medienbibliothek darunter über Szenen+Bühne.
- Sehr breite Monitore dürfen die Bühne nicht unbegrenzt vergrößern. Der Produktionsbereich wird zentriert und auf eine sinnvolle Maximalbreite begrenzt.
- Die Bühne bleibt 16:9 und wird zusätzlich durch die verfügbare Höhe begrenzt.
- Die rechte Bearbeitungsspalte bleibt breit genug für die vorhandenen Felder und Schaltflächen.
- Bei kleineren Breiten wird zuerst die Bühne verkleinert; erst bei wirklich engem Platz wandert „Szene bearbeiten“ unter die Medienbibliothek.
- Die Medienbibliothek behält lesbare, visuelle Kacheln und wird nicht auf Ultrawide-Breite auseinandergezogen.

## Technische Abgrenzung
Alte Responsive-Regeln aus dem historischen Vortrag-Layout dürfen nicht gleichzeitig auf die V0.16.23-Arbeitsfläche wirken. Die neue V0.16.23-Arbeitsfläche bekommt eindeutige Selektoren und eine klar definierte Zuständigkeit. Keine parallelen Layout-Systeme für denselben Bereich.

## Teststrategie
1. Zuerst Tests ergänzen, die die neue Layout-Zuständigkeit und die Schutzbereiche festschreiben.
2. Danach nur die Layout-Struktur ändern.
3. Zieltests und komplette Testsuite ausführen.
4. Danach realer Sichttest in mindestens zwei Fenstergrößen: ca. 1550 px und 3440×1440.
5. Erst nach visueller Freigabe weitere Versionierung oder Veröffentlichung.

## Erfolgskriterium
Die Oberfläche entspricht dem freigegebenen Aufbau und bleibt bei normaler sowie ultrabreiter Fenstergröße ausgewogen, ohne alte Test-/Legacy-Oberflächen einzublenden oder andere Produktionsfunktionen zu verändern.
