export type Project = {
  index: string;
  title: string;
  year: string;
  role: string;
  tags: string[];
  accent: string;
  /** two hues for the floating preview's animated gradient */
  gradient: [string, string];
  description: string;
  href?: string;
  /** screenshot shown in the floating cursor preview */
  image?: string;
};

export const PROJECTS: Project[] = [
  {
    index: "001",
    title: "LUSSO VELOCE",
    year: "LIVE",
    role: "Design & Development",
    tags: ["Next.js", "Supabase", "Stripe"],
    accent: "#ffb454",
    gradient: ["#3a2705", "#ffb454"],
    description:
      "A luxury car rental platform with real inventory, booking data, availability, and Stripe payments. I designed and built the complete customer journey, from choosing a car to confirming a paid reservation.",
    href: "https://lusso-veloce.vercel.app",
    image: "/img/Screenshot 2026-07-02 223147.png",
  },
  {
    index: "002",
    title: "FLYBY",
    year: "IN PROGRESS",
    role: "Design & Development",
    tags: ["React Native", "Expo", "Mapbox"],
    accent: "#6ea8ff",
    gradient: ["#0a1c3d", "#6ea8ff"],
    description:
      "A web and mobile driving app where the map starts hidden and opens as you explore. It tracks live and top speed, city completion, destinations, and a global leaderboard across every drive.",
    href: "https://fly-by-rosy.vercel.app",
    image: "/img/Screenshot 2026-07-03 143349.png",
  },
  {
    index: "003",
    title: "TRADEBOT",
    year: "TESTING",
    role: "Engineering",
    tags: ["Python", "OANDA API", "Next.js"],
    accent: "#3fd2c7",
    gradient: ["#062c2a", "#3fd2c7"],
    description:
      "An automated trading system that reads live gold-market data, evaluates strategies, and makes its own long or short decisions. A Next.js dashboard makes every signal and trade visible while I test it.",
    href: "https://tradebot-beta.vercel.app",
    image: "/img/Screenshot 2026-07-03 135757.png",
  },
  {
    index: "004",
    title: "PROJECT GARAGE",
    year: "LIVE",
    role: "Design & Development",
    tags: ["Next.js", "Database", "Expense Tracking"],
    accent: "#ff5c28",
    gradient: ["#3d1206", "#ff5c28"],
    description:
      "The app I wanted for my own cars: every modification, service, and dollar in one place, with horsepower, speed, and ownership totals that evolve as each build does.",
    href: "https://project-garage-rose.vercel.app",
    image: "/img/Screenshot 2026-07-03 101118.png",
  },
];

export type MoreWorkItem = {
  title: string;
  detail: string;
  tools: string;
};

export const MORE_WORK: MoreWorkItem[] = [
  {
    title: "Four more 3D web worlds",
    detail: "Immersive sites built around particles, motion, depth, and interaction — each with its own visual language.",
    tools: "R3F / GLSL / GSAP",
  },
  {
    title: "Local business websites",
    detail: "Fast, practical sites for pizza shops, gyms, and other Hamilton-area businesses that need to work as well as they look.",
    tools: "NEXT.JS / WORDPRESS",
  },
  {
    title: "Finance planner",
    detail: "A personal finance tracker for turning everyday spending, budgets, and longer-term goals into one readable plan.",
    tools: "REACT / DATA VISUALIZATION",
  },
  {
    title: "Wishlist platform",
    detail: "A focused place to collect, organize, and share the things worth saving for later.",
    tools: "FULL-STACK WEB",
  },
];

export type SkillGroup = {
  label: string;
  note: string;
  items: string[];
};

export const SKILLS: SkillGroup[] = [
  {
    label: "LANGUAGE",
    note: "The grammar",
    items: ["TypeScript", "JavaScript", "Java", "Python", "C#", "Swift", "PHP", "SQL", "HTML / CSS"],
  },
  {
    label: "FRAMEWORK",
    note: "The skeleton",
    items: ["React", "Next.js", "Angular", "React Native", "Node", ".NET / ASP.NET", "Laravel", "TailwindCSS"],
  },
  {
    label: "DATA & CLOUD",
    note: "The engine room",
    items: ["MySQL", "Supabase", "Azure DevOps", "Vercel", "Stripe", "Mapbox"],
  },
  {
    label: "ALSO FLUENT IN",
    note: "The range",
    items: ["Unity", "WordPress", "Expo", "Git"],
  },
];

