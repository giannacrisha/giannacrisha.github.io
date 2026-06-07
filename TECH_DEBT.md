# Tech Debt

Tracked findings from the June 2026 codebase audit.
Items are grouped by effort. Fixed items are removed from this list.

---

## Already Fixed ✅

| # | What | When |
|---|------|------|
| 1 | Added `npm run check` + `.github/workflows/ci.yml` quality gate | Jun 2026 |
| 2 | Removed misleading "auto-mirrors design.ts" comment from `tokens.css` | Jun 2026 |
| 3 | Upgraded `@astrojs/vercel` 8 → 9, pinned `path-to-regexp >= 6.3.0` via `overrides` | Jun 2026 |
| 4 | Moved rate limiting to `@upstash/ratelimit` (persists across serverless instances) | Jun 2026 |
| 5 | Deleted dead `plantingHTML()` function (latent XSS), `FilterBar.astro`, `GardenFilters.astro` | Jun 2026 |
| 6 | Fixed enum cast in `content/config.ts` — clears ~10 GrowthPill type errors | Jun 2026 |
| 7 | Fixed `rss.xml.ts` nondeterministic RSS sort (`date_published ?? date_written`) | Jun 2026 |
| 8 | Removed dead `case_studies` collection from `content/config.ts` | Jun 2026 |
| 9 | Added `featured` field to gallery schema (was silently missing) | Jun 2026 |
| 10 | Fixed `date_published ?? date_built/written` coalescing in Card call sites | Jun 2026 |

---

## Architecture

### 🟠 Extract inline scripts from `src/pages/index.astro` (2,175 lines)
**Risk:** High coupling — modal, sparkle, and filter logic share one risk surface.  
**Fix:** Extract to `src/lib/{modal,overlay,sparkle}.ts` and import as `<script type="module">`.  
**Start with:** The modal/tab system — it's the most self-contained chunk (~400 lines).

### 🟠 Extract pixel-art engine from `CommunityGarden.astro` (1,420 lines)
**Risk:** Drawing logic untestable; grid math invisible until a user reports a broken drawing.  
**Fix:** Move pure grid functions (`idx`, `inBounds`, flood-fill, mirror) to `src/lib/pixel.ts`.  
**Bonus:** Once extracted, add Vitest unit tests — these are pure functions.

### 🟡 Shared `src/config/github.ts` for repo constants
`REPO_OWNER`/`REPO_NAME` are read from env in both `CommunityGarden.astro` and `plant.ts`.  
`plant.ts` hardcodes `LABEL = 'community-garden'` instead of reading the env var.  
**Fix:** Create `src/config/github.ts` and import in both files.

### 🟡 Duplicated book-spine shadow CSS
Near-identical 3-layer gradient `::after` in `index.astro:1302–1330` and `library/index.astro:77–87`.  
**Fix:** Extract shared `.book-spine-shadow` class to `global.css`.

---

## Security

### 🟠 Migrate to Astro 6 (unblocks remaining npm vulns)
**Context:** `@astrojs/vercel@9` + `path-to-regexp override` fixes the path-to-regexp ReDoS and
the unauthenticated path-override vuln at the routing layer. The remaining high-severity advisory
(`GHSA-mr6q-rp88-fx84` on `@astrojs/vercel *`) is fully fixed in `@astrojs/vercel@10`, which
requires Astro 6. Astro 6 migration requires:
- Move `src/content/config.ts` → `src/content.config.ts`
- Add `glob()` loaders to each collection (or use `legacy.collections: true`)
- Check `entry.slug` usage (Astro 6 uses `entry.id` in the new Content Layer API)
- Bump `@astrojs/mdx` to v6, `@astrojs/vercel` to v10

### 🟠 CSP `script-src 'unsafe-inline'`
**Risk:** Defeats CSP's XSS value if any injection bug lands. Low urgency given static output.  
**Fix:** Adopt Astro's build-time CSP (hash-based, built into Astro 6) — another reason to migrate.

---

## Content Pipeline

### 🟡 `garden-push.sh` — hardcoded absolute paths
```bash
# line 9-10
VAULT="/Users/giannacrisha/Library/Mobile Documents/..."
DEST="/Users/giannacrisha/projects/..."
```
**Fix:** Read from env vars (`VAULT_PATH`, `DEST_PATH`) with the current values as documented defaults.

### 🟡 `garden-push.sh` — no frontmatter validation before sync
A bad YAML field in Obsidian syncs fine, then fails the Vercel build.  
You've already hit this (`makerflow.md` had `date_started` instead of `date_built`).  
**Fix:** Run `npm run check` (or a frontmatter linter) in `garden-push.sh` before `git commit`, abort on failure.
```bash
npm run check || { echo "⛔ Type errors — fix before pushing"; exit 1; }
```

### 🟡 `scripts/sync-content.mjs` is missing `now`
`npm run sync` covers `[archives, gallery, lab, library]` but not `now`.  
`garden-push.sh` does include `now`. Two sync paths with different coverage.  
**Fix:** Add `'now'` to `sync-content.mjs` — or delete one of the two sync scripts.

### 🟡 `library/[slug].astro` — duplicate timestamp
`Timestamps` receives `primaryDate` and `secondaryDate` both equal to `date_added` — renders the same date twice.  
**Fix:** Drop the redundant secondary.

---

## DX & Tooling

### 🟡 No linter/formatter
Only `typescript` and `@astrojs/check` are dev deps. Nothing formats `.astro` files.  
**Fix:** Add `prettier` + `prettier-plugin-astro` as dev deps; add a `"format"` script.  
Optional but helps catch structural issues early.

### 🟡 Zero tests on attacker-reachable code
`plant.ts` validators (`stripHtml`, hex-pixel sanitize) are the only code path that touches
attacker-controlled input. They have no coverage.  
**Fix:** Add `vitest`, extract the pure helpers, write ~15 lines of tests.

### 🟡 Orphan brand colors bypassing tokens
`#e5534b` (danger/heart red) hardcoded in `MinimizeBar.astro:92`, `CommunityGarden.astro:544,613`.  
`#ff6059` hardcoded in `index.astro:682,794`.  
**Fix:** Add `--color-danger: #e5534b` to `tokens.css`; reference via `var()`.

### 🟡 Empty state handling on collection pages
Index pages (`lab`, `archives`, `gallery`, `library`, `now`) have no `length === 0` guard.  
An rsync failure or empty Obsidian vault would render a silent blank grid.  
**Fix:** `{sorted.length === 0 ? <p class="empty">nothing here yet</p> : sorted.map(...)}`
