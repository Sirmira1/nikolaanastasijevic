import { ogCard, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt =
  "Off Work — cars first: American muscle, racing, snowboarding, backpacking and the rest.";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "Off work",
    title: "What I do when",
    accentWord: "nobody is paying",
    sub: "Cars first, and it is not close. Then whatever gets me outside, off the ground, or into something I have not tried yet.",
    accent: "#ff5c28",
    shape: "muscle",
  });
}
