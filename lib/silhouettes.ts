/**
 * The shapes the field makes on the off-work page.
 *
 * Each one is a filled SVG silhouette — no outlines, because the particle
 * field reads *area*, the same way it reads the ink of the signature. They
 * are drawn here rather than loaded as files so the page works before a
 * single asset is uploaded, and any of them can be swapped for a real PNG
 * later by pointing the sampler at a URL instead.
 *
 * Every silhouette is authored in its own viewBox and normalised on the way
 * out, so they all arrive at the same size in the world regardless of how
 * they were drawn.
 */

export type Silhouette = {
  key: string;
  /** viewBox the artwork is drawn in */
  box: [number, number];
  /** the solid parts */
  art: string;
  /** parts punched back out — the lens barrel, the d-pad, the tent door */
  holes?: string;
};

export const SILHOUETTES: Silhouette[] = [
  {
    key: "car",
    box: [260, 112],
    art: `
      <!-- floor and lower body -->
      <path d="M30 80 L64 80 Q72 64 96 60 L134 54 Q146 38 170 38 L190 38 Q198 50 210 57 L228 64 L228 80 Z"/>
      <!-- nose cone, deep enough to read at particle scale -->
      <path d="M6 62 Q36 56 70 58 L70 80 L8 80 Z"/>
      <!-- front wing -->
      <rect x="0" y="70" width="48" height="11" rx="4"/>
      <rect x="2" y="56" width="12" height="18" rx="3"/>
      <!-- cockpit and halo -->
      <path d="M132 50 Q150 32 178 36 L180 44 Q154 40 140 54 Z"/>
      <!-- airbox -->
      <path d="M170 38 L184 18 L196 21 L194 42 Z"/>
      <!-- engine cover sweeping back -->
      <path d="M194 40 L230 56 L230 68 L192 52 Z"/>
      <!-- rear wing: main plane, upper flap, endplate -->
      <rect x="206" y="14" width="52" height="12" rx="4"/>
      <rect x="212" y="32" width="44" height="9" rx="4"/>
      <rect x="240" y="12" width="11" height="52" rx="3"/>
      <!-- wheels -->
      <circle cx="72" cy="80" r="25"/>
      <circle cx="206" cy="80" r="28"/>
    `,
  },
  {
    key: "snowboard",
    box: [140, 230],
    art: `
      <g transform="rotate(-18 70 115)">
        <!-- deck -->
        <path d="M70 6 Q104 24 104 66 L104 168 Q104 210 70 226 Q36 210 36 168 L36 66 Q36 24 70 6 Z"/>
      </g>
    `,
    holes: `
      <g transform="rotate(-18 70 115)">
        <rect x="48" y="70" width="44" height="26" rx="6"/>
        <rect x="48" y="140" width="44" height="26" rx="6"/>
      </g>
    `,
  },
  {
    key: "tent",
    box: [240, 150],
    art: `
      <!-- fly -->
      <path d="M120 14 L214 128 L26 128 Z"/>
      <!-- guy lines and pegs -->
      <path d="M120 14 L236 122 L232 128 L116 22 Z"/>
      <path d="M120 14 L4 122 L8 128 L124 22 Z"/>
      <rect x="20" y="124" width="200" height="7" rx="3"/>
    `,
    holes: `<path d="M120 46 L158 126 L82 126 Z"/>`,
  },
  {
    key: "rings",
    box: [220, 200],
    art: `
      <!-- gymnastic rings: calisthenics, and it reads at a glance -->
      <rect x="46" y="6" width="9" height="86" rx="4"/>
      <rect x="165" y="6" width="9" height="86" rx="4"/>
      <path d="M50 88 h6 v18 h-6 Z"/>
      <path d="M169 88 h6 v18 h-6 Z"/>
      <circle cx="53" cy="140" r="40"/>
      <circle cx="170" cy="140" r="40"/>
      <rect x="8" y="2" width="206" height="10" rx="5"/>
    `,
    holes: `
      <circle cx="53" cy="140" r="26"/>
      <circle cx="170" cy="140" r="26"/>
    `,
  },
  {
    key: "camera",
    box: [240, 160],
    art: `
      <!-- body -->
      <rect x="14" y="38" width="212" height="106" rx="16"/>
      <!-- prism hump -->
      <path d="M86 38 L96 14 L152 14 L162 38 Z"/>
      <!-- lens -->
      <circle cx="120" cy="92" r="46"/>
      <!-- shutter and flash -->
      <rect x="182" y="24" width="26" height="16" rx="5"/>
      <circle cx="196" cy="62" r="9"/>
    `,
    holes: `<circle cx="120" cy="92" r="29"/>`,
  },
  {
    key: "controller",
    box: [260, 150],
    art: `
      <!-- grips and body in one sweep -->
      <path d="M74 34 L186 34 Q214 34 226 62 L250 122 Q258 146 234 146 Q216 146 200 124 L178 96 L82 96 L60 124 Q44 146 26 146 Q2 146 10 122 L34 62 Q46 34 74 34 Z"/>
    `,
    holes: `
      <path d="M62 62 h14 v-14 h16 v14 h14 v16 h-14 v14 h-16 v-14 h-14 Z"/>
      <circle cx="186" cy="56" r="9"/>
      <circle cx="212" cy="72" r="9"/>
      <circle cx="186" cy="88" r="9"/>
      <circle cx="160" cy="72" r="9"/>
      <circle cx="106" cy="100" r="15"/>
      <circle cx="154" cy="100" r="15"/>
    `,
  },
  {
    key: "football",
    box: [240, 150],
    art: `
      <!-- American football: the points are what make it read -->
      <path d="M120 16 Q198 26 232 75 Q198 124 120 134 Q42 124 8 75 Q42 26 120 16 Z"/>
    `,
    holes: `
      <rect x="100" y="52" width="40" height="7" rx="3.5"/>
      <rect x="110" y="66" width="20" height="6" rx="3"/>
      <rect x="110" y="79" width="20" height="6" rx="3"/>
      <rect x="110" y="92" width="20" height="6" rx="3"/>
      <path d="M46 38 Q32 75 46 112" fill="none" stroke="#000" stroke-width="7"/>
      <path d="M194 38 Q208 75 194 112" fill="none" stroke="#000" stroke-width="7"/>
    `,
  },

  /* ---------------------------------------------------------------- */
  /*  The on-work page: one formation per capability                   */
  /* ---------------------------------------------------------------- */

  {
    key: "stack",
    box: [260, 212],
    art: `
      <!-- three layers seen from a corner: the whole path, one slab a tier -->
      <path d="M20 44 L130 18 L240 44 L130 70 Z"/>
      <path d="M20 106 L130 80 L240 106 L130 132 Z"/>
      <path d="M20 168 L130 142 L240 168 L130 194 Z"/>
    `,
  },
  {
    key: "nib",
    box: [140, 224],
    art: `
      <!-- a pen nib: drawn before it is built -->
      <path d="M70 216 L18 96 Q18 42 70 14 Q122 42 122 96 Z"/>
    `,
    holes: `
      <circle cx="70" cy="98" r="17"/>
      <rect x="63" y="116" width="14" height="88" rx="7"/>
    `,
  },
  {
    key: "phone",
    box: [140, 250],
    art: `
      <rect x="8" y="6" width="124" height="238" rx="26"/>
    `,
    holes: `
      <rect x="24" y="48" width="92" height="150" rx="9"/>
      <rect x="52" y="26" width="36" height="8" rx="4"/>
      <rect x="50" y="216" width="40" height="8" rx="4"/>
    `,
  },
  {
    key: "node",
    box: [240, 200],
    art: `
      <!-- a model: one thing in the middle, wired to everything else -->
      <path
        d="M120 100 L30 40 M120 100 L30 160 M120 100 L120 20
           M120 100 L120 180 M120 100 L210 40 M120 100 L210 160"
        fill="none" stroke-width="8"
      />
      <circle cx="120" cy="100" r="27"/>
      <circle cx="30" cy="40" r="18"/>
      <circle cx="30" cy="160" r="18"/>
      <circle cx="120" cy="20" r="18"/>
      <circle cx="120" cy="180" r="18"/>
      <circle cx="210" cy="40" r="18"/>
      <circle cx="210" cy="160" r="18"/>
    `,
  },
  {
    key: "book",
    box: [260, 184],
    art: `
      <!-- open book: every project picks something I cannot do yet -->
      <path d="M126 46 Q80 18 14 27 L14 152 Q80 143 126 170 Z"/>
      <path d="M134 46 Q180 18 246 27 L246 152 Q180 143 134 170 Z"/>
    `,
  },
];

