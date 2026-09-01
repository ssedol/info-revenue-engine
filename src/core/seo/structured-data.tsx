import { siteConfig } from "@/core/config/site";
import { absoluteUrl } from "./metadata";

type JsonLdValue = Record<string, unknown>;

export function JsonLd({ value }: { value: JsonLdValue }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value) }} />;
}

export function websiteJsonLd(): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.defaultUrl,
    description: siteConfig.description,
  };
}

export function itemListJsonLd(items: Array<{ name: string; path: string }>): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(input: { headline: string; description: string; path: string; dateModified?: string }): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.path),
    dateModified: input.dateModified,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
