import { defineCollection, z, type SchemaContext } from 'astro:content';
import { growthStages, contentTypes, mediaTypes, type GrowthStage } from '../config/design';

// Cast via the exported GrowthStage type so Zod infers the literal union,
// not widened string — this is what clears the ~10 GrowthPill type errors.
const stageKeys   = Object.keys(growthStages) as [GrowthStage, ...GrowthStage[]];
const contentKeys = Object.keys(contentTypes) as [keyof typeof contentTypes, ...Array<keyof typeof contentTypes>];
const mediaKeys   = Object.keys(mediaTypes)   as [keyof typeof mediaTypes,   ...Array<keyof typeof mediaTypes>];

const stageEnum   = z.enum(stageKeys);
const contentEnum = z.enum(contentKeys);
const mediaEnum   = z.enum(mediaKeys);

// Fields shared by every article collection (lab, archives, gallery).
// Each collection adds its own primary date + collection-specific fields.
// Keeping this in one place is what keeps the article schemas consistent.
const articleFields = ({ image }: { image: SchemaContext['image'] }) => ({
  title:          z.string(),
  date_published: z.date().optional(), // defaults to the collection's primary date if omitted
  topics:         z.array(z.string()).optional(),
  growth_stage:   stageEnum,
  featured:       z.boolean().default(false),
  frame_shape:    z.enum(['rect', 'circle', 'square', 'oval']).optional(),
  link:           z.string().url().optional(),
  cover_image:    z.string().optional(),
  mux_video_id:   z.string().optional(),
  images:         z.array(z.object({ src: image(), alt: z.string().optional(), caption: z.string().optional() })).optional(),
});

const lab = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    ...articleFields({ image }),
    description:    z.string(),
    date_built:     z.date(),
    tools:          z.array(z.string()).optional(),
  }),
});

const archives = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    ...articleFields({ image }),
    type:           contentEnum,
    date_written:   z.date(),
    tags:           z.array(z.string()).nullish(),   // nullish() allows explicit `tags: null` in frontmatter
    note:           z.string().optional(),
  }),
});

const gallery = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    ...articleFields({ image }),
    medium:         z.string(),
    date_made:      z.date(),
    image:          z.string(),
    caption:        z.string().optional(),
  }),
});

const library = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    creator:     z.string(),
    year:        z.number(),
    type:        mediaEnum,
    date_added:  z.date(),
    rating:      z.number().min(0).max(5),
    review:      z.string().optional(),
    cover_image: z.string().optional(),
    link:        z.string().url().optional(),
    status:      z.enum(['read', 'in progress', 'to read']).optional(),
    featured:    z.boolean().default(false),
  }),
});

const now = defineCollection({
  type: 'content',
  schema: z.object({
    date: z.date(),
  }),
});

export const collections = { lab, archives, gallery, library, now };
