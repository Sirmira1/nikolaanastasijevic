"use client";

import { CAPABILITIES, PROJECTS } from "@/lib/data";
import { SectionLabel, Rise, RevealLines, Line } from "@/components/ui/Split";

export default function OnWork() {
  return (
    <>
      <section
        data-shape
        aria-label="On work"
        className="relative flex min-h-[92svh] flex-col justify-end px-5 pb-[10vh] pt-[24vh] md:px-10"
      >
        <div className="section-veil" aria-hidden="true" />
        <div className="mx-auto w-full max-w-[1400px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember">
            On work
          </span>
          <RevealLines className="mt-6 font-display text-[13vw] font-extrabold leading-[0.92] tracking-tight text-ink md:text-[8vw]">
            <Line>I BUILD THE</Line>
            <Line>
              WHOLE <span className="font-serif font-normal italic text-ember">thing</span>
            </Line>
          </RevealLines>
          <p className="mt-10 max-w-xl font-mono text-sm leading-relaxed text-ink/80 md:text-base">
            Full-stack developer in Hamilton. Interface, backend, deployment —
            and the design before any of it. One person the whole way down,
            which is why the seams line up.
          </p>
        </div>
      </section>

      {/* what the job actually is */}
      <section
        data-shape
        aria-label="Capabilities"
        className="relative px-5 py-[16vh] md:px-10"
      >
        <div className="section-veil" aria-hidden="true" />
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel index="01" title="What that means in practice" />

          <div className="flex flex-col">
            {CAPABILITIES.map((c, i) => (
              <Rise
                key={c.index}
                delay={i * 0.05}
                className="grid gap-4 border-t border-ink/15 py-10 last:border-b md:grid-cols-[80px_1fr_1fr] md:gap-12"
              >
                <span className="font-mono text-xs tracking-[0.25em] text-ember">{c.index}</span>
                <div>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
                    {c.title}
                  </h3>
                  <ul role="list" className="mt-4 flex flex-wrap gap-2">
                    {c.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full border border-ink/22 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/75"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="max-w-md font-mono text-sm leading-relaxed text-ink/75">{c.note}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* proof, pointing back at the work on the home page */}
      <section
        data-shape
        aria-label="Recent work"
        className="relative px-5 py-[16vh] md:px-10"
      >
        <div className="section-veil" aria-hidden="true" />
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel index="02" title="Shipped, and still running" />

          <ul role="list" className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {PROJECTS.map((p) => (
              <li key={p.index} className="border-t border-ink/15 pt-6">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="VISIT"
                  className="group block"
                >
                  <span className="font-mono text-[10px] tracking-[0.3em] text-dim">{p.index}</span>
                  <h3
                    className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink/90 transition-colors duration-300 md:text-5xl"
                    style={{ ["--hover" as string]: p.accent }}
                  >
                    <span className="transition-colors duration-300 group-hover:text-[var(--hover)]">
                      {p.title}
                    </span>
                  </h3>
                  <p className="mt-3 max-w-md font-mono text-xs leading-relaxed text-dim">
                    {p.description}
                  </p>
                </a>
              </li>
            ))}
          </ul>

          <Rise className="mt-16">
            <a
              href="/#work"
              data-cursor="GO"
              className="group inline-flex items-center gap-4 border border-ink/30 px-8 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/85 transition-colors duration-300 hover:border-ember hover:text-ink"
            >
              The full case studies
              <span aria-hidden="true" className="text-ember">→</span>
            </a>
          </Rise>
        </div>
      </section>
    </>
  );
}
