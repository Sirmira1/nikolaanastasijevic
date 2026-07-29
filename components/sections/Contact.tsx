"use client";

import { useEffect, useState } from "react";
import { EMAIL, SOCIALS } from "@/lib/data";
import { SectionLabel, RevealLines, Line, Rise } from "@/components/ui/Split";
import Magnetic from "@/components/ui/Magnetic";

function LocalTime() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Toronto",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time} ET</span>;
}

export default function Contact() {
  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 2.2, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="talk"
      data-shape
      aria-label="Contact"
      className="relative flex min-h-[100svh] flex-col justify-between px-5 pb-8 pt-[18vh] md:px-10"
    >
      {/* the portal ring is the brightest thing on the site — this keeps the
          type over it readable without smothering the ring itself */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,7,11,0.62)_0%,rgba(8,7,11,0.2)_26%,rgba(8,7,11,0.34)_60%,rgba(8,7,11,0.9)_100%)]"
      />

      <div className="mx-auto w-full max-w-[1400px]">
        <SectionLabel index="06" title="Transmission — open channel" />
      </div>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center gap-14 text-center">
        <RevealLines className="font-display text-[11.5vw] font-extrabold leading-[0.98] tracking-tight text-ink md:text-[7.5vw]" start="top 90%">
          <Line>LET&rsquo;S BUILD</Line>
          <Line>
            <span className="font-serif font-normal italic text-ember">something</span>
          </Line>
          <Line>REAL</Line>
        </RevealLines>

        <Rise delay={0.2}>
          <Magnetic strength={0.45}>
            <a
              href={`mailto:${EMAIL}`}
              data-cursor="SEND"
              className="group relative flex h-40 w-40 items-center justify-center rounded-full border border-ink/40 bg-void/75 backdrop-blur-[3px] transition-colors duration-500 hover:border-ember md:h-48 md:w-48"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 scale-0 rounded-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
              />
              <span className="relative z-10 font-mono text-[11px] uppercase tracking-[0.3em] text-ink transition-colors duration-500 group-hover:text-void">
                SAY HELLO
                <span aria-hidden="true" className="mt-1 block text-base tracking-normal">↗</span>
              </span>
            </a>
          </Magnetic>
        </Rise>

        <Rise delay={0.3} className="flex flex-col items-center gap-2 font-mono text-xs text-dim">
          <a href={`mailto:${EMAIL}`} className="group relative text-ink transition-colors hover:text-ember">
            {EMAIL}
            <span className="absolute -bottom-1 left-0 block h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
          </a>
          <span className="text-[10px] uppercase tracking-[0.25em] text-ink/75">
            Usually replies within 24h — open to co-ops, freelance builds & good problems
          </span>
        </Rise>

        <Rise delay={0.4}>
          <button
            onClick={() => window.dispatchEvent(new Event("open-guestbook"))}
            data-cursor="SIGN"
            className="group flex items-center gap-4 border border-ink/35 bg-void/70 px-8 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/85 backdrop-blur-[3px] transition-all duration-500 hover:border-ember hover:bg-void/85 hover:text-ink"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ember transition-transform duration-500 group-hover:scale-150" />
            You&rsquo;ve seen my signature — leave yours
          </button>
        </Rise>
      </div>

      <footer className="mx-auto mt-[12vh] w-full max-w-[1400px] border-t border-ink/20 py-6">
        <div className="flex flex-col items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/75 md:flex-row">
          <span>© 2026 NIKOLA ANASTASIJEVIĆ</span>
          <nav aria-label="Social links" className="flex gap-6">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group relative transition-colors hover:text-ink"
              >
                {s.label}
                <span className="absolute -bottom-0.5 left-0 block h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <span className="flex items-center gap-4">
            <span>
              HAMILTON, ONTARIO, CANADA — <LocalTime />
            </span>
            <a href="#top" onClick={toTop} data-cursor="TOP" className="text-ink transition-colors hover:text-ember">
              ↑ TOP
            </a>
          </span>
        </div>
        <p className="mt-3 flex flex-col gap-1 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50 md:flex-row md:justify-between md:text-left">
          <span>Designed & built by hand — no templates were harmed</span>
          <span>
            COLOPHON: NEXT.JS · R3F · GLSL · GSAP · WEB AUDIO · 16,384 PARTICLES ·
            SYNE / INSTRUMENT / PLEX MONO
          </span>
        </p>
      </footer>
    </section>
  );
}
