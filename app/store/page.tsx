import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageNav from "@/components/PageNav";
import Store from "@/components/pages/Store";
import { STORE_SHAPE } from "@/lib/world";

export const metadata: Metadata = {
  title: "Store — Nikola Anastasijević",
  description: "The store. Opening soon.",
};

export default function StorePage() {
  return (
    <Shell shapeBase={STORE_SHAPE}>
      <Store />
      <PageNav />
    </Shell>
  );
}
