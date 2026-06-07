// src/lib/pixel.ts
// Pure grid math for the 16×16 pixel-art canvas in CommunityGarden.astro.
// Extracted here so these functions are testable in isolation.

export const GRID = 16;

export function idx(c: number, r: number): number {
  return r * GRID + c;
}

export function inBounds(c: number, r: number): boolean {
  return c >= 0 && c < GRID && r >= 0 && r < GRID;
}

export function bresenham(x0: number, y0: number, x1: number, y1: number): { col: number; row: number }[] {
  const pts: { col: number; row: number }[] = [];
  let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    pts.push({ col: x0, row: y0 });
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx)  { err += dx; y0 += sy; }
  }
  return pts;
}

export function rectOutline(x0: number, y0: number, x1: number, y1: number): { col: number; row: number }[] {
  const pts: { col: number; row: number }[] = [];
  const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
  for (let x = minX; x <= maxX; x++) {
    pts.push({ col: x, row: minY });
    if (minY !== maxY) pts.push({ col: x, row: maxY });
  }
  for (let y = minY + 1; y < maxY; y++) {
    pts.push({ col: minX, row: y });
    if (minX !== maxX) pts.push({ col: maxX, row: y });
  }
  return pts;
}

export function ellipseOutline(x0: number, y0: number, x1: number, y1: number): { col: number; row: number }[] {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const rx = Math.abs(x1 - x0) / 2, ry = Math.abs(y1 - y0) / 2;
  if (rx < 0.4 && ry < 0.4) return [{ col: Math.round(cx), row: Math.round(cy) }];
  const pts = new Map<string, { col: number; row: number }>();
  const steps = Math.ceil(Math.PI * 2 * Math.max(rx, ry) * 2.5);
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const c = Math.round(cx + Math.cos(a) * rx), r = Math.round(cy + Math.sin(a) * ry);
    if (inBounds(c, r)) {
      const k = `${c},${r}`;
      if (!pts.has(k)) pts.set(k, { col: c, row: r });
    }
  }
  return [...pts.values()];
}

// floodFill mutates the pixels array in place.
export function floodFill(pixels: (string | null)[], col: number, row: number, newColor: string | null): void {
  const si = idx(col, row);
  const target = pixels[si];
  if (target === newColor) return;
  const stack = [si];
  const visited = new Set<number>();
  while (stack.length) {
    const i = stack.pop()!;
    if (visited.has(i) || pixels[i] !== target) continue;
    visited.add(i);
    pixels[i] = newColor;
    const c = i % GRID, r = Math.floor(i / GRID);
    if (c > 0)        stack.push(i - 1);
    if (c < GRID - 1) stack.push(i + 1);
    if (r > 0)        stack.push(i - GRID);
    if (r < GRID - 1) stack.push(i + GRID);
  }
}
