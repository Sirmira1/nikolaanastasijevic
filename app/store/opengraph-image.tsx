import { ogCard, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "Store — a short list of things worth owning. Opening soon.";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "Store",
    title: "Something worth",
    accentWord: "owning",
    sub: "Not open yet. When it is, it will be a short list of things I would actually buy myself — and a checkout that takes ten seconds.",
    accent: "#ff5c28",
    shape: "bag",
  });
}
