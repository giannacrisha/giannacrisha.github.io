// src/data/case-studies.ts
// Featured case studies on the home page. Edit freely — order here is the
// order they appear in the rail. Copy is placeholder until the real writeups land.
// Images live in public/images/case-studies/. href points at /design-lab/<slug>;
// those pages may not exist yet.

export interface CaseStudy {
  /** card heading */
  title:       string;
  /** one line, kept short — it sits under the title in the card's bottom block */
  description: string;
  /** rendered as pills, staggered in after the card settles */
  skills:      string[];
  /** path under public/ */
  image:       string;
  href:        string;
}

export const caseStudies: CaseStudy[] = [
  {
    title:       'OurTopia',
    description: 'A shared world-building space where communities draw the future they want.',
    skills:      ['product design', 'systems', 'research'],
    image:       '/images/case-studies/ourtopia.png',
    href:        '/design-lab/ourtopia',
  },
  {
    title:       'Tomodachi',
    description: 'A companion app for keeping long-distance friendships warm.',
    skills:      ['interaction design', 'prototyping', 'branding'],
    image:       '/images/case-studies/tomodachi.png',
    href:        '/design-lab/tomodachi',
  },
  {
    title:       'MakerFlow',
    description: 'Tooling that gets makers from a half-formed idea to a first build.',
    skills:      ['design systems', 'front-end', 'strategy'],
    image:       '/images/case-studies/makerflow.png',
    href:        '/design-lab/makerflow',
  },
];
