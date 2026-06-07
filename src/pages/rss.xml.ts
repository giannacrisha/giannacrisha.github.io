// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../config/design';

export async function GET(context: { site: URL }) {
  const archives = await getCollection('archives');
  const sorted = archives.sort((a, b) => {
    const dateA = (a.data.date_published ?? a.data.date_written).getTime();
    const dateB = (b.data.date_published ?? b.data.date_written).getTime();
    return dateB - dateA;
  });

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
