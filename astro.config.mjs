import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve, basename, extname } from 'path';
import { remarkWikilinks } from './src/lib/remark-wikilinks.js';

// ── Slug map generator ──────────────────────────────────────────────────────
// Scans all content collections at build/dev start and writes a JSON map of
// slug → URL so the wikilinks remark plugin can resolve [[slug]] to real paths.
function buildSlugMapPlugin() {
  const COLLECTIONS = ['lab', 'archives', 'gallery', 'library', 'now'];

  function generate() {
    const contentDir = resolve('./src/content');
    const libDir = resolve('./src/lib');
    const slugMap = {};

    for (const col of COLLECTIONS) {
      const dir = join(contentDir, col);
      if (!existsSync(dir)) continue;
      try {
        const files = readdirSync(dir).filter(
          f => f.endsWith('.md') || f.endsWith('.mdx'),
        );
        for (const file of files) {
          const slug = basename(file, extname(file));
          // Register both the raw slug and a lowercased/hyphenated version
          slugMap[slug] = `/${col}/${slug}`;
          slugMap[slug.toLowerCase()] = `/${col}/${slug}`;
        }
      } catch {}
    }

    mkdirSync(libDir, { recursive: true });
    writeFileSync(join(libDir, 'slug-map.json'), JSON.stringify(slugMap, null, 2));
  }

  return {
    name: 'build-slug-map',
    buildStart: generate,
    configureServer: generate,
  };
}

export default defineConfig({
  site: 'https://giannacrisha.com',
  output: 'static',
  adapter: vercel(),
  markdown: {
    remarkPlugins: [remarkWikilinks],
  },
  integrations: [
    mdx({
      // MDX extends the base markdown config, so remarkWikilinks runs for .mdx too
      extendMarkdownConfig: true,
    }),
    sitemap({
      filter: (page) => !page.includes('/system'),
    }),
  ],
  vite: {
    plugins: [buildSlugMapPlugin()],
  },
});
