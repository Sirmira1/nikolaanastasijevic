"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { audio } from "@/lib/audio";
import { calmChosen, toggleCalm } from "@/lib/calm";
import Magnetic from "@/components/ui/Magnetic";

const LINKS = [
  { n: "01", label: "WHO", href: "#about" },
  { n: "02", label: "WORK", href: "#work" },
  { n: "03", label: "CRAFT", href: "#craft" },
  { n: "04", label: "PATH", href: "#path" },
  { n: "05", label: "LAB", href: "#lab" },
  { n: "06", label: "TALK", href: "#talk" },
];

function Clock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Toronto",
    });
    const id = setInterval(() => setTime(fmt.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time}</span>;
}

export default function Header({ visible }: { visible: boolean }) {
  const [sound, setSound] = useState(false);
  const [calm, setCalm] = useState(false);
  useEffect(() => setCalm(calmChosen()), []);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(href, { duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[200]"
      initial={{ y: -60, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* the field runs bright under here — the bar keeps its own dark ground */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[190%] bg-gradient-to-b from-void via-void/70 to-transparent"
      />
      <div className="flex items-center justify-between px-5 py-5 md:px-8">
        <Magnetic strength={0.25}>
          <a
            href="#top"
            onClick={(e) => go(e, "#top")}
            className="whitespace-nowrap font-display text-sm font-bold tracking-[0.15em] text-ink"
            aria-label="Back to top"
          >
            N.A<span className="text-ember">—</span>26
          </a>
        </Magnetic>

        <nav aria-label="Sections" className="hidden items-center gap-5 lg:flex xl:gap-7">
          {LINKS.map((l) => (
            <a
              key={l.n}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              className="group font-mono text-[10px] uppercase tracking-[0.28em] text-ink/85 transition-colors hover:text-ink"
            >
              <span className="mr-1 text-ember">{l.n}</span>
              {l.label}
              <span className="mt-0.5 block h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <span className="hidden whitespace-nowrap font-mono text-[10px] tracking-[0.2em] text-ink/70 xl:inline">
            HAMILTON&nbsp;<Clock />
          </span>
          <Magnetic strength={0.4}>
            <button
              onClick={toggleCalm}
              className="hidden items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.28em] text-ink/85 transition-colors hover:text-ink sm:flex lg:hidden xl:flex"
              aria-pressed={calm}
              aria-label={calm ? "Turn effects back on" : "Calm mode: same content, no effects"}
              title={calm ? "Bring back the full experience" : "Same content, no effects"}
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full border border-ember transition-colors duration-300 ${
                  calm ? "bg-transparent" : "bg-ember"
                }`}
              />
              {calm ? "FULL MODE" : "CALM MODE"}
            </button>
          </Magnetic>
          <Magnetic strength={0.4}>
            <button
              onClick={() => window.dispatchEvent(new Event("open-terminal"))}
              className="hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.28em] text-ink/85 transition-colors hover:text-ink sm:inline lg:hidden xl:inline"
              aria-label="Open console"
            >
              <span className="text-ember">/</span>&nbsp;CONSOLE
            </button>
          </Magnetic>
          <Magnetic strength={0.4}>
            <button
              onClick={() => setSound(audio.toggle())}
              className="flex items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.28em] text-ink/85 transition-colors hover:text-ink"
              aria-pressed={sound}
              aria-label={sound ? "Mute sound" : "Enable sound"}
            >
              <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`w-[2px] bg-ember transition-all duration-300 ${
                      sound ? "animate-pulse" : ""
                    }`}
                    style={{
                      height: sound ? `${6 + i * 3}px` : "2px",
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </span>
              <span className="hidden sm:inline">{sound ? "SOUND ON" : "SOUND OFF"}</span>
            </button>
          </Magnetic>

          {/*
            The way to reach me, in the one place that is on screen the whole
            way down. Everything else here adjusts the experience; this is the
            only control that exists for the visitor's benefit rather than the
            site's, so it is the only one that gets a border — and it is the
            one thing in the bar that never hides on a narrow screen.
          */}
          <Magnetic strength={0.4}>
            <a
              href="#talk"
              onClick={(e) => go(e, "#talk")}
              data-cursor="TALK"
              className="group flex items-center gap-2 whitespace-nowrap border border-ember/55 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:border-ember hover:bg-ember hover:text-void md:gap-3 md:px-4 md:tracking-[0.28em]"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember transition-transform duration-500 group-hover:scale-150 group-hover:bg-void"
              />
              <span className="hidden sm:inline">Start a project</span>
              <span className="sm:hidden">Hire me</span>
            </a>
          </Magnetic>
        </div>
      </div>
    </motion.header>
  );
}
