"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { world } from "@/lib/world";
import { calmMode } from "@/lib/calm";

gsap.registerPlugin(ScrollTrigger);

/**
 * A pinned stage that steps through a set of subjects, one at a time, with the
 * particle field holding a silhouette of whichever one you are looking at.
 * Scrolling into cars builds a race car out of the stars; scrolling into AI
 * builds a model. The word, the aside and the field all change together.
 *
 * Each subject holds its shape for most of its span and only morphs near the
 * boundary, so the field is actually *being* the object rather than smearing
 * between two of them the whole way down. The word flips mid-morph, so it and
 * the shape land together.
 */
const HOLD = 0.74;

export type CycleItem = {
  key: string;
  label: string;
  lead: string;
  tags?: readonly string[];
  accent: string;
};

export default function ShapeCycle<T extends CycleItem>({
  items,
  shapeBase,
  label,
  aside,
  asideAspect = "4 / 3",
  fallback,
}: {
  items: readonly T[];
  /** index in SHAPES of this set's first silhouette */
  shapeBase: number;
  /** what the section is called, for anyone not looking at it */
  label: string;
  /** the right-hand column, rendered once per subject and cross-faded */
  aside: (item: T, i: number) => ReactNode;
  asideAspect?: string;
  /** the flat, unpinned version, for anyone who asked for less motion */
  fallback: (item: T) => ReactNode;
}) {
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
  }, [reduced]);

  useEffect(() => {
    if (calmMode()) {
      setReduced(true);
      return;
    }
    const section = sectionRef.current;
    if (!section) return;

    const n = items.length;

    /**
     * One driver for the whole page rather than one for the pinned section.
     * Held only while pinned, the field fell back to the page's section blend
     * either side of it — which sits nowhere near these formations, so
     * arriving sprinted through every unrelated shape in between and leaving
     * snapped straight back. This is a continuous function of scroll from the
     * top of the page to the bottom: the first shape before the cycle, the
     * cycle through it, and the last one held afterwards.
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
      const lock = Math.min(step + eased, n - 1);

      // Nothing below the cycle wants a different shape, so the field simply
      // stays where the tour left it. Walking it back would mean crossing
      // every formation again on whatever scroll happened to be left — which
      // is the same scramble, just at the other end.

      world.blendLock = shapeBase + lock;
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

    // and immediately, so the page opens on its own first shape rather than on
    // whatever formation the previous page left behind
    drive();
    return () => {
      ctx.revert();
      world.blendLock = null;
    };
  }, [items, shapeBase]);

  // the field takes the colour of whatever is on screen
  useEffect(() => {
    if (reduced) return;
    world.accent = items[at].accent;
    return () => {
      world.accent = null;
    };
  }, [at, reduced, items]);

  if (reduced) {
    return (
      <section aria-label={label} className="relative px-5 py-[14vh] md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-2">
          {items.map((it) => (
            <div key={it.key} className="group">
              {fallback(it)}
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
      aria-label={label}
      style={{ height: `${items.length * 90 + 10}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-[100svh] items-center px-5 md:px-10">
        <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 md:grid-cols-[1.2fr_1fr] md:gap-14">
          {/* the word */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember">
              {String(at + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>

            <div
              ref={wordRef}
              className="relative mt-4 overflow-hidden [--word:15vw] md:[--word:6.4vw]"
              style={{ height: "calc(var(--word) * 1.02)" }}
            >
              {items.map((it, i) => (
                <h2
                  key={it.key}
                  data-word
                  aria-hidden={i !== at}
                  className="absolute bottom-0 left-0 w-max whitespace-nowrap font-display font-extrabold leading-[0.9] tracking-tight transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    fontSize: "calc(var(--word) * var(--fit, 1))",
                    color: i === at ? it.accent : "transparent",
                    opacity: i === at ? 1 : 0,
                    transform: `translateY(${(i - at) * 22}%)`,
                  }}
                >
                  {it.label}
                </h2>
              ))}
            </div>

            <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-ink/80 md:text-base">
              {items[at].lead}
            </p>

            {!!items[at].tags?.length && (
              <ul role="list" className="mt-7 flex flex-wrap gap-2">
                {items[at].tags!.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-ink/25 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/75"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}

            {/* which one you are on */}
            <div aria-hidden="true" className="mt-10 flex gap-2">
              {items.map((it, i) => (
                <span
                  key={it.key}
                  className="h-px transition-all duration-500"
                  style={{
                    width: i === at ? 42 : 18,
                    background: i === at ? it.accent : "rgba(236,231,223,0.3)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* the aside, stacked and cross-fading */}
          <div className="relative w-full" style={{ aspectRatio: asideAspect }}>
            {items.map((it, i) => (
              <div
                key={it.key}
                aria-hidden={i !== at}
                className="absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: i === at ? 1 : 0,
                  pointerEvents: i === at ? undefined : "none",
                  transform: `scale(${i === at ? 1 : 1.06}) translateY(${(i - at) * 4}%)`,
                }}
              >
                {aside(it, i)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
