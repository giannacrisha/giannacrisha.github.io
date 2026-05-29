import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://giannacrisha.github.io',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/system'),
    }),
  ],
});
