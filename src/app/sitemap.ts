import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/core/seo/metadata";
import { getSeoIndexItems } from "@/core/seo/seo-index";
import { getCertifications } from "@/sites/certifications/data";
import { getCertificationDeepDive } from "@/sites/certifications/certificationDeepDives";
import { getCertificationGuide } from "@/sites/certifications/certificationGuides";
import { certificationPath } from "@/sites/certifications/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getSeoIndexItems().map((item) => ({
    url: absoluteUrl(item.path),
    lastModified: item.lastModified ? new Date(item.lastModified) : new Date(),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
  const certifications = getCertifications()
    .filter((certification) => getCertificationDeepDive(certification.name) || getCertificationGuide(certification.name))
    .map((certification) => ({
    url: absoluteUrl(certificationPath(certification)),
    lastModified: new Date(certification.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    }));

  return [
    ...items,
    ...certifications,
    {
      url: absoluteUrl("/schedules"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
