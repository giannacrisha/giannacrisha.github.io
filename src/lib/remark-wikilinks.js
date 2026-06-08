// src/lib/remark-wikilinks.js
// Remark plugin to handle Obsidian-style wikilinks in markdown:
//   [[slug]]         → resolved internal link (from slug-map.json)
//   [[slug|label]]   → resolved link with custom label
//   ![[image.ext]]   → stripped (attachments aren't synced to the repo)
//
// The slug map is generated at build time by the vite plugin in astro.config.mjs.

import { visit, SKIP } from 'unist-util-visit';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SLUG_MAP_PATH = join(__dirname, 'slug-map.json');
const WIKI_RE = /(!?\[\[([^\][\n]+)\]\])/g;

function loadSlugMap() {
  try {
    if (existsSync(SLUG_MAP_PATH)) {
      return JSON.parse(readFileSync(SLUG_MAP_PATH, 'utf-8'));
    }
  } catch {}
  return {};
}

export function remarkWikilinks() {
  return (tree) => {
    const slugMap = loadSlugMap();

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index == null || !node.value.includes('[[')) return;

      const parts = [];
      let lastIndex = 0;
      WIKI_RE.lastIndex = 0;

      let match;
      while ((match = WIKI_RE.exec(node.value)) !== null) {
        const [full, , inner] = match;
        const isEmbed = full.startsWith('!');
        const start = match.index;

        if (start > lastIndex) {
          parts.push({ type: 'text', value: node.value.slice(lastIndex, start) });
        }

        if (!isEmbed) {
          const [rawSlug, rawLabel] = inner.split('|');
          const slug = rawSlug.trim().toLowerCase().replace(/\s+/g, '-');
          const label = rawLabel?.trim() ?? rawSlug.trim();
          const url = slugMap[slug] ?? null;

          if (url) {
            parts.push({ type: 'link', url, children: [{ type: 'text', value: label }] });
          } else {
            // Unresolved wikilink — render as muted styled span
            parts.push({
              type: 'html',
              value: `<span class="wikilink-unresolved" title="unresolved: ${inner.trim()}">${label}</span>`,
            });
          }
        }
        // ![[...]] image/file embeds → silently stripped

        lastIndex = start + full.length;
      }

      if (lastIndex < node.value.length) {
        parts.push({ type: 'text', value: node.value.slice(lastIndex) });
      }

      // Only splice if we actually found wikilinks
      const hasWikilinks = parts.some(p => p.type !== 'text');
      if (!hasWikilinks && parts.length === 1) return;

      parent.children.splice(index, 1, ...parts);
      return [SKIP, index];
    });
  };
}
