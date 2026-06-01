// scripts/sync-content.mjs
// Copies published .md content from your Obsidian vault into src/content/.
// Run: npm run sync
//
// Only .md files are copied — no Obsidian attachments, canvas files, etc.
// Drafts stay in your vault's inbox (which is gitignored anyway).

import { cpSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const VAULT = resolve(
  '/Users/giannacrisha/Library/Mobile Documents/iCloud~md~obsidian/Documents/gi-garden-vault/🌱 garden'
);

const REPO_CONTENT = resolve('src/content');

const COLLECTIONS = ['archives', 'gallery', 'lab', 'library'];

let copied = 0;

for (const col of COLLECTIONS) {
  const src  = join(VAULT, col);
  const dest = join(REPO_CONTENT, col);

  if (!existsSync(src)) {
    console.log(`⚠️  Vault folder not found, skipping: ${src}`);
    continue;
  }

  mkdirSync(dest, { recursive: true });

  // Copy only .md files (skip attachments, canvas, etc.)
  const files = readdirSync(src).filter(f => f.endsWith('.md'));
  for (const file of files) {
    cpSync(join(src, file), join(dest, file));
    copied++;
  }

  console.log(`✓  ${col}: ${files.length} file${files.length === 1 ? '' : 's'}`);
}

console.log(`\n✨ Synced ${copied} file${copied === 1 ? '' : 's'} total.`);
console.log(`   Review changes with: git diff src/content/`);
console.log(`   Then commit and push when ready.`);
