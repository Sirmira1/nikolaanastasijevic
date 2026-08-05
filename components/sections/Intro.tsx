"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { world } from "@/lib/world";
import { calmMode } from "@/lib/calm";

gsap.registerPlugin(ScrollTrigger);

/**
 * The opening rite. Scrolling resolves Nikola's signature from particle
 * dust before the field leaves for the galaxy.
 */
export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const beginRef = useRef<HTMLDivElement>(null);

  // fly through the signature for people who'd rather watch than scroll
  const begin = () => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo("#hero", {
        duration: 2.8,
        easing: (t: number) => 1 - Math.pow(1 - t, 2.2),
      });
    } else {
      document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = calmMode();

    if (reduced) {
      world.markDraw = 1;
      if (captionRef.current) captionRef.current.style.opacity = "1";
      if (identityRef.current) identityRef.current.style.opacity = "1";
      return;
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        const draw = gsap.utils.clamp(0, 1, (p - 0.015) / 0.7);
        world.markDraw = draw;

        // the caption dissolves as the particles depart
        const fadeOut = 1 - gsap.utils.clamp(0, 1, (p - 0.82) / 0.085);
        if (captionRef.current) {
          const fadeIn = gsap.utils.clamp(0, 1, (p - 0.53) / 0.16);
          captionRef.current.style.opacity = `${fadeIn * fadeOut}`;
        }
        if (identityRef.current) {
          const identityFade = 1 - gsap.utils.clamp(0, 1, (p - 0.77) / 0.085);
          identityRef.current.style.opacity = `${identityFade}`;
        }

        // the begin button retires as soon as the visitor takes over
        if (beginRef.current) {
          const gone = p > 0.03;
          beginRef.current.style.opacity = gone ? "0" : "1";
          beginRef.current.style.pointerEvents = gone ? "none" : "auto";
        }
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section
      id="top"
      data-shape
      data-shape-anchor="0.82"
      ref={sectionRef}
      aria-label="Signature"
      className="relative h-[290vh] md:h-[320vh]"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col px-5 pb-5 pt-20 md:px-10 md:pb-8 md:pt-24">
        <div className="pointer-events-none flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.28em] text-ink/45 md:text-[10px]">
          <span>Portfolio / 2026</span>
          <span className="hidden sm:inline">16,384 particles / one continuous world</span>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <div
            ref={captionRef}
            className="absolute bottom-2 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-dim opacity-0 md:text-[10px]"
          >
            Signature
            <span className="mx-3 text-ember">/</span>
            2026
          </div>
        </div>

        <div
          ref={identityRef}
          className="grid w-full grid-cols-[1fr_auto] items-end gap-x-5 gap-y-3 border-t border-line pt-4 transition-opacity md:grid-cols-[1fr_1.2fr_auto] md:gap-10 md:pt-5"
        >
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-ember md:text-[10px]">
              Software Developer
            </span>
            {/* not a heading: this is the entry card, and the page's own
                heading is the hero underneath it — an h2 here only put a
                second, earlier heading above the h1 */}
            <p className="mt-1 font-display text-xl font-bold leading-none text-ink sm:text-2xl md:text-4xl">
              Nikola Anastasijević
            </p>
          </div>

          <p className="col-span-2 max-w-xl font-mono text-[10px] leading-relaxed text-dim sm:text-xs md:col-span-1">
            Full-stack products, mobile apps, and immersive web experiences —
            designed and built from interface to deployment.
          </p>

          <div ref={beginRef} className="row-start-1 justify-self-end transition-opacity duration-500 md:col-start-3">
            <button
              onClick={begin}
              data-cursor="GO"
              className="group flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.28em] text-dim transition-colors hover:text-ink md:text-[10px]"
              aria-label="Enter portfolio"
            >
              <span className="hidden sm:inline">Enter</span>
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink/25 transition-colors duration-300 group-hover:border-ember">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-ping rounded-full border border-ember/35 [animation-duration:2.4s]"
                />
                <span aria-hidden="true" className="text-sm text-ember">↓</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
