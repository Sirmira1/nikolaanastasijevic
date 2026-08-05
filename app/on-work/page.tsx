import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageNav from "@/components/PageNav";
import OnWork from "@/components/pages/OnWork";
import { WORK_SHAPE } from "@/lib/world";

export const metadata: Metadata = {
  title: "On Work — Nikola Anastasijević",
  description:
    "Full-stack developer in Hamilton, Ontario: interface, backend, deployment, design, mobile apps and AI features — one person, the whole path.",
};

export default function OnWorkPage() {
  return (
    <Shell shapeBase={WORK_SHAPE}>
      <OnWork />
      <PageNav />
    </Shell>
  );
}
