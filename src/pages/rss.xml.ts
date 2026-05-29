// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../config/design';

export async function GET(context: { site: URL }) {
  const archives = await getCollection('archives');
  const sorted = archives.sort((a, b) => b.data.date_published.getTime() - a.data.date_published.getTime());

  return rss({
    title: site.rssTitle,
    description: site.description,
    site: context.site,
    items: sorted.map(entry => ({
      title: entry.data.title,
      pubDate: entry.data.date_published,
      link: `/archives/${entry.slug}/`,
    })),
  });
}