export type CareerEntry = {
  period: string;
  role: string;
  place: string;
  note: string;
};

export const CAREER: CareerEntry[] = [
  {
    period: "MAY 2026 — DEC 2026+",
    role: "Co-op Developer",
    place: "Ministry of Public & Business Service Delivery & Procurement (MPBSDP)",
    note: "Two consecutive co-op terms through at least December 2026, contributing inside a public-sector technology team and learning how software is built when reliability matters at scale.",
  },
  {
    period: "JAN 2025 — NOW",
    role: "Software Development",
    place: "Mohawk College — Program 559",
    note: "A hands-on software development program spanning web, mobile, databases, and application engineering. The coursework builds the foundation; my own products push it further.",
  },
  {
    period: "SEP 2023 — DEC 2024",
    role: "Computer Science",
    place: "Brock University",
    note: "Started in computer science, then chose a different route when I realized I wanted far more time writing software. That decision led me to Mohawk and a much more applied program.",
  },
  {
    period: "ALWAYS IN PROGRESS",
    role: "Independent Developer",
    place: "My own product backlog",
    note: "Maps, cars, finance, trading, local businesses, and four more 3D websites. I keep choosing projects with real moving parts because that is where I learn fastest.",
  },
];

export type Experiment = {
  index: string;
  title: string;
  medium: string;
  gradient: [string, string];
  href?: string;
  image?: string;
};

export const EXPERIMENTS: Experiment[] = [
  { index: "E—01", title: "SOFT", medium: "Design study — minimal Gen Z aesthetic", gradient: ["#1b0f3d", "#c9a2ff"], href: "https://soft-design.vercel.app/", image: "/img/Screenshot 2026-07-03 095957.png" },
  { index: "E—02", title: "NOIR", medium: "Design study — high-contrast cinema", gradient: ["#12122e", "#6ea8ff"], href: "https://mysterious-design.vercel.app/", image: "/img/Screenshot 2026-07-03 100331.png" },
  { index: "E—03", title: "CASUAL", medium: "Design study — approachable modern", gradient: ["#231a02", "#ffb454"], href: "https://casual-design-five.vercel.app/", image: "/img/Screenshot 2026-07-03 100054.png" },
  { index: "E—04", title: "FOG OF WAR", medium: "Mapbox exploration mask from FlyBy", gradient: ["#032622", "#3fd2c7"], image: "/img/Screenshot 2026-07-08 112150.png" },
  { index: "E—05", title: "BACKTEST RIG", medium: "Trading strategies, simulated overnight", gradient: ["#26043a", "#ff6ad5"], image: "/img/Screenshot 2026-07-08 112603.png" },
  { index: "E—06", title: "THE OBSERVATORY", medium: "This website — 16,000 particles deep", gradient: ["#2d0a02", "#ff5c28"], image: "/img/Screenshot 2026-07-08 112400.png" },

  /* ---- the 3D builds. Order here is the order along the wall, and the
     column pattern gives every other one a bigger plate — so THE HALL takes
     a wide slot and APEX the narrow one after it. Still no links: add `href`
     to any of these and the plate becomes a visit. ---- */
  { index: "E—07", title: "THE HALL", medium: "Portfolio as a walkable 3D museum", gradient: ["#150f07", "#d8b271"], image: "/img/lab-the-hall.webp" },
  { index: "E—08", title: "APEX", medium: "Portfolio at racing pace — 3D garage", gradient: ["#2a0604", "#ff5c28"], image: "/img/lab-apex.webp" },
  { index: "E—09", title: "OVERCLOCK", medium: "Cyber build — a 3D core in motion", gradient: ["#050b1e", "#6ea8ff"], image: "/img/lab-overclock.webp" },

  /* ---- still placeholders: no capture yet. PLACEHOLDER is in the visible
     caption on purpose, so neither can quietly ship as finished work. ---- */
  { index: "E—10", title: "MEADOW", medium: "Placeholder — 3D grass world you can walk", gradient: ["#0a1c08", "#8ede5a"] },
  { index: "E—11", title: "UNTITLED", medium: "Placeholder — next experiment", gradient: ["#15121d", "#9c96ff"] },
];

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Sirmira1" },
  { label: "LinkedIn", href: "https://linkedin.com/in/nikola-anastasijevic-a737632ba/" },
  { label: "Website", href: "https://www.nikolaanastasijevic.com" },
];

