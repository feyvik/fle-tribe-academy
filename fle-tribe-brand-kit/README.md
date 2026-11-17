# FLE Tribe brand kit (frontend)

Everything the student learning app needs to look like FLE Tribe. Works with React, Angular or plain HTML.

```
styles/fle-tokens.css      Colours (light + dark), fonts, spacing, radius, shadows, type classes
styles/fle-components.css  Ready-made classes: buttons, tags, progress bars, lesson cards, etc.
tailwind.preset.js         Tailwind preset that maps to the same tokens (optional)
tokens/tokens.json         Source of truth for every token
tokens/tokens.ts           Tokens as a typed object, for charts, canvas or emails
assets/logos/              Primary, secondary and mark logos, colour and white (SVG)
assets/pillars/            Forge, Learn, Evolve illustrations (SVG)
```

## 1. Add the fonts

Put this in `index.html` (`src/index.html` in Angular):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
```

## 2. Load the styles once

**React (Vite / Next.js):** copy `styles/` into `src/styles/`, then in `main.tsx` or `app/layout.tsx`:

```ts
import './styles/fle-tokens.css';
import './styles/fle-components.css';
```

**Angular:** copy `styles/` into `src/styles/`, then in `angular.json`:

```json
"styles": ["src/styles/fle-tokens.css", "src/styles/fle-components.css", "src/styles.css"]
```

**Tailwind (optional):** copy `tailwind.preset.js` next to `tailwind.config.js`:

```js
module.exports = {
  presets: [require('./tailwind.preset.js')],
  content: ['./src/**/*.{html,ts,tsx}'],
};
```

You still import `fle-tokens.css`; the preset points Tailwind at those variables.

## 3. Use it

With plain CSS:

```css
.page-title { font-family: var(--font-heading); color: var(--ink); }
.card { background: var(--surface-raised); border-radius: var(--radius-lg); padding: var(--space-5); }
```

With the ready-made classes:

```html
<button class="fle-btn fle-btn-primary fle-btn-md">Start lesson</button>
<span class="fle-tag fle-tag-lime">Completed</span>
<div class="fle-progress-track"><div class="fle-progress-fill fle-progress-primary" style="width:40%"></div></div>
<h1 class="text-h1">Stage 2: JavaScript</h1>
```

With Tailwind:

```html
<button class="bg-primary text-on-primary rounded-md px-s4 h-10 font-body text-label">Start lesson</button>
<div class="bg-surface-raised rounded-lg shadow-sm p-s5">…</div>
```

## Dark mode

It follows the device setting automatically: every colour token switches, so you never write separate dark styles. To let learners choose, set `data-theme="dark"` or `data-theme="light"` on `<html>`.

In dark mode, use the white logos (`*-white.svg`).

## Brand colours

| Colour | Hex | Use it for |
| --- | --- | --- |
| Chrysler Blue | #3F09C9 | Main actions, links, current lesson (`primary`) |
| Raisin Black | #2A292C | Text (`ink`), dark bands (`raisin`) |
| White | #FFFFFF | Cards, text on blue |
| Lime | #B6FF00 | Completed lessons, wins (`lime`) |
| Coral | #F44446 | Streaks, attention (`coral`) |

Always use the token names (`var(--primary)`), not the hex codes, so dark mode and future changes work.

The full rules (voice, when to use each colour, logo spacing, component guidelines) are in the FLE Tribe design system page.
