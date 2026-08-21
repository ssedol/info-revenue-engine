import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { certificationSchema } from "./types";
import type { Certification } from "./types";
import { categorySlug, levelSlug } from "./routes";

const publishedRoot = join(process.cwd(), "data", "sources", "certifications", "published");

const publishedCertificationsSchema = z.object({
  certifications: z.array(certificationSchema).min(1),
});

export function getCertifications(): Certification[] {
  const data = JSON.parse(readFileSync(join(publishedRoot, "certifications.json"), "utf8")) as unknown;
  return publishedCertificationsSchema.parse(data).certifications;
}

export function getCertificationBySlug(slug: string): Certification | undefined {
  return getCertifications().find((certification) => certification.slug === slug);
}

export function getCategories(): Array<{ slug: string; name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const certification of getCertifications()) {
    counts.set(certification.category, (counts.get(certification.category) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([name, count]) => ({
    slug: categorySlug(name),
    name,
    count,
  }));
}

export function getLevels(): Array<{ slug: string; name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const certification of getCertifications()) {
    if (certification.level) {
      counts.set(certification.level, (counts.get(certification.level) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries()).map(([name, count]) => ({
    slug: levelSlug(name),
    name,
    count,
  }));
}

export function getCertificationsByCategory(slug: string): Certification[] {
  return getCertifications().filter((certification) => categorySlug(certification.category) === slug);
}

export function getCertificationsByLevel(slug: string): Certification[] {
  return getCertifications().filter((certification) => certification.level && levelSlug(certification.level) === slug);
}
