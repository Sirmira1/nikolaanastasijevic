import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageNav from "@/components/PageNav";
import OffWork from "@/components/pages/OffWork";

export const metadata: Metadata = {
  title: "Off Work — Nikola Anastasijević",
  description:
    "Cars first: American muscle, building them, and every series worth watching. Then snowboarding, backpacking, calisthenics, photography and the rest.",
};

export default function OffWorkPage() {
  return (
    <Shell shapeBase={1}>
      <OffWork />
      <PageNav />
    </Shell>
  );
}
