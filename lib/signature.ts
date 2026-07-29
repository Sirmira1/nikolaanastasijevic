import signatureImage from "@/img/signature-transparent.png";

/**
 * The uploaded signature is thresholded into the opening particle formation —
 * and, more importantly, *traced*, so the field fills the way the pen moved
 * rather than in a left-to-right wipe.
 *
 * The trace runs once, on load: the ink is thinned to a one-pixel skeleton, a
 * virtual pen walks that skeleton carrying its heading straight through
 * crossings (the way a hand does, rather than turning off at every junction),
 * and every ink pixel inherits the moment its nearest skeleton point was
 * reached. Where the walk has to jump, the pen lifted — and that costs real
 * time, so the mark stalls between strokes and starts again. Within a stroke
 * the pen slows into tight curves and eases off at both ends.
 *
 * Result: one 0..1 scrub (`world.markDraw`) drives one hand.
 */

const INK_THRESHOLD = 32;

/**
 * The trace grid is downsampled to about this width — coarse enough that
 * thinning and the walk are instant, fine enough to keep every stroke of the
 * signature separable. Particle positions map back to full resolution.
 */
const TRACE_WIDTH = 680;

/** how much a tight curve slows the hand (bigger = more drag in corners) */
const CURVE_DRAG = 90;
/** how slow the pen is at a stroke's ends relative to full flight */
const SETTLE = 0.45;
/** off-the-page travel is this many times faster than inked travel */
const LIFT_SPEED = 2.2;
/** cost of lifting and landing, in the same units as arc length, charged in
 *  full only once a jump is long enough to be the hand actually moving */
const LIFT_COST = 34;
const LIFT_FULL_DIST = 26;
/** ceiling on how much of the whole draw may be spent with the pen in the air;
 *  tracing a scan finds more small hops than a hand really makes, and without
 *  a budget they add up to a draw that spends its time doing nothing */
const LIFT_BUDGET = 0.14;
/** a jump shorter than this is a skeleton wobble, not a real pen lift */
const LIFT_MIN_DIST = 3;
/**
 * Thinning and crossings leave short fragments stranded beside ink the pen has
 * already laid down. A run this short that starts this close to where the pen
 * just was is one of them: it is dropped from the timeline, and its ink takes
 * the time of the stroke it sits against. A genuinely separate mark — an
 * i-dot, a crossbar — is reached by a long jump, so it survives on that.
 */
const DEBRIS_RUN = 48;
const DEBRIS_JUMP = 8;

const gauss = () => Math.random() + Math.random() + Math.random() - 1.5;

export { signatureImage };

/**
 * How much the mark shrinks to fit the viewport at the intro
 * camera (z=12.5, fov 50°): 1 on desktop, ~0.45 on phones. Particle
 * sizes and dust spread scale with it so density stays constant.
 */
export function markScale(): number {
  if (typeof window === "undefined") return 1;
  const viewH = 2 * Math.tan((50 * Math.PI) / 360) * 12.5;
  const viewW = viewH * (window.innerWidth / Math.max(window.innerHeight, 1));
  return Math.min(12, viewW * 0.9) / 12;
}

function loadSignatureImage() {
  const image = new Image();
  image.decoding = "async";
  image.src = signatureImage.src;
  return image.decode().then(() => image);
}

/* ------------------------------------------------------------------ */
/*  Ink → skeleton                                                     */
/* ------------------------------------------------------------------ */

type Ink = { mask: Uint8Array; w: number; h: number; step: number };

const NEIGHBOURS: [number, number][] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

/** Alpha-thresholds the image into a binary mask on the coarse trace grid. */
function readInk(pixels: Uint8ClampedArray, width: number, height: number): Ink {
  const step = Math.max(1, Math.round(width / TRACE_WIDTH));
  const w = Math.floor(width / step);
  const h = Math.floor(height / step);
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let hit = 0;
      for (let sy = 0; sy < step && !hit; sy++) {
        const py = y * step + sy;
        if (py >= height) break;
        for (let sx = 0; sx < step; sx++) {
          const px = x * step + sx;
          if (px >= width) break;
          if (pixels[(py * width + px) * 4 + 3] >= INK_THRESHOLD) {
            hit = 1;
            break;
          }
        }
      }
      mask[y * w + x] = hit;
    }
  }
  return { mask, w, h, step };
}

/**
 * Zhang-Suen thinning: peels the ink down to a one-pixel ridge while keeping
 * it connected, so the walk has an unambiguous line to follow.
 */
