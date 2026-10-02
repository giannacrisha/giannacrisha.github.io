// src/data/case-studies.ts
// Case studies, in order. The home page rail shows them in this order, and the
// case-study pages read it for prev/next. href points at /lab/<slug>; a study
// with no href is coming soon (labelled as such, not clickable). subtitle and
// tags are optional; the rail card shows each only when present.

export interface CaseStudy {
  title: string;
  /** path under public/; omitted = solid placeholder surface */
  image?: string;
  /** omitted = coming soon (labelled, not clickable) */
  href?: string;
  /** one line under the title */
  subtitle?: string;
  /** shown as pills under the subtitle */
  tags?: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    title: 'Tomodachi',
    href: '/lab/tomodachi',
    subtitle: 'A Tamagotchi-inspired keychain and companion app, designed end to end.',
    tags: ['hardware', 'interaction design', 'prototyping'],
  },
  { title: 'Ourtopia' },
  { title: 'MakerFlow' },
];
