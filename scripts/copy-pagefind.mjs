// scripts/copy-pagefind.mjs
// Copies the Pagefind index into public/ so `astro dev` can serve /pagefind/*.
// Run automatically after `npm run build`.

import { cpSync, existsSync, rmSync } from 'fs';

const src = '.vercel/output/static/pagefind';
const dest = 'public/pagefind';

if (!existsSync(src)) {
  console.warn('[copy-pagefind] No index at .vercel/output/static/pagefind — skipping');
  process.exit(0);
}

if (existsSync(dest)) rmSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log('[copy-pagefind] Copied index to public/pagefind (dev server)');
