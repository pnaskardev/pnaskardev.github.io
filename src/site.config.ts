/**
 * Single source of truth for everything that isn't a blog post.
 * Edit this file to change the site's content. No component edits needed.
 */

export const site = {
  name: 'Priyanshu Naskar',
  /** Shown in the browser tab and as the wordmark in the nav. */
  handle: 'pnaskar',
  url: 'https://pnaskardev.github.io',
  /** Used for <meta name="description"> and the RSS feed description. */
  description:
    'Developer. Writing about the systems I build and the ones I take apart.',

  email: 'pnaskardev@gmail.com',

  /**
   * Hashnode publication that supplies the blog. Posts are fetched from its
   * RSS feed at build time; nothing is copied into this repo.
   */
  hashnodeHost: 'priyanshucodes.hashnode.dev',

  /** One or two lines. This is the hero headline, so keep it short. */
  headline: 'I build backends that stay boring under load.',

  /** Max 20 words. Sits under the headline. */
  intro:
    'Currently working on distributed systems and developer tooling. I write about what breaks and why.',

  /**
   * TODO(you): replace with your own image. Drop a 4:5 portrait or workspace
   * shot at public/portrait.jpg and change src to '/portrait.jpg'.
   * Set the whole field to null to render the hero without an image.
   */
  portrait: {
    src: 'https://picsum.photos/seed/pnaskar-portrait/1200/1500',
    alt: 'Priyanshu Naskar',
  } as { src: string; alt: string } | null,
};

export type SocialLink = {
  label: string;
  href: string;
  /** Iconify name from @iconify-json/ph (Phosphor). */
  icon: string;
};

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/pnaskardev', icon: 'ph:github-logo' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/priyanshu-naskar-a679991b7',
    icon: 'ph:linkedin-logo',
  },
  { label: 'X', href: 'https://x.com/PriyanshuNaska9', icon: 'ph:x-logo' },
];

export type Project = {
  title: string;
  /** One line. What it is, not why it's great. */
  blurb: string;
  year: string;
  /** Shown as small mono tags under the blurb. Keep to 3. */
  stack: string[];
  href: string;
  /**
   * Preview shown on hover at >=1024px. Recommended 1200x800 (3:2).
   * Currently unused: the home page renders WorkGrid, which is text only.
   * To bring previews back, drop real files in public/work/, uncomment the
   * image entries below, and swap WorkGrid for WorkList in src/pages/index.astro.
   */
  image?: { src: string; alt: string };
};

/*
 * TODO(you): replace all four with real projects. Order is the display order.
 *
 * The commented image entries are the restore path for hover previews. Drop
 * 1200x800 files in public/work/, uncomment, and swap WorkGrid for WorkList
 * in src/pages/index.astro.
 */
export const projects: Project[] = [
  {
    title: 'Project one',
    blurb: 'One sentence on what it does and who it is for.',
    year: '2026',
    stack: ['Go', 'Postgres', 'NATS'],
    href: 'https://github.com/pnaskardev',
    // image: { src: '/work/project-one.jpg', alt: 'Project one interface' },
  },
  {
    title: 'Project two',
    blurb: 'One sentence on what it does and who it is for.',
    year: '2025',
    stack: ['TypeScript', 'Redis', 'Fly.io'],
    href: 'https://github.com/pnaskardev',
    // image: { src: '/work/project-two.jpg', alt: 'Project two interface' },
  },
  {
    title: 'Project three',
    blurb: 'One sentence on what it does and who it is for.',
    year: '2025',
    stack: ['Rust', 'WASM'],
    href: 'https://github.com/pnaskardev',
    // image: { src: '/work/project-three.jpg', alt: 'Project three interface' },
  },
  {
    title: 'Project four',
    blurb: 'One sentence on what it does and who it is for.',
    year: '2024',
    stack: ['Python', 'DuckDB'],
    href: 'https://github.com/pnaskardev',
    // image: { src: '/work/project-four.jpg', alt: 'Project four interface' },
  },
];

/**
 * The "Now" section. Three groups, a few items each.
 * Grouped chunks on purpose: a flat 15-row skill list is the lazy layout.
 */
export const now: { heading: string; items: string[] }[] = [
  {
    heading: 'Building',
    items: ['Event-driven services in Go', 'Internal developer tooling'],
  },
  {
    heading: 'Learning',
    items: ['Distributed consensus', 'Query planner internals'],
  },
  {
    heading: 'Reading',
    items: ['Designing Data-Intensive Applications', 'Papers on stream processing'],
  },
];

/**
 * How many recent posts to surface on the home page. The home page leads with
 * writing, so this is a list rather than a teaser. It is capped rather than
 * unbounded so a long archive cannot push Now and Contact off the page.
 */
export const HOME_POST_COUNT = 10;