function thin({ mask, w, h }: Ink): Uint8Array {
  const img = Uint8Array.from(mask);
  const doomed: number[] = [];
  for (let pass = 0; pass < 64; pass++) {
    let removed = 0;
    for (let phase = 0; phase < 2; phase++) {
      doomed.length = 0;
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          if (!img[i]) continue;
          const p2 = img[i - w];
          const p3 = img[i - w + 1];
          const p4 = img[i + 1];
          const p5 = img[i + w + 1];
          const p6 = img[i + w];
          const p7 = img[i + w - 1];
          const p8 = img[i - 1];
          const p9 = img[i - w - 1];
          const b = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
          if (b < 2 || b > 6) continue;
          // exactly one 0→1 transition around the ring means this pixel is
          // on an edge rather than holding the ridge together
          let a = 0;
          if (!p2 && p3) a++;
          if (!p3 && p4) a++;
          if (!p4 && p5) a++;
          if (!p5 && p6) a++;
          if (!p6 && p7) a++;
          if (!p7 && p8) a++;
          if (!p8 && p9) a++;
          if (!p9 && p2) a++;
          if (a !== 1) continue;
          if (phase === 0) {
            if (p2 && p4 && p6) continue;
            if (p4 && p6 && p8) continue;
          } else {
            if (p2 && p4 && p8) continue;
            if (p2 && p6 && p8) continue;
          }
          doomed.push(i);
        }
      }
      for (let k = 0; k < doomed.length; k++) img[doomed[k]] = 0;
      removed += doomed.length;
    }
    if (!removed) break;
  }
  return img;
}

/* ------------------------------------------------------------------ */
/*  The walk                                                           */
/* ------------------------------------------------------------------ */

type Trace = {
  /** skeleton cells in pen order */
  cells: Int32Array;
  /** 1 where the pen jumped to this cell rather than sliding into it */
  lifted: Uint8Array;
};

/**
 * Walks the skeleton the way a hand would: from the low left end of the
 * leftmost stroke, always carrying straight on through a crossing rather than
 * turning off it, and jumping to the nearest untouched ink only once the
 * current stroke runs out. Those jumps are the pen lifts.
 */
function walk(skel: Uint8Array, w: number, h: number): Trace {
  const pending: number[] = [];
  for (let i = 0; i < skel.length; i++) if (skel[i]) pending.push(i);
  if (!pending.length) return { cells: new Int32Array(0), lifted: new Uint8Array(0) };

  const degree = (i: number) => {
    let d = 0;
    const x = i % w;
    const y = (i / w) | 0;
    for (const [dx, dy] of NEIGHBOURS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      if (skel[ny * w + nx]) d++;
    }
    return d;
  };

  // a right hand starts at the loose end of the leftmost stroke, low on the
  // line — free ends win outright, then leftmost, then lowest
  let start = pending[0];
  let bestRank = Infinity;
  for (const i of pending) {
    const rank = (i % w) * 16 - ((i / w) | 0) + (degree(i) === 1 ? 0 : w * 32);
    if (rank < bestRank) {
      bestRank = rank;
      start = i;
    }
  }

  const visited = new Uint8Array(skel.length);
  const cells = new Int32Array(pending.length);
  const lifted = new Uint8Array(pending.length);
  let n = 0;
  let cur = start;
  let dirX = 1;
  let dirY = 0;
  let jumped = 1;

  for (;;) {
    visited[cur] = 1;
    lifted[n] = jumped;
    cells[n++] = cur;
    jumped = 0;

    const cx = cur % w;
    const cy = (cur / w) | 0;
    let next = -1;
    let nextX = dirX;
    let nextY = dirY;
    let bestScore = -Infinity;
    for (const [dx, dy] of NEIGHBOURS) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const cand = ny * w + nx;
      if (!skel[cand] || visited[cand]) continue;
      const inv = dx && dy ? Math.SQRT1_2 : 1;
      // carry the heading through junctions instead of turning off them
      const score = (dx * dirX + dy * dirY) * inv;
      if (score > bestScore) {
        bestScore = score;
        next = cand;
        nextX = dx * inv;
        nextY = dy * inv;
      }
    }

    if (next >= 0) {
      dirX = nextX;
      dirY = nextY;
      cur = next;
      continue;
    }

    // stroke exhausted — hop to the nearest ink the pen has not laid down,
    // compacting the pending list as we scan it
    let nearest = -1;
    let nearestD = Infinity;
    let write = 0;
    for (let k = 0; k < pending.length; k++) {
      const i = pending[k];
      if (visited[i]) continue;
      pending[write++] = i;
      const dx = (i % w) - cx;
      const dy = ((i / w) | 0) - cy;
      const dist = dx * dx + dy * dy;
      if (dist < nearestD) {
        nearestD = dist;
        nearest = i;
      }
    }
    pending.length = write;
    if (nearest < 0) break;

    const jx = (nearest % w) - cx;
    const jy = ((nearest / w) | 0) - cy;
    const len = Math.hypot(jx, jy) || 1;
    dirX = jx / len;
    dirY = jy / len;
    cur = nearest;
    jumped = 1;
  }

  return { cells: cells.subarray(0, n), lifted: lifted.subarray(0, n) };
}

