"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPERIMENTS } from "@/lib/data";
import { calmMode } from "@/lib/calm";

gsap.registerPlugin(ScrollTrigger);

function ExperimentCard({ e }: { e: (typeof EXPERIMENTS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);

  const tilt = (ev: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width - 0.5;
    const y = (ev.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: x * 10,
      rotateX: -y * 10,
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

  const inner = (
    <div
      ref={ref}
      onPointerMove={tilt}
      onPointerLeave={untilt}
      data-cursor="PLAY"
      data-lab-card
      className="group relative h-[58vh] w-[78vw] shrink-0 overflow-hidden rounded-sm border border-line will-change-transform sm:w-[46vw] lg:w-[30vw]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {e.image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={e.image}
            alt={e.title}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(155deg, ${e.gradient[0]}cc, transparent 60%), linear-gradient(to top, ${e.gradient[0]}dd 0%, transparent 55%)`,
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{
            background: `radial-gradient(circle at 30% 25%, ${e.gradient[1]}66, transparent 60%), radial-gradient(circle at 75% 80%, ${e.gradient[1]}33, transparent 55%), linear-gradient(155deg, ${e.gradient[0]}, #08070b 90%)`,
          }}
        />
      )}
      {/* drifting light bar */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-full inset-y-0 opacity-0 transition-opacity duration-500 group-hover:opacity-40"
        style={{
          background: `linear-gradient(105deg, transparent 45%, ${e.gradient[1]}88 50%, transparent 55%)`,
          animation: "marquee 3.2s linear infinite",
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-ink/70">
          <span>{e.index}</span>
          <span className="h-2 w-2 rounded-full transition-colors duration-300" style={{ background: e.gradient[1] }} />
        </div>
        <div>
          <h3 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
            {e.title}
          </h3>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60">
            {e.medium}
          </p>
        </div>
      </div>
    </div>
  );

  if (e.href) {
    return (
      <a href={e.href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }
  return inner;
}

export default function Playground() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const sideCueRef = useRef<HTMLSpanElement>(null);
  const downCueRef = useRef<HTMLSpanElement>(null);
  /** card centres along the track, measured once — reading them per frame
   *  would force a layout on every scroll tick */
  const centresRef = useRef<number[]>([]);
  const spanRef = useRef(0);
  const [reduced, setReduced] = useState(false);

  /**
   * While this section is pinned the page stops moving vertically, and the
   * track ends on a closing line — between them, people read it as the bottom
   * of the site and leave. So the pin carries its own progress: a bar that
   * fills, a count that climbs, and a cue that turns from "sideways" to
   * "there is more below" as the track runs out.
   */
  const measure = () => {
    const track = trackRef.current;
    if (!track) return;
    centresRef.current = Array.from(
      track.querySelectorAll<HTMLElement>("[data-lab-card]")
    ).map((el) => el.offsetLeft + el.offsetWidth / 2);
    spanRef.current = Math.max(track.scrollWidth - window.innerWidth, 1);
  };

  const report = (p: number) => {
    const clamped = Math.max(0, Math.min(1, p));
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${clamped})`;

    const centres = centresRef.current;
    if (countRef.current && centres.length) {
      // whichever card is nearest the middle of the screen right now
      const eye = clamped * spanRef.current + window.innerWidth / 2;
      let at = 0;
      let best = Infinity;
      for (let i = 0; i < centres.length; i++) {
        const d = Math.abs(centres[i] - eye);
        if (d < best) {
          best = d;
          at = i;
        }
      }
      const n = centres.length;
      countRef.current.textContent = `${String(at + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
    }
    const ending = clamped > 0.78 ? 1 : 0;
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
      const onScroll = () =>
        report(scroller.scrollLeft / Math.max(scroller.scrollWidth - scroller.clientWidth, 1));
      scroller.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => scroller.removeEventListener("scroll", onScroll);
    }
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          // tighter than a full second: the lag is what makes a pinned
          // section feel stuck rather than driven
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => report(self.progress),
          onRefresh: (self) => {
            measure();
            report(self.progress);
          },
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="lab"
      data-shape
      ref={sectionRef}
      aria-label="Creative experiments"
      className="relative overflow-hidden"
    >
      <div
        ref={scrollerRef}
        className={`flex h-[100svh] items-center ${reduced ? "overflow-x-auto" : ""}`}
      >
        <div ref={trackRef} className="flex w-max items-center gap-6 px-5 md:gap-10 md:px-10">
          {/* opening slate */}
          <div className="flex w-[80vw] shrink-0 flex-col justify-center gap-6 sm:w-[46vw] lg:w-[26vw]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs tracking-[0.25em] text-ember">05</span>
              <span className="h-px w-12 bg-ink/20" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">The lab</span>
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
          </div>

          {EXPERIMENTS.map((e) => (
            <ExperimentCard key={e.index} e={e} />
          ))}

          {/* closing slate — hands the visitor on rather than signing off */}
          <div
            data-closing-slate
            className="flex w-[70vw] shrink-0 flex-col items-center justify-center gap-8 sm:w-[34vw]"
          >
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

      {/* pinned with the section: proof that the page is still moving */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-void via-void/85 to-transparent px-5 pb-5 pt-10 md:px-10 md:pb-7">
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

        <span aria-hidden="true" className="mt-3 block h-[2px] w-full bg-ink/15">
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
