"use client";

import { EMAIL, STORE_ITEMS, type StoreItem } from "@/lib/data";
import { RevealLines, Line, SectionLabel, Rise } from "@/components/ui/Split";
import Frame from "@/components/ui/Frame";

/**
 * The storefront. Deliberately the plainest room on the site: the world and
 * the type carry the arrival, then the layout gets out of the way.
 *
 * No 3D here on purpose. The particle world is the reason to stay on every
 * other page, but this is the one page where someone has already decided to
 * spend money, and every second between that decision and the checkout costs
 * something. A product that earns it can bring its own viewer later.
 */

/** One thing on the shelf. Live or not is decided by the data, not a flag. */
function Card({ item, index }: { item: StoreItem; index: number }) {
  const live = Boolean(item.price && item.href);

  const body = (
    <>
      <div className="relative overflow-hidden">
        <Frame src={item.image} alt={item.name} aspect="4 / 5" />
        <span className="absolute left-3 top-3 rounded-full border border-ink/25 bg-void/80 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/75 backdrop-blur-sm">
          {item.kind}
        </span>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-ink/15 pt-4">
        <h3 className="font-display text-2xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-ember">
          {item.name}
        </h3>
        <span
          className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] ${
            live ? "text-ink" : "text-ink/45"
          }`}
        >
          {live ? item.price : "Soon"}
        </span>
      </div>

      <p className="mt-3 font-mono text-xs leading-relaxed text-dim">{item.blurb}</p>
    </>
  );

  return (
    <Rise delay={index * 0.06} className="group">
      {live ? (
        <a
          href={item.href}
          data-cursor="BUY"
          className="block focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-8 focus-visible:outline-ember"
        >
          {body}
        </a>
      ) : (
        /* not a link and not a button: there is nowhere to go yet, and a
           control that does nothing when pressed is worse than no control */
        <div>{body}</div>
      )}
    </Rise>
  );
}

export default function Store() {
  return (
    <>
      <section
        data-shape
        aria-label="Store"
        className="relative flex min-h-[92svh] flex-col justify-end px-5 pb-[10vh] pt-[24vh] md:px-10"
      >
        <div className="section-veil-soft" aria-hidden="true" />
        <div className="mx-auto w-full max-w-[1400px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember">
            Store
          </span>
          <RevealLines className="on-field mt-6 font-display text-[13vw] font-extrabold leading-[0.92] tracking-tight text-ink md:text-[8vw]">
            <Line>SOMETHING</Line>
            <Line>
              WORTH <span className="font-serif font-normal italic text-ember">owning</span>
            </Line>
          </RevealLines>
          <p className="on-field mt-10 max-w-xl font-mono text-sm leading-relaxed text-ink md:text-base">
            Not open yet. When it is, it will be a short list of things I would
            actually buy myself — and a checkout that takes ten seconds.
          </p>
        </div>
      </section>

      <section
        data-shape
        aria-label="The shelf"
        className="relative px-5 py-[16vh] md:px-10"
      >
        <div className="section-veil" aria-hidden="true" />
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel index="01" title="What is coming" />

          <ul role="list" className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {STORE_ITEMS.map((item, i) => (
              <li key={item.key}>
                <Card item={item} index={i} />
              </li>
            ))}
          </ul>

          <Rise className="mt-24 grid gap-8 border-t border-ink/15 pt-10 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-xl font-mono text-sm leading-relaxed text-ink/75">
              Nothing above can be bought yet — no cart, no checkout, no card
              details going anywhere. When the first one is ready I will send a
              single email and that will be the whole announcement.
            </p>
            <a
              href={`mailto:${EMAIL}?subject=Tell%20me%20when%20the%20store%20opens`}
              data-cursor="MAIL"
              className="group inline-flex items-center gap-4 justify-self-start border border-ink/30 px-8 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/85 transition-colors duration-300 hover:border-ember hover:text-ink md:justify-self-end"
            >
              Tell me first
              <span aria-hidden="true" className="text-ember">→</span>
            </a>
          </Rise>
        </div>
      </section>
    </>
  );
}
