/**
 * Shared mutable state bridging the DOM (scroll, cursor) and the WebGL scene.
 * A plain module singleton — written at scroll/pointer frequency, read inside
 * useFrame — so nothing re-renders on the hot path.
 */

export const SHAPES = [
  "signature",
  "hero",
  "about",
  "projects",
  "skills",
  "career",
  "playground",
  "contact",
  // the off-work page. The bookends sit either side of the hobby run on
  // purpose: the field blends between *consecutive* rows of the shape atlas,
  // so a handover to a formation further along the list would smear through
  // every shape in between on the way.
  "muscle",
  "car",
  "snowboard",
  "tent",
  "rings",
  "camera",
  "controller",
  "football",
  "flag",
  // the on-work page: one formation per capability, bookended the same way
  "terminal",
  "stack",
  "nib",
  "phone",
  "node",
  "book",
  "plane",
  // the store
  "bag",
] as const;

/** where the hobby silhouettes begin in SHAPES */
export const HOBBY_SHAPE = SHAPES.indexOf("car");

/** what the off-work page opens and closes on, either side of the hobbies */
export const OFF_OPEN_SHAPE = SHAPES.indexOf("muscle");
export const OFF_CLOSE_SHAPE = SHAPES.indexOf("flag");

/** where the on-work silhouettes begin in SHAPES */
export const WORK_SHAPE = SHAPES.indexOf("stack");

/** what the on-work page opens and closes on, either side of the capabilities */
export const WORK_OPEN_SHAPE = SHAPES.indexOf("terminal");
export const WORK_CLOSE_SHAPE = SHAPES.indexOf("plane");

/** what the store page holds */
export const STORE_SHAPE = SHAPES.indexOf("bag");

export type ShapeName = (typeof SHAPES)[number];

export const NUM_SHAPES = SHAPES.length;

/** Per-section particle palettes: [core color, edge color] as hex. */
export const SECTION_PALETTES: [string, string][] = [
  ["#ffd9c2", "#ece7df"], // signature — warm ink
  ["#ffb454", "#7c5cff"], // hero    — amber galaxy, violet rim
  ["#6ea8ff", "#dfe8ff"], // about   — cool tide
  ["#ff5c28", "#ffd9c2"], // projects — ember (overridden by hovered project)
  ["#3fd2c7", "#c3fff4"], // skills  — mint helix
  ["#c9a2ff", "#7c5cff"], // career  — violet ascent
  ["#ff6ad5", "#ffd166"], // playground — magenta/gold chaos
  ["#ff5c28", "#fff3ea"], // contact — portal
  // the hobby silhouettes; the page overrides these with each subject's own
  // accent as it comes round, so these are only what they fall back to
  ["#ff5c28", "#ffd9c2"], // muscle
  ["#ff5c28", "#ffd9c2"], // car
  ["#6ea8ff", "#dfe8ff"], // snowboard
  ["#8ede5a", "#d9ffc2"], // tent
  ["#3fd2c7", "#c3fff4"], // rings
  ["#c9a2ff", "#efe4ff"], // camera
  ["#ff6ad5", "#ffd166"], // controller
  ["#ffb454", "#ffe9c2"], // football
  ["#ece7df", "#ffffff"], // flag — the finish, in plain ink
  // the capability silhouettes, likewise overridden by the page
  ["#6ea8ff", "#dfe8ff"], // terminal
  ["#6ea8ff", "#dfe8ff"], // stack
  ["#c9a2ff", "#efe4ff"], // nib
  ["#3fd2c7", "#c3fff4"], // phone
  ["#ff6ad5", "#ffd166"], // node
  ["#ffb454", "#ffe9c2"], // book
  ["#ece7df", "#ffffff"], // plane — shipped, in plain ink
  ["#ff5c28", "#ffd9c2"], // bag
];

/** Particle field opacity per section — the world recedes while you read. */
export const SECTION_OPACITY = [
  1, 1, 0.55, 0.4, 0.34, 0.45, 0.58, 0.95,
  // the silhouettes are the subject of their page, so they carry
  0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9,
  0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9,
  0.72,
];

/** Camera keyframes per section: position + lookAt. */
export const CAMERA_KEYS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [0, 0, 12.5], look: [0, 0, 0] },     // signature — dead-on, reverent
  { pos: [0, 0.6, 11.5], look: [0, 0, 0] },   // hero — front, slightly above
  { pos: [3.2, 2.0, 9.0], look: [0, -0.4, 0] }, // about — oblique over the wave
  { pos: [-1.6, 0.4, 10.5], look: [0, 0, 0] }, // projects — off-axis
  { pos: [4.2, 0.2, 7.5], look: [0, 0, 0] },   // skills — side of helix
  { pos: [0.4, 2.6, 9.5], look: [0, 0.6, 0] }, // career — looking up the stream
  { pos: [0, -0.8, 13.0], look: [0, 0, 0] },   // playground — pulled back
  { pos: [0, 0, 7.2], look: [0, 0, 0] },       // contact — flying into the ring
  // dead-on for every silhouette: an object only reads square to the camera
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // muscle
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // car
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // snowboard
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // tent
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // rings
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // camera
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // controller
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // football
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // flag
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // terminal
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // stack
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // nib
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // phone
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // node
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // book
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // plane
  { pos: [0, 0, 11.5], look: [0, 0, 0] },      // bag
];

type WorldState = {
  /** continuous section index, 0..NUM_SHAPES-1, drives particle morph + camera */
  blend: number;
  /** overall page scroll 0..1 */
  scroll: number;
  /** lenis velocity (px/frame-ish), used for turbulence */
  scrollVel: number;
  /** pointer in NDC (-1..1), y up */
  mouse: { x: number; y: number };
  /** smoothed pointer speed 0..~1 */
  mouseVel: number;
  /** true while a mouse or pen is present in the viewport */
  pointerActive: boolean;
  /** signature reveal progress 0..1, scrubbed by the intro's scroll */
  markDraw: number;
  /** accent override while hovering a project (hex) or null */
  accent: string | null;
  /** true while the lab's horizontal track is pinned and being travelled */
  labActive: boolean;
  /** how far through that track, 0..1 — the field turns with it */
  labProgress: number;
  /**
   * When set, the field follows this formation index instead of working it
   * out from the page's sections — a pinned section that steps through
   * several formations of its own needs to drive the blend directly.
   */
  blendLock: number | null;
  /** last click: NDC coords + timestamp (s) + power (1 = click, >1 = boom) */
  clickAt: { x: number; y: number; t: number; power: number };
  /** queued visitor-signature strokes (world-space xyz triplets) for the trail system */
  markQueue: Float32Array[];
  /** true once the preloader has finished revealing */
  started: boolean;
  reducedMotion: boolean;
  /** device tier: 0 = low, 1 = high */
  tier: number;
};

export const world: WorldState = {
  blend: 0,
  scroll: 0,
  scrollVel: 0,
  mouse: { x: 0, y: 0 },
  mouseVel: 0,
  pointerActive: false,
  markDraw: 0,
  accent: null,
  labActive: false,
  labProgress: 0,
  blendLock: null,
  clickAt: { x: 0, y: 0, t: -100, power: 0 },
  markQueue: [],
  started: false,
  reducedMotion: false,
  tier: 1,
};