/**
 * Drops the litter thinning leaves behind — one- and two-cell fragments
 * stranded beside a ridge the pen has already passed. Left in, each one reads
 * as a pen lift in the middle of a stroke and a fleck of ink arriving long
 * after the line it belongs to. Genuinely separate marks (an i-dot, a
 * crossbar) are reached by a real jump, so they survive on that alone.
 */
function compress(trace: Trace, w: number): Trace {
  const { cells, lifted } = trace;
  const n = cells.length;
  const keep = new Uint8Array(n).fill(1);
  let s = 0;
  for (let i = 1; i <= n; i++) {
    if (i === n || lifted[i]) {
      let jump = Infinity;
      if (s > 0) {
        const dx = (cells[s] % w) - (cells[s - 1] % w);
        const dy = ((cells[s] / w) | 0) - ((cells[s - 1] / w) | 0);
        jump = Math.hypot(dx, dy);
      }
      if (i - s < DEBRIS_RUN && jump <= DEBRIS_JUMP) {
        for (let j = s; j < i; j++) keep[j] = 0;
      }
      s = i;
    }
  }

  const out = new Int32Array(n);
  const outLift = new Uint8Array(n);
  let m = 0;
  let prev = -2;
  for (let i = 0; i < n; i++) {
    if (!keep[i]) continue;
    outLift[m] = m === 0 || lifted[i] || i !== prev + 1 ? 1 : 0;
    out[m++] = cells[i];
    prev = i;
  }
  return { cells: out.subarray(0, m), lifted: outLift.subarray(0, m) };
}

/* ------------------------------------------------------------------ */
/*  The clock                                                          */
/* ------------------------------------------------------------------ */

/**
 * Turns the walk into a 0..1 timeline: slower through curvature, eased at
 * both ends of every stroke, and charged real time for each lift.
 */
function schedule(trace: Trace, w: number): Float32Array {
  const { cells, lifted } = trace;
  const n = cells.length;
  const time = new Float32Array(n);
  if (n < 2) return time;

  // where each stroke starts and ends, so the pen can ease in and out
  const runStart = new Int32Array(n);
  const runEnd = new Int32Array(n);
  let s = 0;
  for (let i = 1; i <= n; i++) {
    if (i === n || lifted[i]) {
      for (let j = s; j < i; j++) {
        runStart[j] = s;
        runEnd[j] = i - 1;
      }
      s = i;
    }
  }

  const xAt = (k: number) => cells[k] % w;
  const yAt = (k: number) => (cells[k] / w) | 0;

  // first pass: what each step costs, ink and air kept apart
  const cost = new Float32Array(n);
  let inkTime = 0;
  let airTime = 0;
  for (let i = 1; i < n; i++) {
    const ds = Math.hypot(xAt(i) - xAt(i - 1), yAt(i) - yAt(i - 1));

    if (lifted[i]) {
      // picking up the far arm of a crossing is not the same gesture as
      // carrying the hand across the page: only the latter pays in full
      const reach = Math.max(0, Math.min(1, (ds - LIFT_MIN_DIST) / (LIFT_FULL_DIST - LIFT_MIN_DIST)));
      cost[i] = ds / LIFT_SPEED + LIFT_COST * reach * reach;
      airTime += cost[i];
      continue;
    }

    // curvature over a few samples — single pixel steps are too noisy
    const a = Math.max(runStart[i], i - 4);
    const b = Math.min(runEnd[i], i + 4);
    const v1x = xAt(i) - xAt(a), v1y = yAt(i) - yAt(a);
    const v2x = xAt(b) - xAt(i), v2y = yAt(b) - yAt(i);
    const l1 = Math.hypot(v1x, v1y) || 1e-6;
    const l2 = Math.hypot(v2x, v2y) || 1e-6;
    const cos = Math.max(-1, Math.min(1, (v1x * v2x + v1y * v2y) / (l1 * l2)));
    const curvature = Math.acos(cos) / (l1 + l2);

    // hands obey v ∝ r^(1/3): the tighter the turn, the slower the pen
    let v = Math.cbrt(1 / (1 + curvature * CURVE_DRAG));
    const span = Math.max(1, runEnd[i] - runStart[i]);
    const u = (i - runStart[i]) / span;
    const ease = Math.min(1, u / 0.16) * Math.min(1, (1 - u) / 0.14);
    v *= SETTLE + (1 - SETTLE) * ease;

    cost[i] = ds / Math.max(v, 0.1);
    inkTime += cost[i];
  }

  // hold the air time to its budget, then roll the costs up into a 0..1 clock
  const ceiling = (inkTime * LIFT_BUDGET) / (1 - LIFT_BUDGET);
  const trim = airTime > ceiling ? ceiling / airTime : 1;
  let clock = 0;
  for (let i = 1; i < n; i++) {
    clock += lifted[i] ? cost[i] * trim : cost[i];
    time[i] = clock;
  }
  if (clock > 0) for (let i = 0; i < n; i++) time[i] /= clock;
  return time;
}

