"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PAGES } from "@/lib/data";

/**
 * The way out of every page. Sits at the very bottom, lists the other rooms,
 * and leaves out the one you are standing in.
 */
export default function PageNav() {
  const here = usePathname();
  const rest = PAGES.filter((p) => p.href !== here);

  return (
    <nav
      aria-label="More pages"
      className="relative z-10 border-t border-ink/15 px-5 pb-16 pt-14 md:px-10"
    >
      <span className="mb-8 block font-mono text-[10px] uppercase tracking-[0.3em] text-ink/60">
        Elsewhere on the site
      </span>

      <ul role="list" className="mx-auto max-w-[1400px]">
        {rest.map((p) => (
          <li key={p.href} className="border-t border-ink/12 last:border-b">
            <Link
              href={p.href}
              data-cursor="GO"
              className="group flex items-baseline justify-between gap-6 py-7 md:py-9"
            >
              <span className="flex items-baseline gap-5">
                <span
                  aria-hidden="true"
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  →
                </span>
                <span className="font-display text-3xl font-extrabold tracking-tight text-ink/85 transition-colors duration-300 group-hover:text-ink md:text-6xl">
                  {p.label}
                </span>
              </span>
              <span className="hidden text-right font-mono text-[10px] uppercase tracking-[0.24em] text-ink/55 transition-colors duration-300 group-hover:text-ink/80 sm:block">
                {p.note}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
