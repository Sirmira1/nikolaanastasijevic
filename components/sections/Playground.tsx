"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPERIMENTS, type Experiment } from "@/lib/data";
import { world } from "@/lib/world";
import { calmMode } from "@/lib/calm";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

/**
 * The gallery is laid out as columns, not a single row: some hold one large
 * plate, some hold two stacked small ones, and every column sits at its own
 * height with its own depth. `depth` is how fast the column travels against
 * the track — above 1 is foreground, below 1 is background — which is what
 * gives the wall its parallax as it goes past.
 *
 * The pattern repeats, so adding experiments to EXPERIMENTS is all it takes
 * to extend the wall; nothing here needs to change.
 */
type Column = {
  take: 1 | 2;
  width: string;
  drop: string;
  depth: number;
};

const COLUMNS: Column[] = [
  { take: 1, width: "clamp(260px, 30vw, 520px)", drop: "-3vh", depth: 1.0 },
  { take: 2, width: "clamp(170px, 19vw, 320px)", drop: "3vh", depth: 1.09 },
  { take: 1, width: "clamp(215px, 25vw, 430px)", drop: "8vh", depth: 0.92 },
  { take: 2, width: "clamp(160px, 18vw, 300px)", drop: "-6vh", depth: 1.06 },
  { take: 1, width: "clamp(285px, 34vw, 580px)", drop: "2vh", depth: 0.95 },
  { take: 1, width: "clamp(180px, 21vw, 340px)", drop: "-9vh", depth: 1.08 },
];

/**
 * Parallax is measured from the middle of the screen, not from how far the
 * track has travelled: a column leads or trails by how far it is from the
 * centre right now, so the offset stays bounded however long the wall gets.
 * Unbounded, deep columns march clean across their neighbours.
 */
const PARALLAX = 0.45;

const ASPECTS = ["4 / 3", "3 / 4", "1 / 1", "5 / 4", "4 / 5"];

/**
 * Titles are sized against their own plate rather than the viewport, and the
 * limit is the longest *word*: wrapping cannot rescue a single long one, so
 * THE OBSERVATORY ran off the narrow columns at any fixed size. Roughly
 * 72cqw of room per character of the longest word, capped so short titles
 * stay a sensible size.
 */
function titleSize(title: string) {
  const longest = title.split(/\s+/).reduce((n, w) => Math.max(n, w.length), 1);
  return `clamp(0.8rem, ${Math.min(8.4, 72 / longest).toFixed(2)}cqw, 3rem)`;
}

/** Slices the experiments into columns following the repeating pattern. */
function toColumns(items: Experiment[]) {
  const out: { spec: Column; items: Experiment[] }[] = [];
  let i = 0;
  let c = 0;
  while (i < items.length) {
    const spec = COLUMNS[c % COLUMNS.length];
    const take = Math.min(spec.take, items.length - i);
    out.push({ spec, items: items.slice(i, i + take) });
    i += take;
    c++;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  A plate                                                            */
/* ------------------------------------------------------------------ */

function Plate({ e, aspect }: { e: Experiment; aspect: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const tilt = (ev: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width - 0.5;
    const y = (ev.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: x * 9,
      rotateX: -y * 9,
      scale: 1.02,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 900,
    });
  };
  const untilt = () => {
    if (ref.current)
      gsap.to(ref.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.9, ease: "elastic.out(1,0.45)" });
  };

  const body = (
    <figure data-lab-card className="group block w-full" style={{ containerType: "inline-size" }}>
      <figcaption className="mb-2 flex items-baseline gap-2 font-mono text-[9px] uppercase tracking-[0.26em] text-ink/60 transition-colors duration-300 group-hover:text-ink md:text-[10px]">
        <span className="shrink-0 text-ember">{e.index}</span>
        <span className="truncate">{e.medium}</span>
      </figcaption>

      <div
        ref={ref}
        onPointerMove={tilt}
        onPointerLeave={untilt}
        data-cursor={e.href ? "VISIT" : "LOOK"}
        className="relative w-full overflow-hidden rounded-sm border border-ink/15 will-change-transform"
        style={{ aspectRatio: aspect, transformStyle: "preserve-3d" }}
      >
        {e.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={e.image}
              alt={e.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, ${e.gradient[0]}aa, transparent 55%), linear-gradient(to top, ${e.gradient[0]}e6 0%, transparent 60%)`,
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-[900ms] group-hover:scale-[1.07]"
            style={{
              background: `radial-gradient(circle at 30% 25%, ${e.gradient[1]}66, transparent 60%), radial-gradient(circle at 75% 80%, ${e.gradient[1]}33, transparent 55%), linear-gradient(155deg, ${e.gradient[0]}, #08070b 90%)`,
            }}
          />
        )}

        <span
          aria-hidden="true"
          className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full"
          style={{ background: e.gradient[1] }}
        />

        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <h3
            className="font-display font-extrabold leading-[0.92] tracking-tight text-ink"
            style={{ fontSize: titleSize(e.title) }}
          >
            {e.title}
          </h3>
        </div>
      </div>
    </figure>
  );

  return e.href ? (
    <a href={e.href} target="_blank" rel="noreferrer" className="block w-full">
      {body}
    </a>
  ) : (
    body
  );
}

