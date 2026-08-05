import { ogCard, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt =
  "On Work — full-stack developer in Hamilton: interface, backend, deployment, design, apps and AI.";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "On work",
    title: "I build the",
    accentWord: "whole thing",
    sub: "Interface, backend, deployment — and the design before any of it. One person the whole way down, which is why the seams line up.",
    accent: "#6ea8ff",
    shape: "terminal",
  });
}