export const EMAIL = "nikolaanastasijevic0@gmail.com";

/* ------------------------------------------------------------------ */
/*  The other rooms — /off-work, /on-work, /store                      */
/* ------------------------------------------------------------------ */

/** Every page below the home page, in the order they appear in the footer. */
export const PAGES = [
  { href: "/", label: "Home", note: "The signature, the work, the lab" },
  { href: "/off-work", label: "Off Work", note: "Cars, mountains, everything else" },
  { href: "/on-work", label: "On Work", note: "What I actually do all day" },
  { href: "/store", label: "Store", note: "Opening soon" },
];

/**
 * The four things I am, in the order the page walks through them. `image` is
 * where a photo goes — until one is dropped in, the frame names the file it
 * wants, so nothing ships looking finished when it is not.
 */
export type Obsession = {
  key: string;
  label: string;
  lead: string;
  tags: string[];
  image: string;
  accent: string;
};

export const OBSESSIONS: Obsession[] = [
  {
    key: "cars",
    label: "CARS",
    lead: "American muscle, mostly. Corvettes and Hellcats — the loud, unreasonable end of the catalogue.",
    tags: ["Corvette", "Hellcat", "Build it yourself", "Drag", "Track"],
    image: "/img/off/cars.jpg",
    accent: "#ff5c28",
  },
  {
    key: "snowboarding",
    label: "SNOWBOARD",
    lead: "Winter has exactly one job, and this is it.",
    tags: ["Powder", "Park", "Every season"],
    image: "/img/off/snowboard.jpg",
    accent: "#6ea8ff",
  },
  {
    key: "camping",
    label: "CAMPING",
    lead: "A pack, a trail, and far enough out that the phone stops being useful.",
    tags: ["Backpacking", "Trails", "No signal"],
    image: "/img/off/camping.jpg",
    accent: "#8ede5a",
  },
  {
    key: "training",
    label: "TRAINING",
    lead: "Calisthenics. Your own bodyweight is the only equipment that never lets you skip a session.",
    tags: ["Calisthenics", "Rings", "Every day"],
    image: "/img/off/training.jpg",
    accent: "#3fd2c7",
  },
  {
    key: "photography",
    label: "PHOTO",
    lead: "Mostly cars. Occasionally something that holds still.",
    tags: ["Cars", "Landscape", "Long exposure"],
    image: "/img/off/photo.jpg",
    accent: "#c9a2ff",
  },
  {
    key: "gaming",
    label: "GAMING",
    lead: "Sim racing counts as practice. That is the position and I am sticking to it.",
    tags: ["Sim racing", "Co-op", "Late"],
    image: "/img/off/gaming.jpg",
    accent: "#ff6ad5",
  },
  {
    key: "sports",
    label: "SPORTS",
    lead: "Watch everything, play most of it, argue about all of it.",
    tags: ["Football", "Basketball", "Anything competitive"],
    image: "/img/off/sports.jpg",
    accent: "#ffb454",
  },
];

/** Everything I watch. Two wheels, four wheels, tarmac, dirt, quarter mile. */
export const RACING = [
  { series: "Formula 1", note: "Sunday, non-negotiable" },
  { series: "MotoGP", note: "Two wheels, no margin" },
  { series: "IndyCar", note: "Ovals and street circuits" },
  { series: "WEC", note: "Hypercars, all night" },
  { series: "GT3", note: "The best racing nobody watches" },
  { series: "Rally", note: "Gravel, snow, no run-off" },
  { series: "Drag", note: "Four seconds, then it is over" },
];

/** The garage side of it — not just watching. */
export const GARAGE = [
  { title: "Building", note: "Turning wrenches beats reading about turning wrenches." },
  { title: "American V8", note: "Corvettes and Hellcats. Displacement over subtlety." },
  { title: "Track days", note: "Where the build gets its report card." },
];

/**
 * The rest, in a grid. Short by design — nobody reads a wall of text about
 * somebody else's weekends.
 */
