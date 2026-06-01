// No emoji. All visual indicators use SVG. See src/components/icons/
// src/config/design.ts
// Single source of truth for all design tokens.

export const colors = {
  bg:           '#faf7f2',
  fg:           '#3d2f1f',
  card:         '#ffffff',
  muted:        '#7A6035',
  accent:       '#9C8B6E',
  accentLight:  '#EDE5D8',
  border:       '#E8DCC8',
  pillBg:       '#E8DDD0',
  pillText:     '#6B5C47',
  accentBorder: '#C4B49A',
} as const;

export const fonts = {
  display: "'Jacquard 12', monospace",
  serif:   "'Lora', serif",
  body:    "'Atkinson Hyperlegible Next', sans-serif",
  googleFontsUrl: "https://fonts.googleapis.com/css2?family=Jacquard+12&family=Lora:wght@500&family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,700;1,400&display=swap",
} as const;

export const fontSizes = {
  xs:      '11px',
  sm:      '12px',
  base:    '14px',
  md:      '16px',
  lg:      '18px',
  xl:      '24px',
  xxl:     '36px',
  hero:    'clamp(48px, 8vw, 80px)',
  section: 'clamp(28px, 4vw, 40px)',
} as const;

export const lineHeights = {
  tight: '1.3',
  base:  '1.6',
  loose: '1.8',
  poem:  '2.0',
} as const;

export const spacing = {
  xs:      '4px',
  sm:      '8px',
  md:      '12px',
  lg:      '16px',
  xl:      '24px',
  xxl:     '40px',
  section: '64px',
} as const;

export const layout = {
  contentWidth: '720px',
  siteWidth:    '1100px',
  cardRadius:   '12px',
  pillRadius:   '20px',
  inputRadius:  '8px',
  borderWidth:  '0.5px',
  borderStyle:  'solid',
} as const;

export const growthStages = {
  dust: {
    id:          'dust',
    label:       'dust',
    description: 'early, scattered, not yet gathered',
    order:        1,
  },
  spark: {
    id:          'spark',
    label:       'spark',
    description: 'igniting, taking shape, in progress',
    order:        2,
  },
  star: {
    id:          'star',
    label:       'star',
    description: 'complete, burning steadily, fully itself',
    order:        3,
  },
} as const;

export type GrowthStage = keyof typeof growthStages;

export const contentTypes = {
  essay:   { id: 'essay',   label: 'essay'   },
  poem:    { id: 'poem',    label: 'poem'     },
  thought: { id: 'thought', label: 'thought'  },
} as const;

export const mediaTypes = {
  film:  { id: 'film',  label: 'film'  },
  book:  { id: 'book',  label: 'book'  },
  album: { id: 'album', label: 'album' },
  show:  { id: 'show',  label: 'show'  },
  other: { id: 'other', label: 'other' },
} as const;

export const site = {
  name:        "gi's digital garden",
  tagline:     "designer, writer, creative technologist. growing in public.",
  description: "Gianna Crisha Saludo is a Filipino creative technologist, designer, and anthropologist based in the US. This is her digital garden: a living collection of essays, poems, art, lab projects, and half-formed thoughts on creativity, technology, culture, and what it means to make things. She writes about design, the internet, Filipino identity, and the blurry edges between disciplines. If you're looking for portfolio inspiration, digital garden examples, or the work of a creative who refuses to pick just one thing, you're in the right place.",
  url:         'https://giannacrisha.github.io',
  author:      'Gianna Crisha Saludo',
  authorShort: 'gi',
  keywords:    [
    'digital garden', 'Filipino creative', 'Filipino designer', 'creative technologist',
    'design engineer', 'anthropologist', 'Filipino anthropologist', 'personal website',
    'portfolio inspiration', 'digital garden example', 'Filipino creative technologist',
    'art and technology', 'creative writing', 'essays', 'poems', 'design portfolio',
    'interdisciplinary', 'creative portfolio', 'Filipino writer', 'creative technologist portfolio',
    'design systems', 'web design inspiration', 'personal essays', 'digital humanities',
    'Filipino diaspora', 'Brandeis University',
  ],
  rssTitle:    "gi's garden — archives",
} as const;
