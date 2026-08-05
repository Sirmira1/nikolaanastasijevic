import type { MetadataRoute } from "next";
import { SITE_URL as SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/on-work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/off-work`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/store`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];
}
