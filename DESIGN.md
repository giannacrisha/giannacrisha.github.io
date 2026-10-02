# Design system — gi's digital garden

Portable spec. Paste this whole file into any LLM to give it the house style.
Editing rule: **change values in `src/styles/tokens.css`, change rules here.**

## Source of truth
| Thing | Lives in | Notes |
|---|---|---|
| Colors, type scale, space, radii, shadows | `src/styles/tokens.css` | the only place values are defined |
| Global element + utility styles (`.pill`, `.btn`, `.page-wrapper`, focus rings) | `src/styles/global.css` | reuse these before writing new CSS |
| Fonts for `<link>`, taxonomy, site meta | `src/config/design.ts` | **no visual tokens here** — never re-declare a color/size |
| Icons | `src/icons.ts` + `Icon.astro` | one place; no emoji anywhere, ever |
| Live swatch page | `/system` (`src/pages/system.astro`) | renders from CSS vars |
| Liquid glass effect | `docs/liquid-glass.md` | refraction = `filter: url(#id)`; `backdrop-filter` only does blur + saturate. Never merge them. |

## Voice of the thing
Warm parchment and gold-brown, not grey tech. Lowercase headings. Soft 0.5px
borders over hard lines. Fluid type (Utopia) so nothing snaps at breakpoints.
Pixel-art trinkets sit next to serif prose on purpose — cozy, hand-made,
slightly medieval; a garden, not a dashboard.

## Rules
1. **Never hardcode a value.** Always `var(--token)`. If no token fits, add one to `tokens.css` — don't inline a hex, px size, or radius.
2. **Fonts, by role:** display = `--font-display` (Jacquard 12), code/labels = `--font-mono` (Iosevka), prose headings = `--font-serif` (Lora), body/UI = `--font-body` (Atkinson Hyperlegible Next).
3. **No emoji.** All indicators are SVG via `Icon.astro`.
4. **Both themes.** Every color must be a token that has a `:root[data-theme="dark"]` value. Never define a color only inside a media/theme block.
5. **DRY.** Repeated markup or values get centralized. Delete dead code, imports, and vars as part of the change — no leftovers.
6. **Smallest fix wins.** Don't abstract working code. Prefer reverting to a proven form over inventing a new one.
7. **Motion is weighted, never springy.** One easing — `--ease-out-quiet`. Things
   decelerate into place and never overshoot or bounce. Animate `transform` and
   `opacity` only, never layout properties. Scroll-linked motion uses CSS
   `animation-timeline`; never hijack the wheel or `preventDefault` a scroll.
8. **Accessible by default.** Text ≥ 4.5:1 (`--color-muted` is tuned to exactly that in both themes). Keep the `:focus-visible` rings and the `prefers-reduced-motion` block in `global.css`.

## Token map (names, not values — values are in tokens.css)
- Color: `--color-{bg,fg,heading,card,muted,accent,accent-light,border,pill-bg,pill-text,accent-border,danger,traffic-red}`, plus dark-only `--color-{title,surface}`, `--card-grad` (metallic gold gradient), `--shadow-gold` and `--glow-heart` (hero heart halo, a `filter` value).
- Type: `--text-{xs,sm,base,md,lg,xl,xxl,section,hero}` (fluid, except `--text-base` = fixed 14px for tiny UI labels). Leading: `--leading-{tight,base,loose,poem}`.
- Space: `--space-{xs,sm,md,lg,xl,xxl,section}` → fluid steps.
- Layout: `--width-content` 720, `--width-site` 1100, `--width-preview` (hover cards, tooltips), `--width-toc` (floating table-of-contents panel), `--ratio-media` (media slots), `--nav-height` 56, `--radius-{card,lg,pill,input}`, `--border`, `--rule-thickness` (indicator bars, underlines).
- Motion: `--ease-out-quiet` (the only easing: decelerating, no overshoot), `--dur-{card,text}`, `--delay-text`, `--stagger-tag` (offset between a card's title, subtitle and each tag as they arrive), `--scale-recede`, `--opacity-recede`, `--blur-recede`, `--pace-card` (scroll distance per card in a pinned sequence), `--opacity-soon` (how far a coming-soon link steps back).

- Demos: `--tomodachi-*` is the Tomodachi app's own palette and phone-frame sizing for `<tomodachi-demo>` (`TomodachiDemo.astro`). It is content, like a screenshot, so it reads the same in both themes; only `--tomodachi-bezel` has a dark value.

## Growth taxonomy (`src/config/design.ts`)
`dust` → scattered, not yet gathered · `spark` → taking shape · `star` → complete, fully itself.

## To adjust the system
1. Edit `src/styles/tokens.css` (both `:root` and the dark block).
2. Update the relevant rule above if the *intent* changed, not just the value.
3. Check `/system`.
