import TurndownService from 'turndown';

/**
 * Feed HTML to markdown.
 *
 * Kept separate from the loader so the conversion rules can be reasoned about
 * (and fixed) on their own. Every rule here exists because a real feed needed
 * it, not defensively.
 */

export const decodeEntities = (text: string): string =>
  String(text)
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)))
    // Ampersand last, so &amp;lt; does not become a real "<".
    .replace(/&amp;/g, '&');

export const stripTags = (html: string): string =>
  decodeEntities(String(html).replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();

function makeTurndown(): TurndownService {
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
    replacement: (content, node) => {
      const el = node as unknown as Element;
      const img = el.querySelector?.('img');
      const caption = el.querySelector?.('figcaption');
      if (!img) return content;
      const src = img.getAttribute('src') ?? '';
      const alt = img.getAttribute('alt') ?? '';
      const text = caption ? stripTags(caption.innerHTML ?? '') : '';
      return `\n\n![${alt}](${src})${text ? `\n_${text}_` : ''}\n\n`;
    },
  });

  /*
   * Code blocks. Hashnode emits <pre><code class="language-x">, but Medium does
   * NOT use <code> at all: it marks code up as <pre> containing <strong>, <em>
   * and <br> for syntax highlighting. Verified against a live feed -- 0 of 27
   * <pre> elements had a <code> child.
   *
   * Turndown's default would turn that into bold-and-italic prose
   * (`**class** Form **extends** ...`), so both shapes are handled here and the
   * inline formatting is stripped back to plain text.
   */
  td.addRule('fencedCode', {
    filter: 'pre',
    replacement: (_content, node) => {
      const el = node as unknown as Element;
      const firstChild = el.firstChild as Element | null;
      const code = firstChild?.nodeName === 'CODE' ? firstChild : null;
      const target = code ?? el;
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
 * Posts routinely come through using only h3 or only h4. That breaks two
 * things: the page already renders the title as h1 so the outline skips
 * levels, and the table of contents only collects h2s and would never appear.
 *
 * Headings inside fenced code are left alone -- a leading # there is a shell
 * comment, not a heading.
 */
function normaliseHeadings(markdown: string): string {
  const parts = markdown.split(/(```[\s\S]*?```)/g);
  const isFence = (part: string) => part.startsWith('```');

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
      return part.replace(/^(#{1,6})(\s+)/gm, (_match, hashes: string, space: string) => {
        const level = Math.min(6, Math.max(1, hashes.length + shift));
        return `${'#'.repeat(level)}${space}`;
      });
    })
    .join('');
}

/**
 * Repair Obsidian embed syntax that was pasted into a post and never rendered.
 *
 * `![[IMG-123.png]](https://cdn... align="center")` is not markdown Hashnode
 * understands, so it publishes the whole thing as literal text with the URL
 * auto-linked -- no <img> ever exists. Turndown then faithfully carries the
 * garbage through. Rewriting to a real <img> before conversion is the only
 * point where the URL is still cleanly extractable.
 *
 * ponytail: shim for broken source. The durable fix is correcting the markdown
 * in the Hashnode editor; delete this once no post needs it.
 */
const OBSIDIAN_EMBED =
  /!\[\[[^\]]*\]\]\(\s*(?:<a[^>]*href="([^"]+)"[^>]*>.*?<\/a>|(https?:\/\/[^\s<)]+))[^)]*\)/gis;

const repairObsidianEmbeds = (html: string): string =>
  html.replace(OBSIDIAN_EMBED, (_m, linked: string, bare: string) => {
    const src = linked || bare;
    return src ? `<img src="${src}" alt="" />` : _m;
  });

/** Feed HTML in, clean markdown out. */
export function htmlToMarkdown(html: string): string {
  const markdown = makeTurndown()
    .turndown(repairObsidianEmbeds(html))
    // Medium splits one logical code block across several consecutive <pre>
    // elements, which would otherwise become a run of tiny fences. Merge a
    // closing fence that is immediately followed by an opening one.
    .replace(/```\n\n```[a-zA-Z0-9+#-]*\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return normaliseHeadings(markdown);
}