/* ------------------------------------------------------------------ */
/*  The section                                                        */
/* ------------------------------------------------------------------ */

export default function Playground() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const sideCueRef = useRef<HTMLSpanElement>(null);
  const downCueRef = useRef<HTMLSpanElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(false);

  const columns = toColumns(EXPERIMENTS);

  /** card centres along the track — measured on refresh, never per frame */
  const centres = useRef<number[]>([]);
  const span = useRef(1);
  /** one setter per parallax column, plus the background layers */
  const setters = useRef<{ set: (v: number) => void; depth: number; centre: number }[]>([]);
  const bg = useRef<{ rules?: (v: number) => void; ghost?: (v: number) => void }>({});

  /**
   * Reads the wall's natural geometry. offsetLeft is no use here — the
   * columns carry transforms, which makes each one the offsetParent of its
   * own cards, so every card reports 0. So: neutralise the parallax, measure
   * against the track's own box, and divide out whatever scale the entrance
   * happens to be holding.
   */
  const measure = () => {
    const track = trackRef.current;
    if (!track) return;
    const cols = Array.from(track.querySelectorAll<HTMLElement>("[data-depth]"));
    // force3D on the way in: quickSetter writes a plain 2D translate
    // otherwise, and every settle rebuilds the layer on a whole pixel —
    // which is the stutter you feel when creeping through the wall
    for (const el of cols) gsap.set(el, { x: 0, force3D: true });

    const box = track.getBoundingClientRect();
    const scale = track.offsetWidth ? box.width / track.offsetWidth : 1;
    const local = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return (r.left - box.left + r.width / 2) / (scale || 1);
    };

    centres.current = Array.from(
      track.querySelectorAll<HTMLElement>("[data-lab-card]")
    ).map(local);
    span.current = Math.max(track.scrollWidth - window.innerWidth, 1);

    setters.current = cols.map((el) => ({
      set: gsap.quickSetter(el, "x", "px") as (v: number) => void,
      depth: parseFloat(el.dataset.depth || "1"),
      centre: local(el),
    }));
    if (rulesRef.current)
      bg.current.rules = gsap.quickSetter(rulesRef.current, "x", "px") as (v: number) => void;
    if (ghostRef.current)
      bg.current.ghost = gsap.quickSetter(ghostRef.current, "x", "px") as (v: number) => void;
  };

  /**
   * Everything downstream of horizontal progress: the parallax columns, the
   * two background layers, the orientation strip, and the world state the
   * particle field reads so the background turns while you travel sideways.
   */
  const report = (p: number) => {
    const t = Math.max(0, Math.min(1, p));
    const x = -t * span.current;

    const mid = window.innerWidth / 2;
    for (const s of setters.current) s.set((s.centre + x - mid) * (s.depth - 1) * PARALLAX);
    bg.current.rules?.(x * 0.35);
    bg.current.ghost?.(x * 0.12);

    world.labProgress = t;

    if (fillRef.current) fillRef.current.style.transform = `scaleX(${t})`;

    const marks = centres.current;
    if (countRef.current && marks.length) {
      const eye = t * span.current + window.innerWidth / 2;
      let at = 0;
      let best = Infinity;
      for (let i = 0; i < marks.length; i++) {
        const d = Math.abs(marks[i] - eye);
        if (d < best) {
          best = d;
          at = i;
        }
      }
      countRef.current.textContent = `${String(at + 1).padStart(2, "0")} / ${String(marks.length).padStart(2, "0")}`;
    }

    const ending = t > 0.8 ? 1 : 0;
    if (sideCueRef.current) sideCueRef.current.style.opacity = `${1 - ending}`;
    if (downCueRef.current) downCueRef.current.style.opacity = `${ending}`;
  };

  const toTalk = (e: React.MouseEvent) => {
    e.preventDefault();
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo("#talk", { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    else document.querySelector("#talk")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (calmMode()) {
      setReduced(true);
      const scroller = scrollerRef.current;
      if (!scroller) return;
      measure();
      if (stripRef.current) stripRef.current.style.opacity = "1";
      const onScroll = () =>
        report(scroller.scrollLeft / Math.max(scroller.scrollWidth - scroller.clientWidth, 1));
      scroller.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => scroller.removeEventListener("scroll", onScroll);
    }

    const section = sectionRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!section || !track || !stage) return;

    const ctx = gsap.context(() => {
      // the hand-off: the wall rises into place over the approach, so the
      // pin engages on something already in motion instead of snapping on
      gsap.fromTo(
        stage,
        { yPercent: 9, scale: 0.965, autoAlpha: 0.35 },
        {
          yPercent: 0,
          scale: 1,
          autoAlpha: 1,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        }
      );

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        // lenis already smooths the input; a scrub duration on top of it is
        // what made slow scrolling stutter, and force3D keeps the layer from
        // being rebuilt (and rounded to whole pixels) every time it settles
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => report(self.progress),
          onRefresh: (self) => {
            measure();
            report(self.progress);
          },
          onToggle: (self) => {
            world.labActive = self.isActive;
            // The strip is anchored to the bottom of the section, so once the
            // pin lets go it rides up through the page as a full-width rule.
            // It belongs to the traverse: it exists while the wall does.
            if (stripRef.current) stripRef.current.style.opacity = self.isActive ? "1" : "0";
          },
        },
      });
    }, section);

    return () => {
      ctx.revert();
      world.labActive = false;
      world.labProgress = 0;
    };
  }, []);

  return (
    <section
      id="lab"
      data-shape
      ref={sectionRef}
      aria-label="Creative experiments"
      className="relative overflow-hidden"
    >
      {/* background plates — they travel at their own rates, so the room
          behind the work moves too */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          ref={ghostRef}
          className="absolute left-[8vw] top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[34vw] font-extrabold leading-none tracking-tighter text-ink/[0.035] will-change-transform"
        >
          THE LAB
        </span>
        <div
          ref={rulesRef}
          className="absolute inset-y-0 left-0 w-[400vw] will-change-transform"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(236,231,223,0.075) 0 1px, transparent 1px 14vw)",
          }}
        />
      </div>

      <div
        ref={scrollerRef}
        className={`relative flex h-[100svh] items-center ${reduced ? "overflow-x-auto" : ""}`}
      >
        <div
          ref={stageRef}
          className="flex h-full w-max items-center will-change-transform"
        >
          <div
            ref={trackRef}
            className="flex h-full w-max items-center gap-[7vw] px-[6vw] will-change-transform md:gap-[5.5vw]"
          >
            {/* opening slate */}
            <div className="flex w-[74vw] shrink-0 flex-col justify-center gap-6 sm:w-[42vw] lg:w-[26vw]">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs tracking-[0.25em] text-ember">05</span>
                <span className="h-px w-12 bg-ink/25" />
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
                  The lab
                </span>
              </div>
              <h2 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-ink md:text-6xl">
                BUILT
                <br />
                AT <span className="font-serif italic text-ember">2AM</span>
              </h2>
              <p className="max-w-xs font-mono text-sm leading-relaxed text-dim">
                I use the lab to change visual languages completely: soft,
                minimal, casual, professional, noir, or fully three-dimensional.
                The style follows the project, not a template.
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/70">
                Keep scrolling <span className="text-ember">→</span>
              </p>
            </div>

            {columns.map((col, ci) => (
              <div
                key={ci}
                data-depth={col.spec.depth}
                className="flex shrink-0 flex-col justify-center gap-[3vh] will-change-transform"
                style={{ width: col.spec.width, marginTop: col.spec.drop }}
              >
                {col.items.map((e, ii) => (
                  <Plate
                    key={e.index}
                    e={e}
                    aspect={ASPECTS[(ci + ii * 2) % ASPECTS.length]}
                  />
                ))}
              </div>
            ))}

            {/* closing slate — hands the visitor on rather than signing off */}
            <div className="flex w-[74vw] shrink-0 flex-col items-center justify-center gap-8 sm:w-[38vw] lg:w-[26vw]">
              <p className="max-w-[24ch] text-center font-serif text-2xl italic leading-snug text-dim">
                Same developer. A completely different atmosphere every time.
              </p>
              <a
                href="#talk"
                onClick={toTalk}
                data-cursor="NEXT"
                className="group flex flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/80 transition-colors hover:text-ink"
              >
                <span>
                  Next <span className="text-ember">06</span> — Transmission
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/30 text-sm transition-colors duration-300 group-hover:border-ember group-hover:text-ember"
                >
                  ↓
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* pinned with the section: proof that the page is still moving */}
      <div
        ref={stripRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-void via-void/85 to-transparent px-5 pb-5 pt-10 opacity-0 transition-opacity duration-300 md:px-10 md:pb-7"
      >
        <div className="flex items-end justify-between gap-6 font-mono text-[9px] uppercase tracking-[0.28em] text-ink/70 md:text-[10px]">
          <span className="flex items-center gap-3">
            <span className="text-ember">05</span>
            <span className="hidden sm:inline">The lab</span>
            <span ref={countRef} className="text-ink/50" aria-hidden="true">
              01 / {String(EXPERIMENTS.length).padStart(2, "0")}
            </span>
          </span>

          <span className="relative grid text-right">
            <span ref={sideCueRef} className="col-start-1 row-start-1 transition-opacity duration-300">
              Scroll <span className="text-ember">→</span>
            </span>
            <span
              ref={downCueRef}
              className="col-start-1 row-start-1 text-ink opacity-0 transition-opacity duration-300"
            >
              <span className="hidden sm:inline">Keep going — </span>06 Transmission{" "}
              <span className="text-ember">↓</span>
            </span>
          </span>
        </div>

        <span
          aria-hidden="true"
          className="mt-3 block h-[2px] w-full bg-ink/15"
          style={{
            maskImage: "linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)",
          }}
        >
          <span
            ref={fillRef}
            className="block h-[2px] w-full origin-left scale-x-0 bg-ember will-change-transform"
            style={{ boxShadow: "0 0 10px rgba(255,92,40,0.55)" }}
          />
        </span>
      </div>
    </section>
  );
}
