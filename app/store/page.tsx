import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageNav from "@/components/PageNav";
import Store from "@/components/pages/Store";
import { STORE_SHAPE } from "@/lib/world";

export const metadata: Metadata = {
  title: "Store — Nikola Anastasijević",
  description:
    "A short list of things I would actually buy myself, and a checkout that takes ten seconds. Opening soon.",
  alternates: { canonical: "/store" },
  // Without these every page shared as the home page's card: a title and a
  // description on their own do not reach openGraph, which inherits from the
  // root layout wholesale unless a page says otherwise.
  openGraph: {
    title: "Store — Something worth owning",
    description:
      "A short list of things I would actually buy myself, and a checkout that takes ten seconds. Opening soon.",
    url: "/store",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Store — Something worth owning",
    description:
      "A short list of things I would actually buy myself, and a checkout that takes ten seconds. Opening soon.",
  },
};

export default function StorePage() {
  return (
    <Shell shapeBase={STORE_SHAPE}>
      <Store />
      <PageNav />
    </Shell>
  );
}
