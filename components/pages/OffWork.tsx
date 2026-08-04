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
  const [at, setAt] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (calmMode()) {
      setReduced(true);
      return;
    }
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const n = OBSESSIONS.length;
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const local = Math.min(self.progress * n, n - 0.0001);
          const step = Math.floor(local);
          const frac = local - step;
          // hold, then morph over the last stretch of each subject's span
          const morph = frac <= HOLD ? 0 : (frac - HOLD) / (1 - HOLD);
          const eased = morph * morph * (3 - 2 * morph);

          world.blendLock = Math.min(HOBBY_SHAPE + step + eased, HOBBY_SHAPE + n - 1);
          world.blend = world.blendLock;

          // the word changes halfway through the morph, with the shape
          setAt(Math.min(n - 1, step + (eased > 0.5 ? 1 : 0)));
        },
        onToggle: (self) => {
          if (!self.isActive) world.blendLock = null;
        },
      });
    }, section);
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

            <div className="relative mt-4 h-[16vw] min-h-[86px] md:h-[6.2vw]">
              {OBSESSIONS.map((o, i) => (
                <h2
                  key={o.key}
                  aria-hidden={i !== at}
                  className="absolute inset-0 whitespace-nowrap font-display text-[14vw] font-extrabold leading-[0.9] tracking-tight transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:text-[5.9vw]"
                  style={{
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
function Hand() {
  const n = SOCIAL_CARDS.length;

  return (
    <section aria-label="Elsewhere" className="relative px-5 pb-[16vh] pt-[6vh] md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel index="04" title="Find me elsewhere" />

        <div className="flex min-h-[320px] items-end justify-center pb-6 md:min-h-[380px]">
          <div className="group/hand relative flex h-[260px] w-full max-w-[760px] items-end justify-center md:h-[300px]">
            {SOCIAL_CARDS.map((s, i) => {
              const mid = (n - 1) / 2;
              const lean = (i - mid) * 9;
              const lift = Math.abs(i - mid) * 14;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  data-cursor={s.todo ? "SOON" : "OPEN"}
                  aria-disabled={s.todo || undefined}
                  className="group absolute bottom-0 h-[230px] w-[150px] origin-bottom rounded-md border border-ink/20 bg-void/85 p-4 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-20 hover:-translate-y-8 hover:!rotate-0 hover:border-ink/45 md:h-[270px] md:w-[176px]"
                  style={{
                    transform: `rotate(${lean}deg) translateY(${lift}px)`,
                    left: `calc(50% + ${(i - mid) * 74}px - 75px)`,
                    zIndex: i,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{ background: s.tint }}
                  />
                  <span className="mt-4 block font-display text-lg font-bold leading-tight text-ink md:text-xl">
                    {s.label}
                  </span>
                  <span className="mt-1 block break-words font-mono text-[9px] uppercase tracking-[0.18em] text-ink/60">
                    {s.todo ? "Link to come" : s.handle}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-4 left-4 font-mono text-[10px] text-ink/45 transition-colors duration-300 group-hover:text-ember"
                  >
                    ↗
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-ink/50">
          Hover a card
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

      <Cycle />

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

      <Hand />
    </>
  );
}
