import { defineCollection, z } from 'astro:content';
import { growthStages, contentTypes, mediaTypes } from '../config/design';

const stageEnum   = z.enum(Object.keys(growthStages) as [string, ...string[]]);
const contentEnum = z.enum(Object.keys(contentTypes) as [string, ...string[]]);
const mediaEnum   = z.enum(Object.keys(mediaTypes)   as [string, ...string[]]);

const lab = defineCollection({
  type: 'content',
  schema: z.object({
    title:          z.string(),
    description:    z.string(),
    date_built:     z.date(),
    date_published: z.date(),
    tools:          z.array(z.string()).optional(),
    cover_image:    z.string().optional(),
    link:           z.string().url().optional(),
    growth_stage:   stageEnum,
    featured:       z.boolean().default(false),
  }),
});

const archives = defineCollection({
  type: 'content',
  schema: z.object({
    title:          z.string(),
    type:           contentEnum,
    date_written:   z.date(),
    date_published: z.date(),
    tags:           z.array(z.string()).optional(),
    growth_stage:   stageEnum,
    featured:       z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  type: 'content',
  schema: z.object({
    title:          z.string(),
    medium:         z.string(),
    date_made:      z.date(),
    date_published: z.date(),
    image:          z.string(),
    caption:        z.string().optional(),
    growth_stage:   stageEnum,
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
    featured:    z.boolean().default(false),
  }),
});

export const collections = { lab, archives, gallery, library };
