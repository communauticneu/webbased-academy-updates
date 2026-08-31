# Clean Text System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first stable, clean text engine for the current Webbased Academy Creator baseline.

**Architecture:** Keep text state independent from presentation media. A central medium profile resolves fonts/default color; one text engine owns creation and object behavior. The existing content shell only delegates UI actions into that engine.

**Tech Stack:** Electron 38, browser DOM, CommonJS-compatible Node tests (`node:test`).

**Spec:** `docs/superpowers/specs/2026-08-31-clean-text-system-design.md`

## Global Constraints

- Do not restore removed legacy text/font components.
- Exactly one central font/medium configuration.
- Only `none` and `board` media now.
- Only `heading`, `normal`, `small` text kinds now.
- Preserve text properties when medium changes.
- Existing Creator platform, stage, right menu, media library and presentation-medium controls remain intact.
- TDD for every production behavior.

---

### Task 1: Pure text model and medium profile

**Files:**
- Create: `src/presentation-text-system.js`
- Create: `test/presentation-text-system.test.js`

**Interfaces:**
- Produces: `AcademyTextSystem.createTextObject(kind, overrides)`, `AcademyTextSystem.resolveStyle(textObject, medium)`, `AcademyTextSystem.duplicateTextObject(textObject)`.

- [ ] **Step 1: Write failing tests** for text-kind defaults, exact font mapping, default colors, custom color precedence, medium-switch property preservation, and duplicate semantics.
- [ ] **Step 2: Run `node --test test/presentation-text-system.test.js` and verify RED** because `presentation-text-system.js` does not exist.
- [ ] **Step 3: Implement minimal pure model/profile code** with one immutable `MEDIUM_PROFILES` mapping and no DOM behavior.
- [ ] **Step 4: Run the focused test and then `node --test`; verify GREEN.**
- [ ] **Step 5: Commit** `feat: add clean text model and medium profiles`.

### Task 2: DOM text engine and direct editing

**Files:**
- Modify: `src/presentation-text-system.js`
- Modify: `test/presentation-text-system.test.js`

**Interfaces:**
- Produces: `AcademyTextSystem.install(doc, options)`, `AcademyTextSystem.addText(kind)`, selection/edit/delete/drag behavior.

- [ ] **Step 1: Add failing DOM-contract tests** for one generated object layer, selection, double-click editing, Delete protection during editing, object deletion outside editing, and drag position updates.
- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Implement the minimal DOM engine** with event delegation and stage-bound position clamping.
- [ ] **Step 4: Verify focused and full suite GREEN.**
- [ ] **Step 5: Commit** `feat: add clean text editing and positioning`.

### Task 3: Context tools

**Files:**
- Modify: `src/presentation-text-system.js`
- Modify: `test/presentation-text-system.test.js`

**Interfaces:**
- Adds left/center/right alignment, custom color, duplication, contextual toolbar.

- [ ] **Step 1: Add failing tests** for alignment, custom color persistence and duplicate offset/property copy.
- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Implement contextual tools without adding controls to the permanent right menu.**
- [ ] **Step 4: Verify focused and full suite GREEN.**
- [ ] **Step 5: Commit** `feat: add text context tools`.

### Task 4: Integrate shell and presentation medium

**Files:**
- Modify: `src/presentation-content-shell.js`
- Modify: `src/preload.js`
- Modify: `src/presentation-medium-selection.js` only if a stable medium-change hook is not already exposed.
- Modify: `test/text-reset-baseline.test.js`
- Modify: `test/presentation-medium-selection.test.js` where needed.

**Interfaces:**
- Text kind menu calls `AcademyTextSystem.addText(kind)`.
- Medium selection notifies the text engine of `none`/`board` without replacing objects.

- [ ] **Step 1: Add failing integration tests** proving the clean runtime is loaded, text buttons delegate to it, and the baseline still rejects all legacy mechanisms.
- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Wire the new script into preload and shell, using the existing medium-selection API/hook.**
- [ ] **Step 4: Run `node --test`; verify GREEN.**
- [ ] **Step 5: Commit** `feat: integrate clean text system`.

### Task 5: Final regression gate

**Files:**
- Test-only changes if a missing regression is discovered.

- [ ] **Step 1: Run the complete test suite.**
- [ ] **Step 2: Inspect source for forbidden patterns: `MutationObserver`, `FontFace`, legacy text runtime filenames, and duplicate font mappings.**
- [ ] **Step 3: Verify text properties survive medium profile resolution and custom color precedence.**
- [ ] **Step 4: Commit any necessary regression test fixes only after reproducing a failing case.**
- [ ] **Step 5: Present the first user-visible checkpoint only after technical checks are green.**