// src/data/case-studies.ts
// Case studies, in order. The home page rail shows them in this order, and the
// case-study pages read it for prev/next. href points at /lab/<slug>; a study
// with no href is coming soon (shown dimmed, not clickable).

export interface CaseStudy {
  title: string;
  /** path under public/; omitted = neutral empty image slot */
  image?: string;
  /** omitted = coming soon (dimmed, not clickable) */
  href?: string;
}

export const caseStudies: CaseStudy[] = [
  { title: 'Tomodachi', image: '/lab/tomodachi.png', href: '/lab/tomodachi' },
  { title: 'Ourtopia' },
  { title: 'MakerFlow' },
];
