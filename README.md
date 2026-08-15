# THE OBSERVATORY — Nikola Anastasijević, Portfolio 2026

An interactive portfolio built as a single WebGL world: ~16,000 GPU particles
morph through eight formations (signature → galaxy → wave → torus knot → helix
→ vortex → chaos → portal ring) as you scroll, while a cinematic camera flies
between them.

The opening resolves Nikola&rsquo;s uploaded signature from particle dust before the
site moves into the galaxy. Its raster ink is thresholded into world-space points
in `lib/signature.ts`; the same particle system drives every later formation.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Stack

Next.js 15 · TypeScript · TailwindCSS 4 · React Three Fiber · custom GLSL ·
@react-three/postprocessing (bloom, chromatic aberration, vignette) ·
GSAP + ScrollTrigger · Lenis · Framer Motion

## Architecture

- `lib/world.ts` — mutable singleton bridging DOM ↔ WebGL (scroll blend, cursor,
  palettes, camera keyframes). Written at scroll/pointer frequency, read in
  `useFrame`; nothing re-renders on the hot path.
- `components/gl/Particles.tsx` — all seven formations baked into one RGBA-float
  DataTexture; a vertex shader morphs between rows with per-particle stagger,
  simplex turbulence, cursor repulsion and scroll-velocity smear.
- `components/gl/Scene.tsx` — camera rig lerping between per-section keyframes
  with drift + cursor parallax, plus the post-processing stack.
- `components/SmoothScroll.tsx` — Lenis → GSAP ticker → ScrollTrigger pipeline;
  computes the continuous section blend that drives morph, palette and camera.
- `components/sections/*` — each section has its own layout language; the lab
  is a GSAP-pinned horizontal scroll.

## Contact form

`components/ContactForm.tsx` is a dialog opened from anywhere with
`window.dispatchEvent(new Event("open-contact"))` — the header CTA, the hero
sentence and the portal ring all do. It posts to `app/api/contact/route.ts`,
which delivers by whichever of these environment variables is set:

| Variable | What it does |
| --- | --- |
| `RESEND_API_KEY` | Sends the enquiry as an email through [Resend](https://resend.com). |
| `CONTACT_TO` | Where it goes. Defaults to `EMAIL` in `lib/data.ts`. |
| `CONTACT_FROM` | Sender. Defaults to Resend's shared `onboarding@resend.dev`, which needs no DNS setup but only delivers to the address that owns the key. |
| `CONTACT_WEBHOOK` | Alternative: POST the raw JSON to Formspree, Web3Forms, Zapier, a Discord webhook, anything. |

Set them in Vercel under **Settings → Environment Variables**, then redeploy.

**With none of them set the route answers 503 and the form hands the message
to the visitor's mail client instead** — the behaviour the site had before the
form existed. That is deliberate: an unconfigured deploy should fall back to
something that works, not accept a message and quietly drop it.

## Customize

- Content: `lib/data.ts` (projects, skills, career, experiments, email, socials).
- Colors per section: `SECTION_PALETTES` in `lib/world.ts`.
- Camera path: `CAMERA_KEYS` in `lib/world.ts`.
- Formations: `shapeFns` in `components/gl/Particles.tsx`.

## Notes

- Respects `prefers-reduced-motion` (no smooth-scroll hijack, static-calm field,
  no char animation), keyboard navigable, semantic sections.
- Particle count and post-processing degrade on coarse-pointer / low-memory
  devices (`world.tier`).
