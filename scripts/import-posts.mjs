/**
 * Import posts from an RSS feed into src/content/blog/ as markdown.
 *
 *   node scripts/import-posts.mjs --medium PriyanshuNaskar
 *   node scripts/import-posts.mjs --hashnode yourblog.hashnode.dev
 *   node scripts/import-posts.mjs --feed https://example.com/rss.xml --source medium
 *   node scripts/import-posts.mjs --medium you --dry
 *
 * Everything imports as `draft: true`. HTML-to-markdown conversion is never
 * perfect, so nothing goes live until you have read it and flipped the flag.
 *
 * Existing files are never overwritten. Re-running only picks up posts you do
 * not already have, so editing an imported post is safe.
 *
 * Feed limits are the platform's, not ours: Medium returns the 10 most recent
 * posts and Hashnode 20. Anything older needs the platform's own export.
 */

import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';

const ROOT = path.resolve(import.meta.dirname, '..');
const POSTS_DIR = path.join(ROOT, 'src/content/blog');
const IMAGE_ROOT = path.join(ROOT, 'public/blog');

/* ---------------------------------------------------------------- args --- */

function parseArgs(argv) {
  const args = { dry: false, feeds: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];

    if (flag === '--dry') {
      args.dry = true;
    } else if (flag === '--medium') {
      const handle = String(value).replace(/^@/, '');
      args.feeds.push({ url: `https://medium.com/feed/@${handle}`, source: 'medium' });
      i += 1;
    } else if (flag === '--hashnode') {
      const host = String(value).replace(/^https?:\/\//, '').replace(/\/$/, '');
      args.feeds.push({ url: `https://${host}/rss.xml`, source: 'hashnode' });
      i += 1;
    } else if (flag === '--feed') {
      args.feedUrl = value;
      i += 1;
    } else if (flag === '--source') {
      args.source = value;
      i += 1;
    } else {
      throw new Error(`Unknown flag: ${flag}`);
    }
  }

  if (args.feedUrl) {
    if (!args.source) throw new Error('--feed also needs --source (medium, hashnode, or linkedin)');
    args.feeds.push({ url: args.feedUrl, source: args.source });
  }

  if (args.feeds.length === 0) {
    throw new Error('Nothing to import. Pass --medium <handle>, --hashnode <host>, or --feed <url> --source <name>.');
  }

  return args;
}

/* --------------------------------------------------------------- utils --- */

function slugify(text) {
  const full = String(text)
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

/** YAML-safe single-quoted scalar. */
const yamlString = (value) => `'${String(value).replace(/'/g, "''")}'`;

const decodeEntities = (text) =>
  String(text)
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)))
    // Ampersand last, so &amp;lt; does not become a real "<".
    .replace(/&amp;/g, '&');

const stripTags = (html) =>
  decodeEntities(String(html).replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();

/** Trim to a whole word, so descriptions never end mid-token. */
function truncate(text, max = 180) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:!?-]+$/, '')}...`;
}

/** RSS values arrive as string, number, or {'#text': ...} depending on CDATA. */
function textOf(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object' && '#text' in value) return String(value['#text']);
  return String(value);
}

const asArray = (value) => (value == null ? [] : Array.isArray(value) ? value : [value]);

/* ------------------------------------------------------------- markdown --- */

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '_',
  });

  // Medium wraps images in <figure><img><figcaption>. Turndown's default drops
  // the caption; keep it as italic text under the image.
  td.addRule('figure', {
    filter: 'figure',
    replacement: (_content, node) => {
      const img = node.querySelector?.('img');
      const caption = node.querySelector?.('figcaption');
      if (!img) return _content;
      const src = img.getAttribute('src') ?? '';
      const alt = img.getAttribute('alt') ?? '';
      const text = caption ? stripTags(caption.innerHTML ?? '') : '';
      return `\n\n![${alt}](${src})${text ? `\n_${text}_` : ''}\n\n`;
    },
  });

  /*
   * Code blocks. Hashnode emits <pre><code class="language-x">, but Medium
   * does NOT use <code> at all: it marks up code as <pre> containing <strong>,
   * <em>, and <br> for syntax highlighting. Verified against a live feed —
   * 0 of 27 <pre> elements had a <code> child.
   *
   * Turndown's default would turn that into bold-and-italic prose
   * (`**class** Form **extends** ...`), so both shapes are handled here and
   * the inline formatting is stripped back to plain text.
   */
  td.addRule('fencedCode', {
    filter: 'pre',
    replacement: (_content, node) => {
      const code = node.firstChild?.nodeName === 'CODE' ? node.firstChild : null;
      const target = code ?? node;
      const className = target.getAttribute?.('class') ?? '';
      const lang = /language-([\w+-]+)/.exec(className)?.[1] ?? '';

      const body = decodeEntities(
        String(target.innerHTML ?? '')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
          .replace(/<[^>]+>/g, ''),
      ).replace(/\s+$/, '');

      return `\n\n\`\`\`${lang}\n${body}\n\`\`\`\n\n`;
    },
  });

  return td;
}

