import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/core/seo/metadata";
import { getSeoIndexItems } from "@/core/seo/seo-index";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSeoIndexItems().map((item) => ({
    url: absoluteUrl(item.path),
    lastModified: item.lastModified ? new Date(item.lastModified) : new Date(),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
}
