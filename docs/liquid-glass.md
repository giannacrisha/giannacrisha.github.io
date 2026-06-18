# Liquid glass

Refractive frosted-glass panels used on the heart cursor, garden nav dropdown, and migration card.

## Architecture (two layers)

`LiquidGlass.astro` does two jobs:

1. **Frost + refraction** — blurs/distorts whatever is behind the element
2. **Chrome** — glossy edge highlights + chromatic aberration at the border

On Chrome, real backdrop refraction only works when `backdrop-filter` and `filter: url(#svg)` are on the **same element**. This site splits them deliberately:

| Layer | Role |
|-------|------|
| **Glass div** (e.g. `.my-glass-back`) | `backdrop-filter: blur(2px) saturate(200%)` + `filter: url(#your-id)` on Chromium |
| **`<LiquidGlass backdrop={false}>`** | SVG filter definition + edge chrome + slot content |

Do **not** use a single wrapper component that merges these incorrectly — the backdrop layer must be a sibling, not inside `LiquidGlass` with `backdrop={true}`, for the production look.

## Recipe

### 1. Markup

```astro
---
import LiquidGlass from '../components/LiquidGlass.astro';
---

<div class="my-glass-wrap">
  <div class="my-glass-back" aria-hidden="true"></div>
  <div class="my-glass-panel">
    <LiquidGlass
      displacement={100}
      aberration={3}
      cornerRadius={24}
      filterId="my-unique-id"
      backdrop={false}
    >
      <!-- content -->
    </LiquidGlass>
  </div>
</div>
```

### 2. CSS

```css
.my-glass-wrap {
  position: relative; /* or absolute / fixed */
}
.my-glass-back {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  overflow: hidden;
  clip-path: inset(0 round 24px);
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(2px) saturate(200%);
  -webkit-backdrop-filter: blur(2px) saturate(200%);
  box-shadow:
    0 0 0 0.75px rgba(255, 255, 255, 0.35) inset,
    0 4px 16px rgba(0, 0, 0, 0.12);
  pointer-events: none;
  z-index: 0;
}
:root[data-lg-refract="1"] .my-glass-back {
  filter: url(#my-unique-id);
}
.my-glass-panel {
  position: relative;
  display: inline-flex;
  z-index: 1;
}
```

### 3. JS — sync glass size to panel

The glass div has no content, so it does not size itself. Match the panel:

```js
const panel = document.querySelector('.my-glass-panel');
const glass = document.querySelector('.my-glass-back');
const sync = () => {
  if (!panel || !glass) return;
  glass.style.width  = panel.offsetWidth  + 'px';
  glass.style.height = panel.offsetHeight + 'px';
};
sync();
if (panel) new ResizeObserver(sync).observe(panel);
```

## Rules

- **`filterId` must be unique** per instance on the page (`heart-pill`, `garden-dd`, `migration-glass`, …)
- **`filter: url(#id)` on the glass div** must match `filterId` on `LiquidGlass`
- **`cornerRadius` must match** the CSS `border-radius` on the glass div
- **Something visually interesting should sit behind the glass** — map tiles, page content, imagery. On a flat solid background the effect is barely visible

## Tuning

Production values (heart, nav, migration card):

```
displacement={100}  aberration={3}  cornerRadius={24}
backdrop-filter: blur(2px) saturate(200%)
```

- Higher `displacement` → stronger edge warp
- Higher `aberration` → more chromatic fringe at edges
- `cornerRadius` 16 for tighter cards, 24 for pills

## Text contrast on glass

- **Light page backgrounds** (nav dropdown): dark text + white `-webkit-text-stroke` — see `Nav.astro`

## Browser support

| Browser | Effect |
|---------|--------|
| Chrome / Edge | Frost + edge displacement + chromatic aberration |
| Safari / Firefox | Frost + edge chrome only (no real backdrop refraction) |

`LiquidGlass.astro` sets `data-lg-refract` on `<html>` to detect Chromium support.

## Live examples

| Location | File | Notes |
|----------|------|-------|
| Heart cursor label | `src/components/HeartCanvas.astro` | Glass is `position: fixed`, follows pointer |
| Garden dropdown | `src/components/Nav.astro` | Glass is `position: absolute` in dropdown |
| Migration card | `src/pages/about.astro` | White card + city rail (no liquid glass) |