/**
 * Wraps a silhouette into a standalone SVG document. The cut-outs go through
 * a mask rather than a blend mode: the sampler reads the alpha channel, and a
 * hole that is merely painted black is still fully opaque — it would fill
 * straight back in.
 */
export function svgFor(s: Silhouette, fill = "#ffffff") {
  const [w, h] = s.box;
  // the id has to be unique: inline two of these in one document and a shared
  // id means every shape resolves to the first mask in the tree
  const id = `cut-${s.key}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
    `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}">` +
    `<g fill="#fff" stroke="#fff">${s.art}</g>` +
    `<g fill="#000" stroke="#000">${s.holes ?? ""}</g>` +
    `</mask></defs>` +
    `<rect width="${w}" height="${h}" fill="${fill}" mask="url(#${id})"/></svg>`;
}

/* ------------------------------------------------------------------ */
/*  Silhouette → particle positions                                    */
/* ------------------------------------------------------------------ */

const gauss = () => Math.random() + Math.random() + Math.random() - 1.5;

/** the longest side of any silhouette, in world units */
export const SIL_EXTENT = 8.4;

/**
 * Rasterises a silhouette and scatters `count` particles across its filled
 * area — the same trick the signature uses, reading the alpha channel rather
 * than the colour, which is why the cut-outs have to be real transparency.
 *
 * Points are drawn evenly across the ink with a jitter inside each stride, so
 * the field covers the shape without falling into scanlines. The result is
 * normalised on its own bounding box: every object arrives the same size in
 * the world however it was drawn.
 */
