"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealLines, Line, Rise, SectionLabel } from "@/components/ui/Split";
import { calmMode } from "@/lib/calm";
import GitHubLive from "@/components/GitHubLive";
import PortraitReveal from "@/components/PortraitReveal";

gsap.registerPlugin(ScrollTrigger);

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (calmMode()) {
      el.textContent = String(value);
      return;
    }
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration: 1.8,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 92%" },
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v));
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);
  return (
    <div className="flex flex-col gap-2 border-t border-line pt-4">
      <span className="font-display text-4xl font-bold text-ink md:text-5xl">
        <span ref={ref}>0</span>
        <span className="text-ember">{suffix}</span>
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-dim">{label}</span>
    </div>
  );
}

export default function About() {
  const cardRef = useRef<HTMLDivElement>(null);

  const tilt = (e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: x * 16,
      rotateX: -y * 16,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 700,
    });
  };
  const untilt = () => {
    if (cardRef.current)
      gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1,0.4)" });
  };

  return (
    <section
      id="about"
      data-shape
      aria-label="About"
      className="relative mx-auto max-w-[1400px] px-5 py-[22vh] md:px-10"
    >
      <div className="section-veil" aria-hidden="true" />
      <SectionLabel index="01" title="Who is behind this" />

      <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
        <RevealLines className="font-display text-[7.2vw] font-semibold leading-[1.12] tracking-tight text-ink sm:text-[5vw] lg:text-[3.4vw]">
          <Line>I build what</Line>
          <Line>
            I wish <span className="font-serif italic text-ember">existed</span>.
          </Line>
          {/*
            One line, not five. The paragraph used to be hand-broken into a
            line per mask at lengths chosen for the desktop column, so on a
            phone every one of them wrapped a second time and the copy came out
            in a ragged sawtooth, each break landing mid-clause. The measure
            does that job instead.
          */}
          <Line className="mt-8 max-w-[62ch] font-mono text-sm font-normal normal-case leading-relaxed tracking-normal text-dim lg:text-base">
            I&rsquo;m Nikola — a software developer in Hamilton, studying at
            Mohawk and working a co-op at MPBSDP. My own work is where it gets
            personal: a map that uncovers as I drive, software for every dollar
            spent on my cars, a rental flow with real bookings, and a bot
            reading live markets. I like owning the whole build — interface,
            data, and launch.
          </Line>
        </RevealLines>

        <div className="flex flex-col gap-10">
          <Rise delay={0.15}>
            <div
              ref={cardRef}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              data-cursor="REVEAL"
              className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-sm border border-line will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <PortraitReveal src="/img/ppp.jpg" alt="Nikola Anastasijević" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/70">
                <span>SELF-PORTRAIT</span>
                <span>PASS YOUR CURSOR</span>
              </div>
            </div>
          </Rise>

          <Rise delay={0.25} className="flex flex-col gap-3 font-mono text-xs leading-relaxed tracking-wide text-dim">
            {[
              ["BASE", "Hamilton, Ontario"],
              ["NOW", "MPBSDP + Mohawk"],
              ["OBSESSIONS", "Cars, maps, useful software"],
              ["RANGE", "Minimal interfaces to 3D worlds"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-line pb-3">
                <span className="text-ink/50">{k}</span>
                <span className="text-right text-ink">{v}</span>
              </div>
            ))}
          </Rise>
        </div>
      </div>

      <div className="mt-28 grid grid-cols-2 gap-8 md:grid-cols-4">
        <Stat value={4} suffix="+" label="3D web worlds" />
        <Stat value={9} suffix="" label="Languages in the toolbox" />
        <Stat value={2} suffix="" label="FlyBy platforms" />
        <Stat value={1} suffix="" label="Bot reading live markets" />
      </div>

      <GitHubLive />
    </section>
  );
}
