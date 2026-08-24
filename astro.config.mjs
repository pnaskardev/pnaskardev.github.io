import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';

import { remarkReadingTime } from './src/plugins/reading-time.mjs';
import { rehypeWrapTables } from './src/plugins/wrap-tables.mjs';

// User/org GitHub Pages site: served from the domain root, so no `base` needed.
export default defineConfig({
  site: 'https://pnaskardev.github.io',
  integrations: [mdx(), sitemap(), icon()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkReadingTime],
      rehypePlugins: [rehypeWrapTables],
    }),
    shikiConfig: { theme: 'vitesse-dark', wrap: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