export async function sampleSilhouette(
  s: Silhouette,
  count: number
): Promise<Float32Array> {
  const out = new Float32Array(count * 3);
  const [bw, bh] = s.box;
  const scale = Math.min(3, 640 / Math.max(bw, bh));
  const rw = Math.max(1, Math.round(bw * scale));
  const rh = Math.max(1, Math.round(bh * scale));

  const image = new Image();
  image.decoding = "async";
  image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgFor(s));
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = rw;
  canvas.height = rh;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return out;
  ctx.drawImage(image, 0, 0, rw, rh);
  const px = ctx.getImageData(0, 0, rw, rh).data;

  const xs: number[] = [];
  const ys: number[] = [];
  let minX = rw;
  let maxX = 0;
  let minY = rh;
  let maxY = 0;
  for (let y = 0; y < rh; y++) {
    for (let x = 0; x < rw; x++) {
      if (px[(y * rw + x) * 4 + 3] < 48) continue;
      xs.push(x);
      ys.push(y);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const n = xs.length;
  if (!n) return out;

  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const k = SIL_EXTENT / Math.max(spanX, spanY);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  for (let i = 0; i < count; i++) {
    const j = Math.min(n - 1, Math.floor(((i + Math.random()) * n) / count));
    out[i * 3] = (xs[j] - cx) * k + gauss() * 0.035;
    out[i * 3 + 1] = -(ys[j] - cy) * k + gauss() * 0.035;
    out[i * 3 + 2] = gauss() * 0.34;
  }
  return out;
}
