"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GARAGE, OBSESSIONS, RACING, SOCIAL_CARDS } from "@/lib/data";
import { world, HOBBY_SHAPE } from "@/lib/world";
import { calmMode } from "@/lib/calm";
import { SectionLabel, Rise, RevealLines, Line } from "@/components/ui/Split";
import Frame from "@/components/ui/Frame";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  The cycle — one obsession at a time, the field taking its colour   */
/* ------------------------------------------------------------------ */

/**
 * A pinned stage that steps through everything I am into. The word, the photo
 * and — the point of the whole thing — the particle field change together:
 * the field is holding a silhouette of the subject, so scrolling into cars
 * builds a race car out of the stars, camping builds a tent, gaming builds a
 * controller.
 *
 * Each subject holds its shape for most of its span and only morphs near the
 * boundary, so the field is actually *being* the object rather than smearing
 * between two of them the whole way down. The word flips mid-morph, so it and
 * the shape land together.
 */
const HOLD = 0.74;


function Cycle() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [reduced, setReduced] = useState(false);

  /**
   * Each word is set as large as the column will take it, and no larger.
   *
   * One size cannot serve all of them: "SNOWBOARD" is more than twice the
   * width of "CARS", so a viewport size big enough to give the short word any
   * presence runs the long one straight off the side of a phone. Sizing the
   * whole set to the longest fixes the clipping but costs every other word
   * half its scale. They cross-fade one at a time, though — two are never on
   * screen together — so there is no matched set to preserve, and each can be
   * fitted to the column on its own terms.
   *
   * The block keeps the height of a full-size word either way, so the copy
   * beneath it does not hop as the words change.
   */
  useEffect(() => {
    const el = wordRef.current;
    if (!el) return;

    const fit = () => {
      const avail = el.clientWidth;
      if (!avail) return;
      const words = [...el.querySelectorAll<HTMLElement>("[data-word]")];
      // measure them all at full size first, then commit — interleaving the
      // two would have each word re-laying out the ones after it
      words.forEach((w) => w.style.setProperty("--fit", "1"));
      const widths = words.map((w) => w.scrollWidth);
      words.forEach((w, i) => {
        if (widths[i] > 0) {
          w.style.setProperty("--fit", String(Math.min(1, avail / widths[i])));
        }
      });
    };

    fit();
    // the block's own height never changes with the fit, so watching it for
    // width changes cannot feed back into itself
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    // the display face is the thing being measured, so wait for it to land
    document.fonts?.ready.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (calmMode()) {
      setReduced(true);
      return;
    }
    const section = sectionRef.current;
    if (!section) return;

    const n = OBSESSIONS.length;

    /**
     * One driver for the whole page rather than one for the pinned section.
     * Held only while pinned, the field fell back to the page's section blend
     * either side of it — which sits nowhere near the hobby formations, so
     * arriving sprinted through six unrelated shapes and leaving snapped
     * straight back. This is a continuous function of scroll from the top of
     * the page to the bottom: the car before the cycle, the cycle through it,
     * and an unhurried walk back to the car afterwards.
     */
    const drive = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = Math.max(rect.height - vh, 1);
      const p = Math.max(0, Math.min(-rect.top / travel, 1));

      const local = Math.min(p * n, n - 0.0001);
      const step = Math.floor(local);
      const frac = local - step;
      // hold, then morph over the last stretch of each subject's span
      const morph = frac <= HOLD ? 0 : (frac - HOLD) / (1 - HOLD);
      const eased = morph * morph * (3 - 2 * morph);
      let lock = Math.min(step + eased, n - 1);

      // Nothing below the cycle wants a different shape, so the field simply
      // stays where the tour left it. Walking it back would mean crossing
      // every formation again on whatever scroll happened to be left — which
      // is the same scramble, just at the other end.

      world.blendLock = HOBBY_SHAPE + lock;
      world.blend = world.blendLock;
      setAt(Math.min(n - 1, step + (eased > 0.5 ? 1 : 0)));
    };

    const ctx = gsap.context(() => {
      // the whole document, so the driver is never out of range
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: drive,
        onRefresh: drive,
      });
    }, section);

    // and immediately, so the page opens on the car rather than on whatever
    // formation the previous page left behind
    drive();
    return () => {
      ctx.revert();
      world.blendLock = null;
    };
  }, []);

  // the field takes the colour of whatever is on screen
  useEffect(() => {
    if (reduced) return;
    world.accent = OBSESSIONS[at].accent;
    return () => {
      world.accent = null;
    };
  }, [at, reduced]);

  if (reduced) {
    return (
      <section aria-label="What I am into" className="relative px-5 py-[14vh] md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-2">
          {OBSESSIONS.map((o) => (
            <div key={o.key} className="group">
              <Frame src={o.image} alt={o.label} aspect="4 / 3" />
              <h3 className="mt-4 font-display text-3xl font-extrabold text-ink">{o.label}</h3>
              <p className="mt-2 max-w-md font-mono text-sm leading-relaxed text-dim">{o.lead}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-shape
      aria-label="What I am into"
      className="relative h-[640vh]"
    >
      <div className="sticky top-0 flex h-[100svh] items-center px-5 md:px-10">
        <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 md:grid-cols-[1.2fr_1fr] md:gap-14">
          {/* the word */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember">
              {String(at + 1).padStart(2, "0")} / {String(OBSESSIONS.length).padStart(2, "0")}
            </span>

            <div
              ref={wordRef}
              className="relative mt-4 overflow-hidden [--word:15vw] md:[--word:6.4vw]"
              style={{ height: "calc(var(--word) * 1.02)" }}
            >
              {OBSESSIONS.map((o, i) => (
                <h2
                  key={o.key}
                  data-word
                  aria-hidden={i !== at}
                  className="absolute bottom-0 left-0 w-max whitespace-nowrap font-display font-extrabold leading-[0.9] tracking-tight transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    fontSize: "calc(var(--word) * var(--fit, 1))",
                    color: i === at ? o.accent : "transparent",
                    opacity: i === at ? 1 : 0,
                    transform: `translateY(${(i - at) * 22}%)`,
                  }}
                >
                  {o.label}
                </h2>
              ))}
            </div>

            <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-ink/80 md:text-base">
              {OBSESSIONS[at].lead}
            </p>

            <ul role="list" className="mt-7 flex flex-wrap gap-2">
              {OBSESSIONS[at].tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-ink/25 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/75"
                >
                  {t}
                </li>
              ))}
            </ul>

            {/* which one you are on */}
            <div aria-hidden="true" className="mt-10 flex gap-2">
              {OBSESSIONS.map((o, i) => (
                <span
                  key={o.key}
                  className="h-px transition-all duration-500"
                  style={{
                    width: i === at ? 42 : 18,
                    background: i === at ? o.accent : "rgba(236,231,223,0.3)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* the picture, stacked and cross-fading */}
          <div className="relative aspect-[4/3] w-full">
            {OBSESSIONS.map((o, i) => (
              <div
                key={o.key}
                className="absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: i === at ? 1 : 0,
                  transform: `scale(${i === at ? 1 : 1.06}) translateY(${(i - at) * 4}%)`,
                }}
              >
                <Frame src={o.image} alt={o.label} aspect="4 / 3" className="h-full" priority={i === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  The hand of cards                                                  */
/* ------------------------------------------------------------------ */

/** Social links fanned like a hand — each one lifts and straightens on hover. */
/** how far each card leans from its neighbour, and how tall a card is */
const LEAN = 9;
const CARD_RATIO = 1.5;

function Hand() {
  const n = SOCIAL_CARDS.length;
  const mid = (n - 1) / 2;
  const [up, setUp] = useState(-1);
  const [touch, setTouch] = useState(false);

  // A leaning card is wider than it is: rotate a 105×157 card by 18° and it
  // covers 148px of the row. Budgeting on the upright width is what let the
  // outermost cards hang off the edge of a phone even once the fan was sized
  // to its column, so the spread is solved against the swept width instead.
  const sweep = (mid * LEAN * Math.PI) / 180;
  const swell = (Math.cos(sweep) + CARD_RATIO * Math.sin(sweep)) / 2;

  // a phone has no hover, so it must not be told to hover
  useEffect(() => {
    setTouch(!window.matchMedia("(hover: hover)").matches);
  }, []);

  const raise = (i: number) => () => setUp(i);
  const drop = (i: number) => () => setUp((u) => (u === i ? -1 : u));

  return (
    <section aria-label="Elsewhere" className="relative px-5 pb-[16vh] pt-[6vh] md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel index="04" title="Find me elsewhere" />

        <div className="flex items-end justify-center pb-6">
          {/*
            The fan is sized against its own width rather than the viewport's:
            five 176px cards spread 74px apart need 470px, which is wider than
            a phone, and the outer cards were being cut off the screen. The
            card and the spread shrink together down to whatever the column
            actually has, so the hand still reads as a hand at 390px.
          */}
          <div
            className="relative flex w-full max-w-[760px] items-end justify-center"
            style={{
              containerType: "inline-size",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...({
                "--cw": "min(176px, 30cqw)",
                "--ch": `calc(var(--cw) * ${CARD_RATIO})`,
                "--step": `min(74px, (48cqw - ${swell.toFixed(3)} * var(--cw)) / ${mid})`,
                height: "calc(var(--ch) + 72px)",
              } as any),
            }}
          >
            {SOCIAL_CARDS.map((s, i) => {
              const open = up === i;
              const lean = (i - mid) * LEAN;
              const lift = Math.abs(i - mid) * 14;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  data-cursor={s.todo ? "SOON" : "OPEN"}
                  aria-disabled={s.todo || undefined}
                  onClick={s.todo ? (e) => e.preventDefault() : undefined}
                  onPointerEnter={raise(i)}
                  onPointerLeave={drop(i)}
                  onFocus={raise(i)}
                  onBlur={drop(i)}
                  className="group absolute bottom-0 origin-bottom overflow-hidden rounded-md border border-ink/20 bg-void/85 p-3 backdrop-blur-sm transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-4"
                  style={{
                    width: "var(--cw)",
                    height: "var(--ch)",
                    left: `calc(50% + (${i - mid}) * var(--step) - var(--cw) / 2)`,
                    transform: open
                      ? "rotate(0deg) translateY(-28px)"
                      : `rotate(${lean}deg) translateY(${lift}px)`,
                    borderColor: open ? "rgba(236,231,223,0.45)" : undefined,
                    zIndex: open ? 30 : i,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{ background: s.tint }}
                  />
                  <span
                    className="mt-3 block font-display font-bold leading-tight text-ink md:mt-4"
                    style={{ fontSize: "max(13px, calc(var(--cw) * 0.115))" }}
                  >
                    {s.label}
                  </span>
                  <span className="mt-1 block break-words font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-ink/60">
                    {s.todo ? "Link to come" : s.handle}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 left-3 font-mono text-[10px] text-ink/45 transition-colors duration-300 group-hover:text-ember md:bottom-4 md:left-4"
                  >
                    ↗
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-ink/50">
          {touch ? "Tap a card" : "Hover a card"}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  The page                                                           */
/* ------------------------------------------------------------------ */

export default function OffWork() {
  return (
    <>
      {/* opening */}
      <section
        data-shape
        aria-label="Off work"
        className="relative flex min-h-[92svh] flex-col justify-end px-5 pb-[10vh] pt-[24vh] md:px-10"
      >
        <div className="section-veil" aria-hidden="true" />
        <div className="mx-auto w-full max-w-[1400px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember">
            Off work
          </span>
          <RevealLines className="mt-6 font-display text-[13vw] font-extrabold leading-[0.92] tracking-tight text-ink md:text-[8vw]">
            <Line>WHAT I DO</Line>
            <Line>
              WHEN <span className="font-serif font-normal italic text-ember">nobody</span>
            </Line>
            <Line>IS PAYING</Line>
          </RevealLines>
          <p className="mt-10 max-w-xl font-mono text-sm leading-relaxed text-ink/80 md:text-base">
            Cars first, and it is not close. Then whatever gets me outside, off
            the ground, or into something I have not tried yet.
          </p>
        </div>
      </section>

      {/* cars, at the length it deserves */}
      <section
        data-shape
        aria-label="Cars"
        className="relative px-5 py-[16vh] md:px-10"
      >
        <div className="section-veil" aria-hidden="true" />
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel index="01" title="Cars — the loud one" />

          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <div>
              <h2 className="font-display text-[9vw] font-extrabold leading-[0.95] tracking-tight text-ink md:text-[4.4vw]">
                AMERICAN
                <br />
                <span className="text-ember">MUSCLE</span>
              </h2>
              <p className="mt-8 max-w-lg font-mono text-sm leading-relaxed text-ink/80">
                Corvettes and Hellcats — the unreasonable end of the catalogue.
                I would rather build one than buy one finished, and I would
                rather drive it than photograph it. Usually I do all three.
              </p>

              <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-ink/15 bg-ink/15 sm:grid-cols-3">
                {GARAGE.map((g) => (
                  <div key={g.title} className="bg-void p-6">
                    <h3 className="font-display text-lg font-bold text-ink">{g.title}</h3>
                    <p className="mt-2 font-mono text-xs leading-relaxed text-dim">{g.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <Rise className="group">
              <Frame src="/img/off/cars.jpg" alt="The car" aspect="4 / 5" />
            </Rise>
          </div>

          {/* what's on the screen every weekend */}
          <div className="mt-24">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/60">
              Watched, all of it
            </span>
            <ul role="list" className="mt-8 grid border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-3">
              {RACING.map((r) => (
                <li
                  key={r.series}
                  className="group flex items-baseline justify-between gap-4 border-b border-ink/12 py-5 transition-colors duration-300 hover:border-ember/50"
                >
                  <span className="font-display text-xl font-bold text-ink/90 transition-colors duration-300 group-hover:text-ember md:text-2xl">
                    {r.series}
                  </span>
                  <span className="text-right font-mono text-[9px] uppercase tracking-[0.18em] text-ink/55">
                    {r.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Cycle />

      <Hand />
    </>
  );
}
