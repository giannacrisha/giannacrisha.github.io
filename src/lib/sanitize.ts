// src/lib/sanitize.ts
// Input sanitization helpers shared by plant.ts (and testable by vitest).

// Valid CSS hex color: #rgb, #rrggbb, #rrggbbaa
export const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/&(?:[a-z]+|#\d+);/gi, (e) => {
    const map: Record<string, string> = {
      '&amp;': '&',
      '&lt;':  '<',
      '&gt;':  '>',
      '&quot;': '"',
      '&#39;':  "'",
    };
    return map[e] ?? e;
  });
}

export function sanitizePixel(p: unknown): string | null {
  if (p === null || p === undefined) return null;
  if (typeof p === 'string' && HEX_COLOR.test(p)) return p;
  return null;
}
