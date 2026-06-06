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
    body: '<path fill="currentColor" d="m1,2v4h1v1h1v1h1v1h1v1h1v1h1v1h1v2h1v3h1v1h1v1h1v1h1v1h1v1h1v-8h1v-2h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1V2H1Zm20,3h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v3h-1v3h-1v-1h-1v-2h-1v-3h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h18v1Z"/>',
  },
  sort: {
    viewBox: '0 0 13 13',
    body: '<path d="M1 2.5h5M1 6.5h8M1 10.5h11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
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
    body: '<path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-8.036C3.566 1.736 1.5 2.013 1.5 5.962c0 .99.125 5.67.198 6.456.254 2.76 2.777 3.65 5.302 3.202-3.953.738-4.938 3.64-2.753 6.38 4.016 5.155 5.778-1.483 6.253-3C10.5 18.999 10.5 19 12 19c1.5 0 1.5-.001 1.5 1c.475 1.517 2.237 8.155 6.253 3 2.185-2.74 1.2-5.642-2.753-6.38 2.525.448 5.048-.442 5.302-3.202.073-.786.198-5.466.198-6.456 0-3.949-2.066-4.226-3.702-3.198C14.046 4.747 13.087 8.686 12 10.8Z" fill="currentColor"/>',
  },
  linkedin: {
    viewBox: '0 0 24 24',
    body: '<rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.6"/><path d="M7 10v7M7 7v.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M11 17v-3.5a2.5 2.5 0 015 0V17M11 10v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  },
  github: {
    viewBox: '0 0 24 24',
    body: '<path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/>',
  },
  cc: {
    viewBox: '0 0 24 24',
    body: '<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-5h2V9h-2v6zm0-8h2V5h-2v2z" fill="currentColor"/>',
  },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof ICONS;
