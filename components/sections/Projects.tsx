"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { MORE_WORK, PROJECTS } from "@/lib/data";
import { world } from "@/lib/world";
import { SectionLabel, Rise } from "@/components/ui/Split";

export default function Projects() {
  const [hovered, setHovered] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // cursor-following preview panel
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.6 });
  const y = useSpring(my, { stiffness: 140, damping: 18, mass: 0.6 });
  const tilt = useMotionValue(0);
  const rot = useSpring(tilt, { stiffness: 120, damping: 14 });
  const lastX = useRef(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  /**
   * Which row is hovered is decided by what is actually under the cursor, not
   * by enter/leave events. Those only fire when the *pointer* moves, so
   * scrolling the page out from under a still cursor left the preview stuck to
   * it; and scrolling quickly with the cursor over the list fired a burst of
   * them, flickering every row's dim state and the accent behind the section.
   * Above a walking pace the hover is simply held clear.
   */
  const syncHover = () => {
    const at = pointer.current;
    if (!at) return;
    const under = document.elementFromPoint(at.x, at.y) as HTMLElement | null;
    const row = under?.closest?.("[data-project]") as HTMLElement | undefined;
    setHovered(row ? Number(row.dataset.project) : null);
  };

  const onMove = (e: React.PointerEvent) => {
    const at = pointer.current;
    // the browser re-dispatches a pointermove at the same coordinates after a
    // scroll, to refresh :hover. That is the page moving, not the hand — and
    // treating it as a hover is half of what made this section flicker.
    const stationary = at !== null && at.x === e.clientX && at.y === e.clientY;
    pointer.current = { x: e.clientX, y: e.clientY };
    if (stationary) return;

    mx.set(e.clientX);
    my.set(e.clientY);
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    tilt.set(Math.max(-14, Math.min(14, dx * 0.6)));
    syncHover();
  };

  useEffect(() => {
    world.accent = hovered !== null ? PROJECTS[hovered].accent : null;
    return () => {
      world.accent = null;
    };
  }, [hovered]);

  /**
   * Scrolling may only ever *clear* a hover, never move it to another row.
   * Rows sliding past a still cursor are not something the visitor pointed
   * at: following them lit up and dimmed the whole list several times a
   * second on a fast scroll, and dragged the section's accent through the
   * particle field with it. Only the hand moving the pointer picks a row —
   * plus one resolve once the page comes to rest, which cannot flicker
   * because it happens once.
   */
  useEffect(() => {
    let queued = false;
    let settle: number | undefined;

    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(syncHover, 130);
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const at = pointer.current;
        if (!at) return;
        const under = document.elementFromPoint(at.x, at.y) as HTMLElement | null;
        const row = under?.closest?.("[data-project]") as HTMLElement | undefined;
        const idx = row ? Number(row.dataset.project) : null;
        setHovered((cur) => (cur === null || cur === idx ? cur : null));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a last resort: if the section leaves the viewport entirely, nothing in it
  // can be hovered
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setHovered(null);
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const active = hovered !== null ? PROJECTS[hovered] : null;

  return (
    <section
      id="work"
      data-shape
      ref={sectionRef}
      aria-label="Selected work"
      className="relative px-5 py-[20vh] md:px-10"
      onPointerMove={onMove}
      onPointerLeave={() => {
        pointer.current = null;
        setHovered(null);
      }}
    >
      <div className="section-veil" aria-hidden="true" />
      {/* ambient glow that adopts the hovered project's color */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: active
            ? `radial-gradient(ellipse 70% 55% at 50% 50%, ${active.accent}14, transparent 70%)`
            : undefined,
        }}
      />

      <div className="mx-auto max-w-[1400px]">
        <SectionLabel index="02" title="Selected work — 2023 → 2026" />

        <ul role="list">
          {PROJECTS.map((p, i) => {
            const isActive = hovered === i;
            const isDimmed = hovered !== null && !isActive;
            return (
              <li key={p.index} className="border-t border-line last:border-b">
                <Rise y={30} delay={i * 0.04}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="VISIT"
                    className="group block py-8 outline-offset-[-4px] md:py-10"
                    data-project={i}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                  >
                    {/*
                      Three columns on a desktop, where a title fits between
                      its index and its year. On a phone there is no room for
                      that: a grid track is min-width:auto, so a title wider
                      than its share does not wrap and does not shrink — it
                      shoves the year clean off the screen and takes its own
                      tail with it. The title gets a row of its own below the
                      meta instead, which is the better arrangement at that
                      width regardless.

                      9vw is set by TRADEBOT, the longest title with nowhere to
                      wrap: it fills the row at 9.44vw on a 360px screen, and
                      the ceiling falls as the viewport narrows because the
                      padding either side does not. The wrap rule is a net for
                      a future title longer still, not the mechanism.
                    */}
                    <div
                      className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-2 transition-opacity duration-500 md:grid-cols-[auto_1fr_auto] md:gap-x-10"
                      style={{ opacity: isDimmed ? 0.25 : 1 }}
                    >
                      <span className="order-1 font-mono text-[10px] tracking-[0.3em] text-dim md:order-none">
                        {p.index}
                      </span>
                      <h3
                        className={`text-stroke order-3 col-span-2 font-display text-[9vw] font-extrabold leading-[1.02] tracking-tight transition-all duration-500 [overflow-wrap:anywhere] md:order-none md:col-span-1 md:text-[6.5vw] ${
                          isActive ? "translate-x-3" : ""
                        }`}
                        style={isActive ? { color: p.accent, WebkitTextStroke: "0px" } : undefined}
                      >
                        {p.title}
                      </h3>
                      <span className="order-2 text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-dim md:order-none">
                        {p.year}
                        <br className="hidden md:block" />
                        <span className="hidden text-ink/60 md:inline">{p.role}</span>
                      </span>
                    </div>

                    {/* description drawer */}
                    <div
                      className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-wrap items-start justify-between gap-4 pt-6 pl-[calc(2.5rem)] md:pl-[calc(3.5rem+2.5vw)]">
                          <p className="max-w-md font-mono text-sm leading-relaxed text-ink/90">
                            {p.description}
                          </p>
                          <span className="flex gap-2">
                            {p.tags.map((t) => (
                              <span
                                key={t}
                                className="rounded-full border border-line px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-dim"
                              >
                                {t}
                              </span>
                            ))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </Rise>
              </li>
            );
          })}
        </ul>

        <Rise className="mt-10 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
          Everything above is live and clickable
        </Rise>

        <div className="mt-28 border-t border-line pt-8 md:mt-36">
          <div className="mb-14 grid gap-4 md:grid-cols-[1fr_2fr] md:items-end">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember">
              Beyond the selected four
            </span>
            {/*
              Set in the serif, not the display face. Syne draws its descenders
              as short blunt stubs — measured against a bare page at the same
              size, the g in "backlog" ends in twelve pixel rows of constant
              width and simply stops. Nothing here was clipping it, which is
              why no amount of line-height ever fixed it; the only cure is a
              face whose tails are actually drawn.
            */}
            <p className="max-w-2xl font-serif text-[1.75rem] leading-[1.35] text-ink md:text-[2.6rem]">
              The backlog moves between cars, maps, money, local businesses,
              and whatever I wish existed next.
            </p>
          </div>

          <div className="grid border-b border-line md:grid-cols-2">
            {MORE_WORK.map((item, i) => (
              <Rise
                key={item.title}
                delay={i * 0.05}
                className={`border-t border-line py-8 md:py-10 ${
                  i % 2 === 0 ? "md:pr-10" : "md:border-l md:pl-10"
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  <h3 className="font-display text-xl font-bold text-ink md:text-2xl">
                    {item.title}
                  </h3>
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/45">
                    {String(i + 5).padStart(3, "0")}
                  </span>
                </div>
                <p className="mt-4 max-w-lg font-mono text-sm leading-relaxed text-dim">
                  {item.detail}
                </p>
                <span className="mt-5 block font-mono text-[9px] uppercase tracking-[0.24em] text-ember/80">
                  {item.tools}
                </span>
              </Rise>
            ))}
          </div>
        </div>
      </div>

      {/* floating preview — follows the cursor, leans with its velocity */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[150] hidden lg:block"
        style={{ x, y, rotate: rot, translateX: "-50%", translateY: "-115%" }}
      >
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.index}
              initial={{ opacity: 0, scale: 0.7, clipPath: "inset(45% 0 45% 0)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0 0% 0)" }}
              exit={{ opacity: 0, scale: 0.85, clipPath: "inset(45% 0 45% 0)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-56 w-96 overflow-hidden rounded-sm border border-ink/10"
            >
              {active.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={active.image}
                    alt={active.title}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(160deg, ${active.gradient[0]}99, transparent 60%), linear-gradient(to top, ${active.gradient[0]}cc 0%, transparent 50%)` }}
                  />
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at 25% 20%, ${active.gradient[1]}cc, transparent 60%), radial-gradient(circle at 80% 85%, ${active.gradient[1]}66, transparent 55%), linear-gradient(160deg, ${active.gradient[0]}, #08070b 85%)`,
                    }}
                  />
                  <motion.div
                    className="absolute -inset-1/2 opacity-50 mix-blend-screen"
                    style={{
                      background: `conic-gradient(from 0deg at 50% 50%, transparent, ${active.gradient[1]}55, transparent 30%)`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                  />
                </>
              )}
              <div className="absolute inset-0 flex flex-col justify-between p-4 font-mono text-[9px] uppercase tracking-[0.25em] text-ink/90">
                <div className="flex justify-between">
                  <span>{active.index}</span>
                  <span>{active.year}</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-display text-xl font-bold tracking-normal">{active.title}</span>
                  <span>LIVE PREVIEW</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
