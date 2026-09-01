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

  /** Served straight from public/. Replace the file to update it. */
  resume: '/resume.pdf',

  /**
   * Hashnode publication that supplies the blog. Posts are fetched from its
   * RSS feed at build time; nothing is copied into this repo.
   */
  hashnodeHost: 'priyanshucodes.hashnode.dev',

  /** One or two lines. This is the hero headline, so keep it short. */
  headline: 'I build backends where partial failure is the normal case.',

  /** Two or three sentences. Sits under the headline. */
  intro:
    'Software engineer at Kazam EV Tech in Bengaluru, working on Unified Bharat Charging: cross-network EV charging interoperability at national scale, and the payment and reconciliation layer underneath it. I ship things that keep working once the traffic and the failure modes show up. Then I write down what broke.',

  /**
   * TODO(you): drop a 4:5 portrait or workspace shot at public/portrait.jpg
   * and set this to { src: '/portrait.jpg', alt: 'Priyanshu Naskar' }.
   *
   * null until then: this was a picsum.photos placeholder, and picsum started
   * returning 503/522 on 2026-08-31, so it rendered as a broken-image box.
   * A remote placeholder is a third-party dependency on the hero -- the real
   * file belongs in public/ where nothing can take it down.
   */
  portrait: null as { src: string; alt: string } | null,
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

/** Most recent first. Interns and earlier roles can be appended later. */
export const experience = [
  {
    company: 'Kazam EV Tech',
    role: 'Software Development Engineer',
    period: '2024 — now',
    location: 'Bengaluru',
    summary:
      'Build and run a Go interoperability platform for Unified Bharat Charging, unifying 3,420+ EV chargers across HPCL and BPCL and processing 20,500 daily transactions. Built the webhook-driven, idempotent order and payment lifecycle, and the multi-tenant OEM-Tool now serving 1,200+ vendors across 20+ tenants.',
  },
  {
    company: 'Alemeno',
    role: 'Software Development Engineer',
    period: '2024',
    location: 'Remote',
    summary:
      'Backend for an edtech platform serving 400,000+ students on Django REST, with Celery for async processing and rolling multi-node deploys. Cut API response times 65% on high-traffic endpoints with a Redis caching layer, without touching the schema.',
  },
];

/** What I actually work on. Four is the ceiling; more reads as a skills dump. */
export const focus = [
  {
    heading: 'Distributed systems',
    body: 'Idempotency keys, webhook-driven lifecycles, state-machine reconciliation, and recovery from partial failure. The interesting part is always what happens on the retry.',
  },
  {
    heading: 'Payments and ledgers',
    body: 'Order and payment lifecycles at 20,000+ daily transactions, automated ledger reconciliation, and refund and cancellation flows that remove manual settlement work.',
  },
  {
    heading: 'Multi-tenant platforms',
    body: 'Custom multi-tenancy and RBAC with isolated data boundaries, serving 1,200+ vendors and technicians across 20+ OEM tenants.',
  },
  {
    heading: 'Backend and APIs',
    body: 'Go and Django REST, gRPC, WebSockets, Celery for async work, Redis for caching. Postgres and MongoDB underneath, on AWS.',
  },
];

/**
 * Grouped so the list reads as a stack, not a keyword dump. Groups mirror the
 * resume; keep them in the same order so the two never disagree.
 *
 * Icons are `simple-icons` brand marks, which are monochrome and so inherit
 * currentColor -- the palette stays locked. Things with no brand mark (SQL,
 * REST, gRPC, WebSockets, Beckn) fall back to a Phosphor glyph rather than
 * being dropped or left blank, so every row has an even rhythm.
 */
export const skills = [
  {
    group: 'Languages',
    items: [
      { name: 'Go', icon: 'simple-icons:go' },
      { name: 'Python', icon: 'simple-icons:python' },
      { name: 'TypeScript', icon: 'simple-icons:typescript' },
      { name: 'JavaScript', icon: 'simple-icons:javascript' },
      { name: 'SQL', icon: 'ph:database' },
    ],
  },
  {
    group: 'Backend',
    items: [
      { name: 'Django', icon: 'simple-icons:django' },
      { name: 'Django REST', icon: 'simple-icons:django' },
      { name: 'Celery', icon: 'simple-icons:celery' },
      { name: 'GoFiber', icon: 'simple-icons:go' },
      { name: 'Express', icon: 'simple-icons:express' },
    ],
  },
  {
    group: 'Data',
    items: [
      { name: 'PostgreSQL', icon: 'simple-icons:postgresql' },
      { name: 'MongoDB', icon: 'simple-icons:mongodb' },
      { name: 'Redis', icon: 'simple-icons:redis' },
      { name: 'Kafka', icon: 'simple-icons:apachekafka' },
      { name: 'Elasticsearch', icon: 'simple-icons:elasticsearch' },
    ],
  },
  {
    group: 'Infrastructure',
    items: [
      { name: 'Docker', icon: 'simple-icons:docker' },
      { name: 'AWS', icon: 'simple-icons:amazonwebservices' },
      { name: 'GitHub Actions', icon: 'simple-icons:githubactions' },
      { name: 'Nginx', icon: 'simple-icons:nginx' },
      { name: 'Prometheus', icon: 'simple-icons:prometheus' },
      { name: 'Grafana', icon: 'simple-icons:grafana' },
    ],
  },
  {
    group: 'APIs',
    items: [
      { name: 'REST', icon: 'ph:brackets-curly' },
      { name: 'gRPC', icon: 'ph:arrows-left-right' },
      { name: 'WebSockets', icon: 'ph:plugs-connected' },
      { name: 'Beckn', icon: 'ph:share-network' },
      { name: 'Swagger', icon: 'simple-icons:swagger' },
    ],
  },
];

/**
 * How many recent posts to surface on the home page. The home page leads with
 * writing, so this is a list rather than a teaser. It is capped rather than
 * unbounded so a long archive cannot push Now and Contact off the page.
 */
export const HOME_POST_COUNT = 10;
