import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const rfc = defineCollection({
  loader: glob({
    pattern: 'RFC-*.md',
    base: './docs/rfc',
    generateId: ({ entry }) => entry.replace(/\.md$/i, ''),
  }),
  schema: z.object({
    title: z.string(),
    status: z.string(),
    category: z.string(),
    version: z.string(),
    updated: z.coerce.date(),
    repository: z.string(),
    supersedes: z.array(z.string()).default([]),
    superseded_by: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
  }),
});

const openStandards = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './docs/open-standards',
    generateId: ({ entry }) => entry.replace(/\.md$/i, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    order: z.number().default(99),
  }),
});

export const collections = { rfc, openStandards };
