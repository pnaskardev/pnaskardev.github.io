import type { Loader } from 'astro/loaders';
import { XMLParser } from 'fast-xml-parser';
import { htmlToMarkdown, stripTags } from '~/lib/html-to-markdown';

/**
 * Loads posts from a Hashnode publication's RSS feed at build time.
 *
 * Hashnode is the CMS; this repo is only the renderer. Nothing is written to
 * disk, so there is no copy of a post to drift out of sync with the original.
 *
 * Why RSS and not the GraphQL API: Hashnode moved the GraphQL API behind a Pro
 * plan on 2026-05-13 -- reads included. gql.hashnode.com now 301s to the
 * announcement. RSS is the remaining free, public interface. It caps at 20
 * posts, which is the ceiling on how much of the archive this can surface.
 *
 * Consequences worth knowing:
 *   - The build makes a network call. If Hashnode is down or rate limiting
 *     (429s do happen), the build fails rather than shipping a site with the
 *     posts silently missing.
 *   - A new post appears only when the site rebuilds, so the deploy workflow
 *     runs on a schedule as well as on push.
 *   - Images stay on Hashnode's CDN.
 */

interface HashnodeLoaderOptions {
  /** Publication host, e.g. "priyanshucodes.hashnode.dev". */
  host: string;
}

/** RSS values arrive as string, number, or {'#text': ...} depending on CDATA. */
function textOf(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object' && '#text' in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>)['#text']);
  }
  return String(value);
}

const asArray = <T>(value: T | T[] | undefined): T[] =>
  value == null ? [] : Array.isArray(value) ? value : [value];

function slugify(text: string): string {
  const full = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (full.length <= 70) return full;

  // Cut at a word boundary so slugs never end mid-word ("...togethe").
  const cut = full.slice(0, 70);
  const lastDash = cut.lastIndexOf('-');
  return (lastDash > 30 ? cut.slice(0, lastDash) : cut).replace(/-+$/, '');
}

/** Trim to a whole word, so descriptions never end mid-token. */
function truncate(text: string, max = 180): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:!?-]+$/, '')}...`;
}

export function hashnodeLoader({ host }: HashnodeLoaderOptions): Loader {
  const feedUrl = `https://${host.replace(/^https?:\/\//, '').replace(/\/$/, '')}/rss.xml`;

  return {
    name: 'hashnode',

    async load({ store, logger, parseData, renderMarkdown, generateDigest }) {
      logger.info(`Fetching posts from ${feedUrl}`);

      const res = await fetch(feedUrl, {
        headers: {
          'user-agent': 'Mozilla/5.0',
          accept: 'application/rss+xml, application/xml, text/xml',
        },
      });

      if (res.status === 429) {
        throw new Error(
          `Hashnode rate limited the feed (429): ${feedUrl}. Re-run the build in a minute.`,
        );
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} fetching ${feedUrl}`);
      }

      const xml = await res.text();

      // An empty or error response must not silently wipe the blog.
      if (!xml.includes('<item')) {
        throw new Error(`No posts in the feed at ${feedUrl} -- check the publication host.`);
      }

      const parser = new XMLParser({
        ignoreAttributes: false,
        textNodeName: '#text',
        processEntities: true,
        trimValues: true,
      });

      const doc = parser.parse(xml);
      const items = asArray(doc?.rss?.channel?.item);

      store.clear();

      for (const item of items) {
        const title = stripTags(textOf(item.title));
        const link = textOf(item.link).split('?')[0];
        if (!title || !link) {
          logger.warn('Skipping a feed item with no title or link');
          continue;
        }

        const html = textOf(item['content:encoded']) || textOf(item.description);
        if (!html) {
          logger.warn(`Skipping "${title}": no content in the feed`);
          continue;
        }

        const id = slugify(title);
        const markdown = htmlToMarkdown(html);

        const rssDescription = stripTags(textOf(item.description));
        const description = truncate(
          rssDescription && rssDescription.length > 30 ? rssDescription : stripTags(html),
        );

        const data = await parseData({
          id,
          data: {
            title,
            description,
            pubDate: textOf(item.pubDate) || new Date().toISOString(),
            tags: asArray(item.category)
              .map((c) => stripTags(textOf(c)))
              .filter(Boolean)
              .slice(0, 3),
            draft: false,
            source: 'hashnode',
            canonicalUrl: link,
          },
        });

        // Runs the same markdown pipeline as a local file: Shiki highlighting,
        // the reading-time plugin, the table-wrapping plugin, and headings for
        // the table of contents.
        const rendered = await renderMarkdown(markdown);

        store.set({ id, data, rendered, digest: generateDigest(markdown) });
      }

      logger.info(`Loaded ${store.keys().length} post(s)`);
    },
  };
}
