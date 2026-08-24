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

    /**
     * Where this post was first published, for posts imported from elsewhere.
     * Omit for anything written here first.
     */
    source: z.enum(['medium', 'hashnode', 'linkedin']).optional(),

    /**
     * The original URL. Two effects when set: the page emits
     * <link rel="canonical"> pointing here instead of at this site, and the
     * post renders an "originally published on" line.
     *
     * Back catalogue keeps the original canonical so nothing loses the search
     * position it already has. Posts written here first omit both fields and
     * are canonical on this site.
     */
    canonicalUrl: z.string().url().optional(),
  }),
});

export const collections = { blog };
