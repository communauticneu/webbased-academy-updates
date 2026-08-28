# V0.16.23 Vortrag Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Den Vortrag-Arbeitsbereich exakt als Hauptmenü | Szenen | Bühne | Szene bearbeiten mit Medienbibliothek unten herstellen, ohne Produktionslogik zu verändern.

**Architecture:** V0.16.23 erhält genau eine Layout-Zuständigkeit für den Vortrag-Arbeitsbereich. Historische `.workspace`-/Responsive-Regeln aus `index.html` dürfen die V0.16.23-Fläche nicht mehr steuern; die globale 230-px-Creator-Navigation bleibt unangetastet. Ultrawide wird durch eine zentrierte Maximalbreite begrenzt, die Bühne bleibt 16:9 und höhenbegrenzt.

**Tech Stack:** Electron, HTML/CSS, JavaScript, Node test runner

**Spec:** `docs/superpowers/specs/2026-08-28-v01623-vortrag-layout-design.md`

## Global Constraints

- Globales Creator-Menü bleibt 230 px breit und unverändert.
- Nicht verändern: Avatar-/Tafel-/Medienlogik, 40-Sekunden-Produktionsablauf, Auto-Updater, Release-/Workflow-Automatik und bestehende Projekte/Medien.
- Große Ansicht: Szenen | Bühne | Szene bearbeiten; Medienbibliothek darunter über Szenen+Bühne.
- Bühne bleibt 16:9 und darf auf 3440×1440 nicht unbegrenzt wachsen.
- Visuelle Freigabe ist vor Versionierung oder Veröffentlichung zwingend.

---

### Task 1: Layout-Vertrag als RED-Test festschreiben

**Files:**
- Modify: `test/v16.23-scene-sidebar-layout.test.js`

**Interfaces:**
- Consumes: vorhandene V0.16.23 CSS-/DOM-Klassen.
- Produces: Tests für eine einzige Layout-Zuständigkeit, Maximalbreite und Schutz der globalen Navigation.

- [ ] **Step 1: Failing Tests ergänzen**

Ergänze Assertions, dass die V0.16.23-Produktionsfläche einen eigenen eindeutigen Root-Selektor besitzt, auf großen Monitoren eine `max-width`-Begrenzung verwendet und die Bühne sowohl `aspect-ratio:16/9` als auch eine Höhenbegrenzung besitzt. Zusätzlich darf der Test keine Änderung der 230-px-Globalnavigation verlangen.

- [ ] **Step 2: RED verifizieren**

Run: `npm.cmd test -- test/v16.23-scene-sidebar-layout.test.js`
Expected: mindestens der neue Maximalbreiten-/Höhenbegrenzungs-Test FAIL, bestehende Schutztests bleiben PASS.

- [ ] **Step 3: Keine Produktionsdatei ändern, bevor RED bestätigt ist**

---

### Task 2: Eine Layout-Zuständigkeit herstellen

**Files:**
- Modify: `src/presentation-stage-v16.17.js`
- Modify only if required for media sizing: `src/media-library-scene-picker.js`
- Test: `test/v16.23-scene-sidebar-layout.test.js`

**Interfaces:**
- Consumes: `.v1623-production-workspace`, `.v1623-scenes-workspace`, `.v1623-stage-workspace`, `.v1623-scene-editor`, `.v1623-media-workspace`.
- Produces: eine vollständig definierte V0.16.23-Grid-Struktur ohne Abhängigkeit von historischen `.workspace`-Breakpoints.

- [ ] **Step 1: Produktions-Root isolieren**

Die V0.16.23-Arbeitsfläche erhält alle für Positionierung, Breite, Höhe und Overflow nötigen Regeln unter dem eigenen Root. Keine globale `.workspace`, `.controls`, `.centercol` oder `.scenecol` Regel ändern.

- [ ] **Step 2: Große Ansicht definieren**

Innerhalb des V0.16.23-Roots: Szenen links, Bühne flexibel zentral, Editor rechts; Medienbibliothek in der zweiten Zeile unter Szenen+Bühne. Produktionsfläche zentrieren und mit sinnvoller `max-width` begrenzen, sodass 3440×1440 nicht die Bühne auf die gesamte Restbreite aufzieht.

- [ ] **Step 3: Bühne proportional begrenzen**

Bühne behält `aspect-ratio:16/9`, `width:100%`, `max-width:100%` und erhält eine zur verfügbaren Fensterhöhe passende Begrenzung. Avatar-/Tafel-Selektoren nicht verändern.

- [ ] **Step 4: Mittlere Ansicht definieren**

Bei ca. 1550 px Gesamtfensterbreite bleiben Szenen, Bühne und Editor nebeneinander, solange der Editor lesbar bleibt. Die Bühne schrumpft zuerst; Medienbibliothek bleibt darunter sichtbar.

- [ ] **Step 5: Enge Ansicht definieren**

Erst bei tatsächlich zu wenig Platz wandert der Editor unter die Medienbibliothek. Globales Creator-Menü bleibt unverändert.

- [ ] **Step 6: Medienbibliothek begrenzen**

Kacheln behalten lesbare Mindest-/Maximalgrößen; auf Ultrawide wird die Bibliothek nicht künstlich überbreit gestreckt. Keine Medienauswahl- oder Szenenlogik ändern.

- [ ] **Step 7: GREEN verifizieren**

Run: `npm.cmd test -- test/v16.23-scene-sidebar-layout.test.js`
Expected: alle V0.16.23 Layouttests PASS.

---

### Task 3: Regressionen ausschließen

**Files:**
- Test only; keine weitere Codeänderung ohne neuen Befund.

**Interfaces:**
- Consumes: kompletter aktueller Projektstand.
- Produces: Nachweis, dass der Layout-Umbau keine bestehende Funktion gebrochen hat.

- [ ] **Step 1: Vollständige Testsuite ausführen**

Run: `npm.cmd test`
Expected: PASS ohne neue Fehler.

- [ ] **Step 2: Bei Fehler STOP**

Keinen zweiten Fix hinzufügen. Fehlerursache isolieren und nur den verursachenden Layout-Schritt korrigieren.

---

### Task 4: Realer Sichttest vor jeder Versionierung

**Files:**
- Keine.

**Interfaces:**
- Consumes: lokal synchronisierten Branch `dev-stage-composition`.
- Produces: visuelle Freigabe des Nutzers.

- [ ] **Step 1: Nutzer synchronisiert erst nach grünen automatischen Tests**

Run lokal: `git pull`

- [ ] **Step 2: Anwendung starten**

Run lokal: `npm.cmd start`

- [ ] **Step 3: Zwei Ansichten prüfen**

Prüfen: ungefähr 1550 px Fensterbreite und maximiert 3440×1440. Erwartetes Bild in beiden Fällen: globales Hauptmenü unverändert; Szenen links; Bühne zentral und proportional; Editor rechts und lesbar; Medienbibliothek unten; keine Legacy-Testoberfläche.

- [ ] **Step 4: STOP bis zur visuellen Freigabe**

Keine Versionsänderung, kein Tag, kein Release vor ausdrücklicher Freigabe.