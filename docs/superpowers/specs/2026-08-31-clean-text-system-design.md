# Clean Text System Design

## Goal
Build one new text system on the cleaned Webbased Academy Creator baseline without reusing removed legacy text/font code.

## Architecture
The system has three responsibilities only:

1. **Text model** stores content, text kind, position, alignment, and optional custom color.
2. **Text engine** creates, selects, edits, moves, deletes, aligns, colors, and duplicates text objects.
3. **Medium profile** maps `heading`, `normal`, and `small` to font family and default color for the active presentation medium.

There is one text engine for every presentation medium. A medium change never replaces text objects; it only changes their resolved presentation style.

## Initial scope
Only these media are implemented now:

- `none`
- `board`

Only these text kinds are implemented now:

- `heading`
- `normal`
- `small`

Default content:

- heading: `Neue Überschrift`
- normal: `Neuer Text`
- small: `Neuer Text`

## Central font configuration
The font mapping must exist in one module and nowhere else.

`none`:

- heading: Arial, bold
- normal: Arial
- small: Arial
- default color: white

`board`:

- heading: KG Second Chances Sketch
- normal: DJB Chalk It Up
- small: DJB Chalk It Up
- default color: white

The existing font files under `src/assets/fonts/` are used. No `MutationObserver`, runtime font repair, or competing font ownership is allowed.

## Text object
Each text object contains:

- `id`
- `content`
- `kind`
- `x`
- `y`
- `align`
- `customColor`

Resolved font and default color are not stored in the object.

## Interaction rules
A single click selects a text object. Double click enters direct editing. Dragging a selected object moves it within the presentation stage. Delete removes a selected object only when direct text editing is not active. During editing Delete behaves as normal text deletion.

A selected object shows a subtle frame and delete control. Right click opens a small contextual toolbar for left/center/right alignment, custom color, and duplication.

## Medium changes
Changing `none` ↔ `board` preserves content, kind, position, alignment, and custom color. Only resolved font/default color change. A deliberately selected custom color always wins over the medium default.

## Regression constraints
The cleaned baseline remains authoritative: removed legacy text files stay removed, no legacy runtime is reloaded, no font repair mechanisms return, and presentation medium/text controls remain compatible with the existing Creator shell.

## Testing
Tests must cover central font ownership, kind defaults, immutable medium switching behavior, custom color persistence, position persistence, duplication semantics, delete/edit protection, and absence of legacy text/font runtime mechanisms.