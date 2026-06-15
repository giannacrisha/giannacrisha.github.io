// src/icons.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for every icon on the site.
// To change an icon anywhere, edit its `body` here — nothing else.
//
// Each entry stores its `viewBox` and the raw inner SVG markup (`body`).
// Paint (fill / stroke) lives ON the inner elements via `currentColor`, so the
// <Icon> wrapper can stay uniform (`fill="none"`) and every icon inherits the
// surrounding text color. Render with: <Icon name="filter" size={16} />
// ─────────────────────────────────────────────────────────────────────────────

export interface IconDef {
  viewBox: string;
  /** raw inner SVG markup — must declare its own fill/stroke via currentColor */
  body: string;
}

export const ICONS = {
  // ── Controls ──────────────────────────────────────────────────────────────
  filter: {
    viewBox: '0 0 24 24',
    body: '<path fill="currentColor" d="M2 2H22V5H19V8H16V11H14V19H17V22H10V11H8V8H5V5H2Z"/>',
  },
  sort: {
    viewBox: '0 0 24 24',
    body: '<path fill="currentColor" d="M8 6h2v2h2v2H8v10H6V10H2V8h2V6h2V4h2v2Zm10 8h4v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2h4V4h2v10Z"/>',
  },

  // ── Navigation / chrome ─────────────────────────────────────────────────────
  hamburger: {
    viewBox: '0 0 20 20',
    body: '<line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  close: {
    viewBox: '0 0 20 20',
    body: '<line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  minimize: {
    viewBox: '0 0 14 14',
    body: '<line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // ── Chevrons / arrows ───────────────────────────────────────────────────────
  'chevron-down': {
    viewBox: '0 0 24 24',
    body: '<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  'chevron-left': {
    viewBox: '0 0 14 14',
    body: '<path d="M9 2L4 7l5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  'chevron-right': {
    viewBox: '0 0 14 14',
    body: '<path d="M5 2l5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  send: {
    viewBox: '0 0 18 18',
    body: '<path d="M2 9h14M10 3l6 6-6 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  'external-link': {
    viewBox: '0 0 12 12',
    body: '<path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>',
  },

  // ── Meta ────────────────────────────────────────────────────────────────────
  clock: {
    viewBox: '0 0 12 12',
    body: '<circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.2"/><path d="M6 3.5v3l1.5 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>',
  },
  lines: {
    viewBox: '0 0 12 12',
    body: '<line x1="1" y1="3" x2="11" y2="3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="1" y1="6" x2="9" y2="6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="1" y1="9" x2="6.5" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>',
  },

  // ── Theme toggle ──────────────────────────────────────────────────────────────
  sun: {
    viewBox: '0 0 18 18',
    body: '<circle cx="9" cy="9" r="3.5" fill="currentColor"/><line x1="9" y1="1" x2="9" y2="3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="9" y1="14.5" x2="9" y2="17" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="1" y1="9" x2="3.5" y2="9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="14.5" y1="9" x2="17" y2="9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="3.5" y1="3.5" x2="5.3" y2="5.3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.75"/><line x1="12.7" y1="12.7" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.75"/><line x1="14.5" y1="3.5" x2="12.7" y2="5.3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.75"/><line x1="5.3" y1="12.7" x2="3.5" y2="14.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.75"/>',
  },
  moon: {
    viewBox: '0 0 16 16',
    body: '<path d="M14 11A7 7 0 0 1 5 2a7 7 0 1 0 9 9z" fill="currentColor"/>',
  },

  // ── Social / brand ──────────────────────────────────────────────────────────
  bluesky: {
    viewBox: '0 0 24 24',
    body: '<path fill="currentColor" d="M23 3V11H22V13H20V14H18V15H20V16H21V19H20V20H19V21H17V22H15V21H14V20H13V18H11V20H10V21H9V22H7V21H5V20H4V19H3V16H4V15H6V14H4V13H2V11H1V3H2V2H4V3H6V4H7V5H8V6H9V7H10V9H11V10H13V9H14V7H15V6H16V5H17V4H18V3H20V2H22V3H23Z"/>',
  },
  linkedin: {
    viewBox: '0 0 24 24',
    body: '<path fill="currentColor" d="m22,2v-1H2v1h-1v20h1v1h20v-1h1V2h-1Zm-9,10v8h-3v-11h3v1h1v-1h4v1h1v10h-3v-8h-3Zm-9-4v-3h3v3h-3Zm3,1v11h-3v-11h3Z"/>',
  },
  github: {
    viewBox: '0 0 24 24',
    body: '<polygon fill="currentColor" points="23 9 23 15 22 15 22 17 21 17 21 19 20 19 20 20 19 20 19 21 18 21 18 22 16 22 16 23 15 23 15 18 14 18 14 17 15 17 15 16 17 16 17 15 18 15 18 14 19 14 19 9 18 9 18 6 16 6 16 7 15 7 15 8 14 8 14 7 10 7 10 8 9 8 9 7 8 7 8 6 6 6 6 9 5 9 5 14 6 14 6 15 7 15 7 16 9 16 9 18 7 18 7 17 6 17 6 16 4 16 4 17 5 17 5 19 6 19 6 20 9 20 9 23 8 23 8 22 6 22 6 21 5 21 5 20 4 20 4 19 3 19 3 17 2 17 2 15 1 15 1 9 2 9 2 7 3 7 3 5 4 5 4 4 5 4 5 3 7 3 7 2 9 2 9 1 15 1 15 2 17 2 17 3 19 3 19 4 20 4 20 5 21 5 21 7 22 7 22 9 23 9"/>',
  },
  cc: {
    viewBox: '0 0 24 24',
    body: '<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-5h2V9h-2v6zm0-8h2V5h-2v2z" fill="currentColor"/>',
  },
  heart: {
    viewBox: '0 0 24 24',
    body: '<polygon points="23 6 23 11 22 11 22 12 21 12 21 13 20 13 20 14 19 14 19 15 18 15 18 16 17 16 17 17 16 17 16 18 15 18 15 19 14 19 14 20 13 20 13 21 11 21 11 20 10 20 10 19 9 19 9 18 8 18 8 17 7 17 7 16 6 16 6 15 5 15 5 14 4 14 4 13 3 13 3 12 2 12 2 11 1 11 1 6 2 6 2 5 3 5 3 4 4 4 4 3 10 3 10 4 11 4 11 5 13 5 13 4 14 4 14 3 20 3 20 4 21 4 21 5 22 5 22 6 23 6" fill="currentColor"/>',
  },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof ICONS;
