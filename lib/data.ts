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

/**
 * The wall, in the order it is walked.
 *
 * Deliberately not grouped by kind. Sorted into design studies, then app
 * extracts, then 3D builds, it read as a list of categories and the last
 * third carried the first two — so the order alternates instead, and the
 * three biggest plates in the column pattern (positions 1, 4 and 7) are given
 * to the three 3D builds, which are the ones worth stopping for.
 *
 * Nothing ships here without a capture. Two placeholders and a shot of this
 * very website used to sit in the run; a wall advertising the page you are
 * already standing on, next to two frames of nothing, is not a portfolio.
 */
export const EXPERIMENTS: Experiment[] = [
  { index: "E—01", title: "THE HALL", medium: "Portfolio as a walkable 3D museum", gradient: ["#150f07", "#d8b271"], image: "/img/lab-the-hall.webp" },
  { index: "E—02", title: "SOFT", medium: "Design study — minimal Gen Z aesthetic", gradient: ["#1b0f3d", "#c9a2ff"], href: "https://soft-design.vercel.app/", image: "/img/Screenshot 2026-07-03 095957.png" },
  { index: "E—03", title: "FOG OF WAR", medium: "Mapbox exploration mask from FlyBy", gradient: ["#032622", "#3fd2c7"], image: "/img/Screenshot 2026-07-08 112150.png" },
  { index: "E—04", title: "OVERCLOCK", medium: "Cyber build — a 3D core in motion", gradient: ["#050b1e", "#6ea8ff"], image: "/img/lab-overclock.webp" },
  { index: "E—05", title: "NOIR", medium: "Design study — high-contrast cinema", gradient: ["#12122e", "#6ea8ff"], href: "https://mysterious-design.vercel.app/", image: "/img/Screenshot 2026-07-03 100331.png" },
  { index: "E—06", title: "BACKTEST RIG", medium: "Trading strategies, simulated overnight", gradient: ["#26043a", "#ff6ad5"], image: "/img/Screenshot 2026-07-08 112603.png" },
  { index: "E—07", title: "APEX", medium: "Portfolio at racing pace — 3D garage", gradient: ["#2a0604", "#ff5c28"], image: "/img/lab-apex.webp" },
  { index: "E—08", title: "CASUAL", medium: "Design study — approachable modern", gradient: ["#231a02", "#ffb454"], href: "https://casual-design-five.vercel.app/", image: "/img/Screenshot 2026-07-03 100054.png" },
];

/** What I take on, listed once: the contact section prints it, the form asks with it. */
export const SERVICES = [
  "Websites",
  "Web apps",
  "Mobile apps",
  "3D / interactive",
  "Automation & AI",
];

/** Rough bands, so a first message can say the useful thing without awkwardness. */
export const BUDGETS = ["Under $1k", "$1k — $5k", "$5k — $15k", "$15k+", "Not sure yet"];

export const EMAIL = "nikolaanastasijevic0@gmail.com";

/**
 * Where to find me, in the footer and in the console.
 *
 * Email rather than a link back to this website: a visitor reading the footer
 * is already on the website, and the one thing they might want from it at
 * that point is a way to get hold of me.
 */
export const SOCIALS = [
  { label: "Email", href: `mailto:${EMAIL}` },
  { label: "GitHub", href: "https://github.com/Sirmira1" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nikolaanastasijevic" },
];
