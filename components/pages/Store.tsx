"use client";

import { EMAIL } from "@/lib/data";
import { RevealLines, Line, SectionLabel, Rise } from "@/components/ui/Split";

/**
 * The storefront. Deliberately the plainest room on the site below the fold:
 * the world and the type carry the arrival, then the layout gets out of the
 * way so buying something is boring in the way buying something should be.
 * A product that earns it can bring its own 3D viewer later.
 */
export default function Store() {
  return (
    <>
      <section
        data-shape
        aria-label="Store"
        className="relative flex min-h-[92svh] flex-col justify-end px-5 pb-[10vh] pt-[24vh] md:px-10"
      >
        <div className="section-veil" aria-hidden="true" />
        <div className="mx-auto w-full max-w-[1400px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember">
            Store
          </span>
          <RevealLines className="mt-6 font-display text-[13vw] font-extrabold leading-[0.92] tracking-tight text-ink md:text-[8vw]">
            <Line>SOMETHING</Line>
            <Line>
              WORTH <span className="font-serif font-normal italic text-ember">owning</span>
            </Line>
          </RevealLines>
          <p className="mt-10 max-w-xl font-mono text-sm leading-relaxed text-ink/80 md:text-base">
            Not open yet. When it is, it will be a short list of things I would
            actually buy myself — and a checkout that takes ten seconds.
          </p>
        </div>
      </section>

      <section
        data-shape
        aria-label="Coming soon"
        className="relative px-5 py-[16vh] md:px-10"
      >
        <div className="section-veil" aria-hidden="true" />
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel index="01" title="What is coming" />

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <Rise key={n} delay={n * 0.05}>
                <div className="aspect-[4/5] rounded-sm border border-dashed border-ink/25 bg-void/40" />
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="font-display text-xl font-bold text-ink/70">Product {n}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
                    Soon
                  </span>
                </div>
              </Rise>
            ))}
          </div>

          <Rise className="mt-20 border-t border-ink/15 pt-10">
            <p className="max-w-xl font-mono text-sm leading-relaxed text-ink/75">
              Want to know when it opens?{" "}
              <a
                href={`mailto:${EMAIL}?subject=Tell%20me%20when%20the%20store%20opens`}
                className="text-ember underline-offset-4 hover:underline"
              >
                Send me a line
              </a>{" "}
              and I will tell you first.
            </p>
          </Rise>
        </div>
      </section>
    </>
  );
}
