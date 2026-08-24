import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { hashnodeLoader } from '~/loaders/hashnode';
import { site } from '~/site.config';

/**
 * Posts come from Hashnode at build time. Nothing is stored in this repo, so
 * there is no local copy to drift out of sync with the published original.
 *
 * See src/loaders/hashnode.ts for the tradeoffs this buys and costs.
 */
const blog = defineCollection({
  loader: hashnodeLoader({ host: site.hashnodeHost }),
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

    /** Where this post was first published. */
    source: z.enum(['medium', 'hashnode', 'linkedin']).optional(),

    /**
     * The original URL. Two effects when set: the page emits
     * <link rel="canonical"> pointing here instead of at this site, and the
     * post renders an "originally published on" line.
     */
    canonicalUrl: z.string().url().optional(),
  }),
});

export const collections = { blog };