/**
 * Shift headings so the shallowest one in the post becomes h2.
 *
 * Both platforms let you start a post at any level, and in practice posts come
 * through using only h3 or only h4. That breaks two things: the page already
 * renders the title as h1 so the outline skips levels, and the table of
 * contents only collects h2s and would never appear.
 *
 * Headings inside fenced code are left alone -- a leading # there is a shell
 * comment, not a heading.
 */
function normaliseHeadings(markdown) {
  const parts = markdown.split(/(```[\s\S]*?```)/g);
  const isFence = (part) => part.startsWith('```');

  let min = 7;
  for (const part of parts) {
    if (isFence(part)) continue;
    for (const [, hashes] of part.matchAll(/^(#{1,6})\s+\S/gm)) {
      min = Math.min(min, hashes.length);
    }
  }

  if (min > 6 || min === 2) return markdown;
  const shift = 2 - min;

  return parts
    .map((part) => {
      if (isFence(part)) return part;
      return part.replace(/^(#{1,6})(\s+)/gm, (match, hashes, space) => {
        const level = Math.min(6, Math.max(1, hashes.length + shift));
        return `${'#'.repeat(level)}${space}`;
      });
    })
    .join('');
}

/* --------------------------------------------------------------- images --- */

/**
 * Pull remote images local so the post survives the platform deleting them.
 * A failed download is a warning, not a fatal error: the post still imports
 * with the remote URL intact.
 */
async function localiseImages(markdown, slug, { dry }) {
  const urls = [...markdown.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]);
  const unique = [...new Set(urls)];
  if (unique.length === 0) return { markdown, downloaded: 0, failed: 0 };

  const dir = path.join(IMAGE_ROOT, slug);
  if (!dry) await mkdir(dir, { recursive: true });

  let out = markdown;
  let downloaded = 0;
  let failed = 0;

  for (const [index, url] of unique.entries()) {
    const cleanUrl = url.split('?')[0];
    const ext = (/\.(jpe?g|png|gif|webp|avif|svg)$/i.exec(cleanUrl)?.[1] ?? 'jpg').toLowerCase();
    const filename = `${String(index + 1).padStart(2, '0')}.${ext}`;
    const publicPath = `/blog/${slug}/${filename}`;

    if (dry) {
      out = out.replaceAll(url, publicPath);
      downloaded += 1;
      continue;
    }

    try {
      const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      await writeFile(path.join(dir, filename), buffer);
      out = out.replaceAll(url, publicPath);
      downloaded += 1;
    } catch (error) {
      failed += 1;
      console.warn(`    ! image failed, keeping remote URL: ${error.message}`);
      console.warn(`      ${url}`);
    }
  }

  return { markdown: out, downloaded, failed };
}

/* ----------------------------------------------------------------- feed --- */

async function fetchFeed(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0', accept: 'application/rss+xml, application/xml, text/xml' } });

  if (res.status === 429) {
    throw new Error(`rate limited (429). Wait a minute and re-run: ${url}`);
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }

  const body = await res.text();
  if (!body.includes('<item')) {
    throw new Error(`no <item> elements in the response from ${url} — check the handle or host`);
  }
  return body;
}

function parseItems(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    // Keep CDATA inline with the element's text rather than nesting it.
    processEntities: true,
    trimValues: true,
  });
  const doc = parser.parse(xml);
  return asArray(doc?.rss?.channel?.item);
}

/* ---------------------------------------------------------------- write --- */

