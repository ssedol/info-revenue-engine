import type { Metadata } from "next";
import { siteConfig } from "@/core/config/site";

export type SeoMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.defaultUrl}${normalizedPath}`;
}

export function buildMetadata(input: SeoMetadataInput): Metadata {
  const url = absoluteUrl(input.path);

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
