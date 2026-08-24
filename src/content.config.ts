import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** One or two sentences. Used on the index and in meta tags. */
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Keep to 3 or fewer so the index rows stay on one line. */
    tags: z.array(z.string()).default([]),
    /** Hides the post from the index and the feed, but still builds it. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
