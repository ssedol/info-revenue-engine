import type { SeoIndexItem } from "@/sites/certifications/types";
import { getArticleSeoIndexItems } from "@/sites/certifications/articleSeo";

export function getSeoIndexItems(): SeoIndexItem[] {
  return getArticleSeoIndexItems();
}
