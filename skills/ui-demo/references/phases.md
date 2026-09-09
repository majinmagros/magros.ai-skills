# Phases — Discover, Rehearse, Record (detalhe)

## Phase 1: Discover

Before writing any script, explore the target pages to understand what is actually there.

**Why:** You cannot script what you have not seen. Fields may be `<input>` not `<textarea>`, dropdowns may be custom components not `<select>`, and comment boxes may support `@mentions` or `#tags`. Assumptions break recordings silently.

**How:** Navigate to each page and dump interactive elements:

```javascript
// Run this for each page in the flow BEFORE writing the demo script
const fields = await page.evaluate(() => {
  const els = [];
  document.querySelectorAll('input, select, textarea, button, [contenteditable]').forEach(el => {
    if (el.offsetParent !== null) {
      els.push({
        tag: el.tagName,
        type: el.type || '',
        name: el.name || '',
        placeholder: el.placeholder || '',
        text: el.textContent?.trim().substring(0, 40) || '',
        contentEditable: el.contentEditable === 'true',
        role: el.getAttribute('role') || '',
      });
    }
  });
  return els;
});
console.log(JSON.stringify(fields, null, 2));
```

**What to look for:**
- **Form fields**: `<select>`, `<input>`, custom dropdowns, or comboboxes?
- **Select options**: Dump values AND text. Placeholders often have `value="0"` or `value=""` — skip options where text includes "Select" or value is `"0"`.
- **Rich text**: `@mentions`, `#tags`, markdown, emoji? Check placeholder.
- **Required fields**: `required`, `*` in labels; submit empty to see validation errors.
- **Dynamic content**: Fields appearing after other fields are filled?
- **Button labels**: Exact text (`"Submit"`, `"Submit Request"`, `"Send"`).
- **Table headers**: Map each `input[type="number"]` to its column header.

**Output:** field map per page (see example below), used for correct selectors:

```text
/purchase-requests/new:
  - Budget Code: <select> (first select on page, 4 options)
  - Desired Delivery: <input type="date">
  - Context: <textarea> (not input)
  - BOM table: inline-editable cells with span.cursor-pointer -> input pattern
  - Submit: <button> text="Submit"

/purchase-requests/N (detail):
  - Comment: <input placeholder="Type a message..."> supports @user and #PR tags
  - Send: <button> text="Send" (disabled until input has content)
```

## Phase 2: Rehearse

Run through all steps without recording. Verify every selector resolves — silent selector failures are the main reason demos break.

**Rehearsal script:** list of `{label, selector}` pairs run through `ensureVisible` (fails loudly + dumps visible elements); exit 1 on any failure; only proceed when all pass:

```javascript
const steps = [
  { label: 'Login email field', selector: '#email' },
  { label: 'Login submit', selector: 'button[type="submit"]' },
  // ... one entry per interaction, in story order
];
let allOk = true;
for (const step of steps) {
  if (!await ensureVisible(page, step.selector, step.label)) allOk = false;
}
if (!allOk) { console.error('REHEARSAL FAILED - fix selectors before recording'); process.exit(1); }
console.log('REHEARSAL PASSED - all selectors verified');
```

**When rehearsal fails:** 1. Read the visible-element dump. 2. Fix selector. 3. Update script. 4. Re-run. 5. Only proceed when green.

## Phase 3: Record

Only after discovery and rehearsal pass.

### 1. Storytelling Flow

Entry (login/navigate) → Context (pan surroundings) → Action (main workflow) → Variation (settings/theme/locale) → Result (outcome/confirmation).

### 2. Pacing

After login: `4s` · navigation: `3s` · button click: `2s` · between major steps: `1.5-2s` · final action: `3s` · typing: `25-40ms`/char.

### 3. Cursor Overlay

Inject SVG arrow following the mouse (`injectCursor` in `scripts/demo-helpers.js`). **Re-inject after every navigation** (overlay dies on navigate).

### 4. Mouse Movement

Never teleport — move to target before clicking (`moveAndClick`: scroll into view, 300ms, move in 10 steps, 400ms, click, 800ms post-delay; descriptive `label`; warns instead of throwing).

### 5. Typing

Visible typing, not instant-fill (`typeSlowly`: focus via moveAndClick, clear, `pressSequentially` 35ms/char, 500ms settle).

### 6. Scrolling

Smooth scroll (`behavior: 'smooth'`) + 1500ms settle. No jumps.

### 7. Dashboard Panning

Move cursor across key elements (`panElements(selector, max 6)`: bounding box check, 8-step moves, 600ms each, per-element try/catch).

### 8. Subtitles

Bottom bar (`injectSubtitleBar` + `showSubtitle`): short text (<60 chars), `Step N - Action` format, clear during long pauses. Re-inject with cursor after every navigation.
