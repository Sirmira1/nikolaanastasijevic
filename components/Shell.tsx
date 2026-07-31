"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Header from "@/components/Header";
import Terminal from "@/components/Terminal";
import Guestbook from "@/components/Guestbook";
import Gyro from "@/components/Gyro";

// the WebGL world is client-only and code-split away from first paint
const Scene = dynamic(() => import("@/components/gl/Scene"), { ssr: false });

/**
 * Everything every page shares: the particle world, the chrome, and the
 * scroll pipeline. The home page keeps its own arrangement because it also
 * runs the preloader and the section rail; these are the quieter rooms.
 *
 * `shapeBase` picks which formation the field starts on for this page — the
 * sections inside advance from there, so a page never opens on the signature
 * unless it means to.
 */
export default function Shell({
  children,
  shapeBase = 1,
}: {
  children: ReactNode;
  shapeBase?: number;
}) {
  return (
    <SmoothScroll>
      <Scene />
      <Cursor />
      <Header visible />
      <Terminal />
      <Guestbook />
      <Gyro />

      <main id="main" data-shape-base={shapeBase} className="relative z-10">
        {children}
      </main>
    </SmoothScroll>
  );
}