/* ------------------------------------------------------------------ */
/*  Sampling into the particle field                                   */
/* ------------------------------------------------------------------ */

/**
 * Samples the uploaded ink into world-space points, ordered — and timed — the
 * way the pen laid it down. Returns positions (xyz per particle) plus the
 * moment on the pen's timeline at which each one is written.
 */
export async function sampleSignature(count: number): Promise<{
  positions: Float32Array;
  times: Float32Array;
}> {
  const positions = new Float32Array(count * 3);
  const times = new Float32Array(count);
  for (let i = 0; i < count; i++) times[i] = i / count;

  const image = await loadSignatureImage();
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { positions, times };

  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const ink = readInk(pixels, canvas.width, canvas.height);
  const { mask, w, h, step } = ink;
  const trace = compress(walk(thin(ink), w, h), w);
  const clock = schedule(trace, w);

  // every ink cell inherits the moment its nearest skeleton cell was written,
  // flooded outward through the ink itself so strokes fill from their ridge
  const order = new Int32Array(w * h).fill(-1);
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;
  for (let k = 0; k < trace.cells.length; k++) {
    const cell = trace.cells[k];
    if (order[cell] < 0) {
      order[cell] = k;
      queue[tail++] = cell;
    }
  }
  while (head < tail) {
    const cell = queue[head++];
    const cx = cell % w;
    const cy = (cell / w) | 0;
    for (const [dx, dy] of NEIGHBOURS) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const n = ny * w + nx;
      if (!mask[n] || order[n] >= 0) continue;
      order[n] = order[cell];
      queue[tail++] = n;
    }
  }

  // ink in pen order; anything the flood never reached trails at the end
  const cells: number[] = [];
  for (let i = 0; i < mask.length; i++) if (mask[i]) cells.push(i);
  if (!cells.length) return { positions, times };
  cells.sort((a, b) => {
    const oa = order[a] < 0 ? Number.MAX_SAFE_INTEGER : order[a];
    const ob = order[b] < 0 ? Number.MAX_SAFE_INTEGER : order[b];
    return oa - ob || a - b;
  });

  const scale = (12 * markScale()) / canvas.width;
  const halfW = canvas.width / 2;
  const halfH = canvas.height / 2;

  for (let i = 0; i < count; i++) {
    const ratio = count > 1 ? i / (count - 1) : 0;
    const cell = cells[Math.min(cells.length - 1, Math.floor(ratio * cells.length))];
    if (cell === undefined) continue;
    const o = order[cell];
    times[i] = o >= 0 && o < clock.length ? clock[o] : 1;

    // back to full-resolution image space, jittered inside the trace cell so
    // the coarse grid never shows through
    const x = ((cell % w) + Math.random()) * step;
    const y = (((cell / w) | 0) + Math.random()) * step;
    const halo = Math.random() < 0.06 ? 0.16 : 0.012;
    positions[i * 3] = (x - halfW) * scale + gauss() * halo;
    positions[i * 3 + 1] = -(y - halfH) * scale + gauss() * halo;
    positions[i * 3 + 2] = gauss() * halo * 1.3;
  }

  return { positions, times };
}