export const HOBBIES = [
  { title: "Snowboarding", note: "Winter has one job.", image: "/img/off/snowboard.jpg" },
  { title: "Camping", note: "Backpack, trail, no signal.", image: "/img/off/camping.jpg" },
  { title: "Calisthenics", note: "Bodyweight, every day.", image: "/img/off/calisthenics.jpg" },
  { title: "Photography", note: "Mostly cars. Occasionally not.", image: "/img/off/photo.jpg" },
  { title: "Gaming", note: "Sim racing counts as practice.", image: "/img/off/gaming.jpg" },
  { title: "Sports", note: "Watch everything, play most of it.", image: "/img/off/sports.jpg" },
];

/**
 * The hand of cards at the bottom. Fill in the two marked TODO before this
 * goes live — they point nowhere until you do.
 */
export const SOCIAL_CARDS = [
  { label: "Instagram", handle: "@TODO", href: "#", tint: "#ff6ad5", todo: true },
  { label: "Spotify", handle: "TODO", href: "#", tint: "#3fd2c7", todo: true },
  { label: "GitHub", handle: "Sirmira1", href: "https://github.com/Sirmira1", tint: "#ece7df" },
  {
    label: "LinkedIn",
    handle: "nikola-anastasijevic",
    href: "https://linkedin.com/in/nikola-anastasijevic-a737632ba/",
    tint: "#6ea8ff",
  },
  { label: "Email", handle: EMAIL, href: `mailto:${EMAIL}`, tint: "#ff5c28" },
];

/**
 * /on-work — what the job actually is. Ordered to match the capability
 * silhouettes in SHAPES, because the cycle walks both lists together.
 */
export const CAPABILITIES = [
  {
    key: "stack",
    label: "FULL STACK",
    lead: "Interface to database to deployment. One person, the whole path, which is why the seams line up.",
    accent: "#6ea8ff",
    items: ["React / Next.js", "TypeScript", "Node", ".NET / Laravel", "MySQL / Supabase"],
  },
  {
    key: "design",
    label: "DESIGN",
    lead: "I draw it before I build it. A product that works and looks like an afterthought is still an afterthought.",
    accent: "#c9a2ff",
    items: ["Interface design", "Motion", "3D / WebGL", "Design systems"],
  },
  {
    key: "apps",
    label: "APPS",
    lead: "Mobile and web, shipped to real people with real accounts and real money moving through them.",
    accent: "#3fd2c7",
    items: ["React Native", "Swift", "Payments", "Auth"],
  },
  {
    key: "ai",
    label: "AI",
    lead: "Using it daily and building with it — models wired into products, not demos.",
    accent: "#ff6ad5",
    items: ["LLM features", "Agents / tooling", "Prompt + eval work"],
  },
  {
    key: "learning",
    label: "LEARNING",
    lead: "Every project picks a thing I cannot do yet. That is the point of the project.",
    accent: "#ffb454",
    items: ["New stacks", "New languages", "Whatever the build needs"],
  },
];

/**
 * /store — the shelf.
 *
 * Nothing here is buyable yet, and every card says so, so a visitor is never
 * misled. To open the store: give an item a `price` and a `href` pointing at
 * wherever the checkout lives, and drop its photo at the path in `image`.
 * The card switches itself over — there is no other flag to flip.
 */
export type StoreItem = {
  key: string;
  name: string;
  blurb: string;
  /** what it is, in one word, for the card's corner */
  kind: string;
  image: string;
  /** set both of these and the card goes live */
  price?: string;
  href?: string;
};

export const STORE_ITEMS: StoreItem[] = [
  {
    key: "print",
    name: "Prints",
    blurb:
      "Cars, mostly, shot on the days the light was worth the drive. Printed large enough to be the reason you look at that wall.",
    kind: "Photography",
    image: "/img/store/print.jpg",
  },
  {
    key: "presets",
    name: "The presets",
    blurb:
      "The pack I actually edit with — the one that makes a grey Ontario afternoon look like it was worth photographing.",
    kind: "Download",
    image: "/img/store/presets.jpg",
  },
  {
    key: "stickers",
    name: "Stickers",
    blurb:
      "For the toolbox, the laptop lid, the inside of the hood. Cut, weatherproof, and cheap enough to buy five.",
    kind: "Vinyl",
    image: "/img/store/stickers.jpg",
  },
];
