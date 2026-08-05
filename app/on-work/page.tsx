import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageNav from "@/components/PageNav";
import OnWork from "@/components/pages/OnWork";
import { WORK_OPEN_SHAPE } from "@/lib/world";

export const metadata: Metadata = {
  title: "On Work — Nikola Anastasijević",
  description:
    "Full-stack developer in Hamilton, Ontario: interface, backend, deployment, design, mobile apps and AI features — one person, the whole path.",
  alternates: { canonical: "/on-work" },
  // Without these every page shared as the home page's card: a title and a
  // description on their own do not reach openGraph, which inherits from the
  // root layout wholesale unless a page says otherwise.
  openGraph: {
    title: "On Work — I build the whole thing",
    description:
      "Full-stack developer in Hamilton, Ontario: interface, backend, deployment, design, mobile apps and AI features — one person, the whole path.",
    url: "/on-work",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "On Work — I build the whole thing",
    description:
      "Full-stack developer in Hamilton, Ontario: interface, backend, deployment, design, mobile apps and AI features — one person, the whole path.",
  },
};

export default function OnWorkPage() {
  return (
    <Shell shapeBase={WORK_OPEN_SHAPE}>
      <OnWork />
      <PageNav />
    </Shell>
  );
}
