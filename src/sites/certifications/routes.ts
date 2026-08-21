import type { Certification } from "./types";

const categorySlugMap = new Map<string, string>([
  ["정보통신", "information-communication"],
  ["전기·전자", "electrical-electronics"],
  ["안전관리", "safety-management"],
]);

const levelSlugMap = new Map<string, string>([
  ["기사", "engineer"],
  ["기술사", "professional-engineer"],
  ["기능장", "master-craftsman"],
]);

export function certificationPath(certification: Pick<Certification, "slug">): string {
  return `/certifications/${certification.slug}`;
}

export function certificationIntentPath(certification: Pick<Certification, "slug">, intent: CertificationIntent): string {
  return `${certificationPath(certification)}/${intent}`;
}

export type CertificationIntent = "schedule" | "fee" | "eligibility" | "apply" | "source";

export function categorySlug(category: string): string {
  return categorySlugMap.get(category) ?? `category-${stableCode(category)}`;
}

export function levelSlug(level: string): string {
  return levelSlugMap.get(level) ?? `level-${stableCode(level)}`;
}

export function categoryPath(category: string): string {
  return `/categories/${categorySlug(category)}`;
}

export function levelPath(level: string): string {
  return `/levels/${levelSlug(level)}`;
}

export function stableCode(value: string): string {
  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash.toString(36);
}
