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
| How many posts the home page lists | `HOME_POST_COUNT` in `src/site.config.ts` |
| The "Now" section | `now` in `src/site.config.ts` |
| Social links | `socials` in `src/site.config.ts` |
| Blog posts | **Hashnode** — write there, they appear here |
| Which Hashnode blog to pull from | `hashnodeHost` in `src/site.config.ts` |
| Colors, type, spacing | the `@theme` block in `src/styles/global.css` |

Nothing on the home page is hardcoded in a component. Change
`src/site.config.ts` and the page follows.

## Home page order

The site is blog-first. The home page runs hero, then **Writing**, then a
compact **Selected work** list, then Now and Contact. Writing sits directly
under the hero because the posts are the point; work is a short supporting list
rather than a gallery.

## Writing a post

Posts are **not stored in this repo**. Hashnode is the CMS; this site is the
renderer. Write and publish on Hashnode and the post shows up here on the next
build.

The feed is fetched by `src/loaders/hashnode.ts`, a custom Astro content
loader. Remote posts go through the same markdown pipeline as a local file
would: Shiki highlighting, reading-time estimate, table wrapping, and headings
collected for the sidebar table of contents.

Each post keeps its Hashnode URL as its `canonicalUrl`, so search engines
credit the original and the page shows an "Originally published on Hashnode"
line.

**What this costs, so it is not a surprise later:**

- The build makes a network call. If Hashnode is down or rate limiting, the
  build **fails** rather than quietly shipping a site with posts missing. That
  is deliberate: a green deploy that dropped your archive is worse.
- Publishing on Hashnode does not update the site by itself. The deploy
  workflow runs daily at 06:00 UTC to pick up new posts. To publish
  immediately, run the workflow manually from the Actions tab.
- Hashnode's RSS returns the **20 most recent posts**. Older ones will not
  appear. Hashnode's GraphQL API would go further but has required a Pro plan
  since 2026-05-13, reads included.
- Images stay on Hashnode's CDN and are hotlinked.

To point at a different publication, change `hashnodeHost` in
`src/site.config.ts`.

## Images

Placeholders currently point at `picsum.photos` so the layout renders before
real assets exist. Replace them:

- **Portrait** - add `public/portrait.jpg` (4:5, around 1200x1500) and set
  `site.portrait.src` to `/portrait.jpg`. Set `site.portrait` to `null` to drop
  the hero image entirely.

**Project previews are currently off.** The work list is text only, so no
project images ship. To turn previews back on:

1. Add files to `public/work/` (3:2, around 1200x800).
2. Uncomment the `image` entries in `projects` in `src/site.config.ts`.
3. In `src/pages/index.astro`, swap `WorkGrid` back to `WorkList`.

`src/components/WorkList.astro` is the original hover-preview layout, kept intact
for exactly this.

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
