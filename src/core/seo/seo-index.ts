import type { SeoIndexItem } from "@/sites/certifications/types";
import { getArticleSeoIndexItems } from "@/sites/certifications/articleSeo";
import { getCertificationSeoIndexItems } from "@/sites/certifications/certificationSeo";

export function getSeoIndexItems(): SeoIndexItem[] {
  return [...getArticleSeoIndexItems(), ...getCertificationSeoIndexItems()];
}
