"use client";

import { CAPABILITIES, PROJECTS } from "@/lib/data";
import { WORK_SHAPE } from "@/lib/world";
import { SectionLabel, Rise, RevealLines, Line } from "@/components/ui/Split";
import ShapeCycle from "@/components/sections/ShapeCycle";

/**
 * The stack behind one capability, as a plate rather than a photo. The
 * off-work cycle puts a picture here; this page has no picture to put, and a
 * list of what the work is actually made of is the more honest answer.
 */
function Plate({ items, accent }: { items: readonly string[]; accent: string }) {
  return (
    /*
     * No fill. A translucent panel laid over the field cut a hard-edged
     * rectangle through the silhouette behind it — the same seam that reads as
     * a rendering fault anywhere else on this site. The hairline and the type
     * are enough to make it a panel, and the shape stays whole underneath.
     */
    <div className="flex h-full flex-col justify-center rounded-sm border border-ink/15 p-6 [text-shadow:0_2px_16px_rgba(8,7,11,1),0_0_34px_rgba(8,7,11,0.9)] md:p-8">
      {/* not in the accent: the field is already wearing it, and accent type
          on an accent-coloured silhouette disappears into it */}
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/65">
        What it is made of
      </span>
      <ul role="list" className="mt-5">
        {items.map((it) => (
          <li
            key={it}
            className="flex items-baseline gap-3 border-t border-ink/12 py-3 font-mono text-xs text-ink first:border-t-0 md:text-sm"
          >
            <span
              aria-hidden="true"
              className="h-1 w-1 shrink-0 translate-y-[-2px] rounded-full"
              style={{ background: accent }}
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One capability at a time, the field holding a silhouette of each. */
function Capabilities() {
  return (
    <ShapeCycle
      items={CAPABILITIES}
      shapeBase={WORK_SHAPE}
      label="What that means in practice"
      asideAspect="4 / 3"
      aside={(c) => <Plate items={c.items} accent={c.accent} />}
      fallback={(c) => (
        <>
          <h3 className="font-display text-3xl font-extrabold text-ink">{c.label}</h3>
          <p className="mt-2 max-w-md font-mono text-sm leading-relaxed text-dim">{c.lead}</p>
          <div className="mt-4">
            <Plate items={c.items} accent={c.accent} />
          </div>
        </>
      )}
    />
  );
}

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

      <Capabilities />

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
