"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      data-shape
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pb-8 pt-24 md:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_58%_38%_at_50%_50%,rgba(8,7,11,0.94)_0%,rgba(8,7,11,0.78)_48%,rgba(8,7,11,0.24)_76%,transparent_100%)]"
      />

      {/* rotating dial — an instrument, not decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[130vmin] w-[130vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.16]"
      >
        <div className="animate-spin-slow absolute inset-0 rounded-full border border-ink/30" style={{ animationDuration: "60s" }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-0 h-3 w-px origin-bottom bg-ink/50"
              style={{ transform: `rotate(${i * 15}deg) translateY(-1px)`, transformOrigin: `0 65vmin` }}
            />
          ))}
        </div>
        <div className="absolute inset-[12%] rounded-full border border-dashed border-ink/20 animate-spin-slow" style={{ animationDuration: "90s", animationDirection: "reverse" }} />
      </div>

      <motion.div
        className="relative z-10 flex items-start justify-between font-mono text-[10px] uppercase leading-relaxed tracking-[0.25em] text-ink/75 md:text-[11px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        <span>
          SOFTWARE DEVELOPER
          <br />
          HAMILTON, ONTARIO
        </span>
        <span className="hidden text-right sm:block">
          CO-OP @ MPBSDP
          <br />
          MOHAWK / SOFTWARE DEVELOPMENT
        </span>
      </motion.div>

      <h1 className="relative z-10 mx-auto w-full max-w-[1500px] text-center">
        <span className="block whitespace-nowrap font-display text-[2.7rem] font-extrabold leading-[0.85] text-ink [text-shadow:0_3px_30px_rgba(8,7,11,0.95)] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[9rem] xl:text-[11.5rem]">
          NIKOLA
        </span>
        <span className="block whitespace-nowrap font-display text-[1.3rem] font-extrabold leading-[0.95] text-ink/85 [text-shadow:0_2px_24px_rgba(8,7,11,1)] sm:text-[2.7rem] md:text-[3.1rem] lg:text-[4.3rem] xl:text-[5.5rem]">
          ANASTASIJEVIĆ
        </span>
        <span className="mt-5 block font-serif text-2xl italic leading-tight text-ink [text-shadow:0_2px_18px_rgba(8,7,11,1)] sm:text-3xl md:text-4xl lg:text-5xl">
          <span>software developer</span>
          <span className="mx-2 text-ember">/</span>
          <span className="text-ember">end-to-end builder</span>
        </span>
      </h1>

      <motion.div
        className="relative z-10 grid gap-5 font-mono text-[11px] leading-relaxed text-dim md:grid-cols-[minmax(0,2fr)_1fr] md:text-xs"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, delay: 0.35 }}
      >
        <span className="max-w-[76ch] text-ink/80">
          I turn ideas into working products — from a fog-of-war driving map
          and live trading systems to paid rental bookings and software for my
          own garage.
        </span>
        <span className="hidden text-right uppercase tracking-[0.24em] sm:block">
          WEB / MOBILE / DATA / 3D
          <br />
          <span className="text-ember">DESIGN THROUGH DEPLOYMENT</span>
        </span>
      </motion.div>
    </section>
  );
}
