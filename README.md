# pnaskardev.github.io

Personal site and blog. Astro, static output, deployed to GitHub Pages.

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built output
npm run check    # type-check .astro and .ts files
```

## Editing content

| What | Where |
| --- | --- |
| Name, headline, intro, email, portrait | `src/site.config.ts` |
| Projects in "Selected work" | `projects` in `src/site.config.ts` |
| The "Now" section | `now` in `src/site.config.ts` |
| Social links | `socials` in `src/site.config.ts` |
| Blog posts | `src/content/blog/*.md` |
| Colors, type, spacing | the `@theme` block in `src/styles/global.css` |

Nothing on the home page is hardcoded in a component. Change
`src/site.config.ts` and the page follows.

## Writing a post

Create `src/content/blog/my-post.md`. The filename becomes the URL
(`/blog/my-post/`).

```markdown
---
title: 'How the scheduler drifts'
description: 'One or two sentences. Shown on the index and in link previews.'
pubDate: 2026-09-01
tags: ['go', 'scheduling']
draft: false
---

Post body here.
```

`title`, `description`, and `pubDate` are required and validated at build time,
so a typo fails the build rather than shipping a broken page. Set `draft: true`
to keep a post out of the index, the home page, and the RSS feed while still
previewing it locally.

Posts get a reading-time estimate automatically, and a table of contents
appears in the sidebar once a post has three or more `##` headings.

`.mdx` files work too if you need components inside a post.

## Images

Placeholders currently point at `picsum.photos` so the layout renders before
real assets exist. Replace them:

- **Portrait** - add `public/portrait.jpg` (4:5, around 1200x1500) and set
  `site.portrait.src` to `/portrait.jpg`. Set `site.portrait` to `null` to drop
  the hero image entirely.
- **Project previews** - add files to `public/work/` (3:2, around 1200x800) and
  point each project's `image.src` at `/work/name.jpg`.

The social share card lives at `public/og.png`. Its source is
`scripts/og.html`; the regeneration command is in a comment at the top of that
file.

## Deploying

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.

One-time setup: **Settings → Pages → Build and deployment → Source →
GitHub Actions**.

## Design notes

Single locked dark theme, one accent (amber `#e9a23b`), one 4px corner radius
throughout. Every text color is checked against the background at WCAG AA for
small text.

Motion is a single scroll-reveal cascade driven by `IntersectionObserver`, and
it collapses to static under `prefers-reduced-motion`. If JavaScript never
runs, all content is still visible.
