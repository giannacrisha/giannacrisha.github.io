// No emoji. All visual indicators use SVG. See src/components/icons/
// src/config/design.ts
// Non-CSS design data only (fonts for <link>, taxonomy, site meta, nav links).
// Visual tokens live in src/styles/tokens.css — do not duplicate them here.

export const fonts = {
  display: "'Jacquard 12', monospace",
  mono:    "'Iosevka', monospace",
  serif:   "'Lora', serif",
  body:    "'Atkinson Hyperlegible Next', sans-serif",
  googleFontsUrl: "https://fonts.googleapis.com/css2?family=Jacquard+12&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,700;1,400&display=swap",
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

export const liquidGlass = {
  displacement: 100,
  aberration:   3,
  cornerRadius: 24,
  blur:         20,
  saturation:   200,
  tint:         'rgba(0, 0, 0, 0.13)',
} as const;

export const site = {
  name:        "gianna crisha",
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

// Shared by Nav (desktop + mobile) and Footer. `match` lists the path
// prefixes that mark a link active; it defaults to the link's own href.
export const navLinks = [
  { label: 'the lab',   href: '/garden', match: ['/garden', '/lab', '/archives', '/gallery', '/library'] },
  { label: 'community', href: '/community' },
  { label: 'about',     href: '/about'     },
  { label: 'now',       href: '/now'       },
] as const;
