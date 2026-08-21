import type { MetadataRoute } from "next";
import { siteConfig } from "@/core/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/data/", "/api/", "/*.tmp", "/raw/"],
      },
    ],
    sitemap: `${siteConfig.defaultUrl}/sitemap.xml`,
  };
}
