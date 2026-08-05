import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageNav from "@/components/PageNav";
import OffWork from "@/components/pages/OffWork";
import { OFF_OPEN_SHAPE } from "@/lib/world";

export const metadata: Metadata = {
  title: "Off Work — Nikola Anastasijević",
  description:
    "Cars first: American muscle, building them, and every series worth watching. Then snowboarding, backpacking, calisthenics, photography and the rest.",
};

export default function OffWorkPage() {
  return (
    <Shell shapeBase={OFF_OPEN_SHAPE}>
      <OffWork />
      <PageNav />
    </Shell>
  );
}
