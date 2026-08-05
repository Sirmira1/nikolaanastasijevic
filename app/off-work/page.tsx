import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageNav from "@/components/PageNav";
import OffWork from "@/components/pages/OffWork";
import { OFF_OPEN_SHAPE } from "@/lib/world";

export const metadata: Metadata = {
  title: "Off Work — Nikola Anastasijević",
  description:
    "Cars first: American muscle, building them, and every series worth watching. Then snowboarding, backpacking, calisthenics, photography and the rest.",
  alternates: { canonical: "/off-work" },
  // Without these every page shared as the home page's card: a title and a
  // description on their own do not reach openGraph, which inherits from the
  // root layout wholesale unless a page says otherwise.
  openGraph: {
    title: "Off Work — What I do when nobody is paying",
    description:
      "Cars first: American muscle, building them, and every series worth watching. Then snowboarding, backpacking, calisthenics, photography and the rest.",
    url: "/off-work",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Off Work — What I do when nobody is paying",
    description:
      "Cars first: American muscle, building them, and every series worth watching. Then snowboarding, backpacking, calisthenics, photography and the rest.",
  },
};

export default function OffWorkPage() {
  return (
    <Shell shapeBase={OFF_OPEN_SHAPE}>
      <OffWork />
      <PageNav />
    </Shell>
  );
}