function frontmatter(fields) {
  const lines = ['---'];
  lines.push(`title: ${yamlString(fields.title)}`);
  lines.push(`description: ${yamlString(fields.description)}`);
  lines.push(`pubDate: ${fields.pubDate}`);
  if (fields.tags.length > 0) {
    lines.push(`tags: [${fields.tags.map(yamlString).join(', ')}]`);
  }
  lines.push(`source: ${fields.source}`);
  lines.push(`canonicalUrl: ${yamlString(fields.canonicalUrl)}`);
  lines.push('# Imported. Read it through, fix the conversion, then set draft: false.');
  lines.push('draft: true');
  lines.push('---');
  return lines.join('\n');
}

async function importFeed({ url, source }, { dry, existingSlugs }) {
  console.log(`\n${source} — ${url}`);

  const xml = await fetchFeed(url);
  const items = parseItems(xml);
  console.log(`  ${items.length} item(s) in feed`);

  const td = makeTurndown();
  let written = 0;
  let skipped = 0;

  for (const item of items) {
    const title = stripTags(textOf(item.title));
    const link = textOf(item.link).split('?')[0];
    if (!title || !link) {
      console.warn('  ! item missing title or link, skipped');
      continue;
    }

    let slug = slugify(title);
    if (!slug) slug = slugify(link.split('/').pop() ?? 'post');

    // Never clobber. An existing file means you have already imported and
    // probably edited this one.
    if (existingSlugs.has(slug)) {
      console.log(`  = ${slug} (already present, skipped)`);
      skipped += 1;
      continue;
    }

    const html = textOf(item['content:encoded']) || textOf(item.description);
    if (!html) {
      console.warn(`  ! ${slug}: no content in feed, skipped`);
      continue;
    }

    let markdown = td
      .turndown(html)
      // Medium splits one logical code block across several consecutive <pre>
      // elements, which would otherwise become a run of tiny fences. Merge a
      // closing fence that is immediately followed by an opening one.
      .replace(/```\n\n```[a-zA-Z0-9+#-]*\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    markdown = normaliseHeadings(markdown);

    const images = await localiseImages(markdown, slug, { dry });
    markdown = images.markdown;

    const rssDescription = stripTags(textOf(item.description));
    const description = truncate(
      rssDescription && rssDescription.length > 30
        ? rssDescription
        : stripTags(html),
    );

    const pubDate = new Date(textOf(item.pubDate) || Date.now())
      .toISOString()
      .slice(0, 10);

    const tags = asArray(item.category)
      .map((c) => stripTags(textOf(c)))
      .filter(Boolean)
      .slice(0, 3);

    const file = path.join(POSTS_DIR, `${slug}.md`);
    const contents = `${frontmatter({ title, description, pubDate, tags, source, canonicalUrl: link })}\n\n${markdown}\n`;

    if (dry) {
      console.log(`  + ${slug}.md (dry run, ${markdown.length} chars, ${images.downloaded} image(s))`);
    } else {
      await writeFile(file, contents, 'utf8');
      console.log(`  + ${slug}.md (${markdown.length} chars, ${images.downloaded} image(s)${images.failed ? `, ${images.failed} failed` : ''})`);
    }

    existingSlugs.add(slug);
    written += 1;
  }

  return { written, skipped };
}

/* ----------------------------------------------------------------- main --- */

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!existsSync(POSTS_DIR)) {
    throw new Error(`Posts directory not found: ${POSTS_DIR}`);
  }

  const existingSlugs = new Set(
    (await readdir(POSTS_DIR))
      .filter((name) => /\.(md|mdx)$/.test(name))
      .map((name) => name.replace(/\.(md|mdx)$/, '')),
  );

  console.log(`${existingSlugs.size} post(s) already in src/content/blog/`);
  if (args.dry) console.log('DRY RUN — nothing will be written');

  let written = 0;
  let skipped = 0;
  let failedFeeds = 0;

  for (const feed of args.feeds) {
    try {
      const result = await importFeed(feed, { dry: args.dry, existingSlugs });
      written += result.written;
      skipped += result.skipped;
    } catch (error) {
      failedFeeds += 1;
      console.error(`  x ${error.message}`);
    }
  }

  console.log(`\n${written} imported, ${skipped} already present${failedFeeds ? `, ${failedFeeds} feed(s) failed` : ''}`);

  if (written > 0 && !args.dry) {
    console.log('\nAll imports are draft: true. Read each one, fix the markdown,');
    console.log('then set draft: false to publish it.');
  }

  // A failed feed is a real failure; make CI and the shell notice.
  if (failedFeeds > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
});
