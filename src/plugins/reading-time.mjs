/**
 * Estimates reading time and exposes it on `remarkPluginFrontmatter`.
 * 220 wpm is the middle of the usual 200-250 range for technical prose.
 */
const WORDS_PER_MINUTE = 220;

function collectText(node, out) {
  // Code blocks are skipped: nobody reads them at prose speed.
  if (node.type === 'code') return;

  if (node.type === 'text' || node.type === 'inlineCode') {
    out.push(node.value);
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) collectText(child, out);
  }
}

export function remarkReadingTime() {
  return (tree, file) => {
    const parts = [];
    collectText(tree, parts);

    const words = parts.join(' ').split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

    file.data.astro.frontmatter.readingTime = `${minutes} min read`;
  };
}
