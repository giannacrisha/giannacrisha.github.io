// scripts/sync-content.mjs
// Copies published content from your Obsidian vault into src/content/.
// Run: npm run sync
//
// Syncs:
//   - All .md files from the vault's collection folders
//   - Image attachments (jpg/jpeg/png/gif/webp/avif) alongside markdown
//     so that gallery carousel images and ![[...]] embeds resolve correctly
// Drafts stay in your vault's inbox (which is gitignored anyway).

import { cpSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, resolve } from 'node:path';

const VAULT_ROOT = resolve(
  process.env.VAULT_PATH ?? '/Users/giannacrisha/Library/Mobile Documents/iCloud~md~obsidian/Documents/gi-garden-vault'
);

const VAULT = join(VAULT_ROOT, '🌱 garden');
const REPO_CONTENT = resolve('src/content');

// 'now' lives one level up from the garden folder, under '👇 now/'
const COLLECTIONS = ['archives', 'gallery', 'lab', 'library'];
const EXTRA = [{ name: 'now', src: join(VAULT_ROOT, '👇 now') }];

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];

function isImage(f) {
  return IMAGE_EXTS.some(ext => f.toLowerCase().endsWith(ext));
}

let copied = 0;
let images = 0;

for (const col of COLLECTIONS) {
  const src  = join(VAULT, col);
  const dest = join(REPO_CONTENT, col);

  if (!existsSync(src)) {
    console.log(`⚠️  Vault folder not found, skipping: ${src}`);
    continue;
  }

  mkdirSync(dest, { recursive: true });

  const allFiles = readdirSync(src);
  const mdFiles  = allFiles.filter(f => f.endsWith('.md'));
  const imgFiles = allFiles.filter(isImage);

  for (const file of mdFiles) {
    cpSync(join(src, file), join(dest, file));
    copied++;
  }
  for (const file of imgFiles) {
    cpSync(join(src, file), join(dest, file));
    images++;
  }

  const imgNote = imgFiles.length > 0 ? ` + ${imgFiles.length} image${imgFiles.length === 1 ? '' : 's'}` : '';
  console.log(`✓  ${col}: ${mdFiles.length} file${mdFiles.length === 1 ? '' : 's'}${imgNote}`);
}

for (const { name, src } of EXTRA) {
  const dest = join(REPO_CONTENT, name);

  if (!existsSync(src)) {
    console.log(`⚠️  Vault folder not found, skipping: ${src}`);
    continue;
  }

  mkdirSync(dest, { recursive: true });

  const files = readdirSync(src).filter(f => f.endsWith('.md'));
  for (const file of files) {
    cpSync(join(src, file), join(dest, file));
    copied++;
  }

  console.log(`✓  ${name}: ${files.length} file${files.length === 1 ? '' : 's'}`);
}

console.log(`\n✨ Synced ${copied} file${copied === 1 ? '' : 's'} + ${images} image${images === 1 ? '' : 's'} total.`);
console.log(`   Review changes with: git diff src/content/`);
console.log(`   Then commit and push when ready.`);
