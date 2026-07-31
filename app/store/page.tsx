import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageNav from "@/components/PageNav";
import Store from "@/components/pages/Store";

export const metadata: Metadata = {
  title: "Store — Nikola Anastasijević",
  description: "The store. Opening soon.",
};

export default function StorePage() {
  return (
    <Shell shapeBase={6}>
      <Store />
      <PageNav />
    </Shell>
  );
}
