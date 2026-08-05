"use client";

import { useEffect, useState } from "react";
import { GARAGE, OBSESSIONS, RACING, SOCIAL_CARDS } from "@/lib/data";
import { HOBBY_SHAPE } from "@/lib/world";
import { SectionLabel, Rise, RevealLines, Line } from "@/components/ui/Split";
import ShapeCycle from "@/components/sections/ShapeCycle";
import Frame from "@/components/ui/Frame";

/* ------------------------------------------------------------------ */
/*  The cycle — one obsession at a time, the field taking its shape    */
/* ------------------------------------------------------------------ */

function Cycle() {
  return (
    <ShapeCycle
      items={OBSESSIONS}
      shapeBase={HOBBY_SHAPE}
      label="What I am into"
      aside={(o, i) => (
        <Frame src={o.image} alt={o.label} aspect="4 / 3" className="h-full" priority={i === 0} />
      )}
      fallback={(o) => (
        <>
          <Frame src={o.image} alt={o.label} aspect="4 / 3" />
          <h3 className="mt-4 font-display text-3xl font-extrabold text-ink">{o.label}</h3>
          <p className="mt-2 max-w-md font-mono text-sm leading-relaxed text-dim">{o.lead}</p>
        </>
      )}
    />
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
