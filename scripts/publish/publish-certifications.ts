import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { atomicWriteJson } from "../../src/core/data/atomic-json";
import { hasCertificationDetail } from "../../src/sites/certifications/detailPages";
import { certificationPath } from "../../src/sites/certifications/routes";
import type { Certification, SeoIndexItem } from "../../src/sites/certifications/types";
import { certificationSchema } from "../../src/sites/certifications/types";
import { isCliEntry } from "../shared/cli";
import { normalizedRoot, publishedRoot, validationRoot } from "../shared/paths";

type NormalizedFile = {
  certifications: Certification[];
};

type ValidationFile = {
  ok: boolean;
};

export function buildSeoIndex(certifications: Certification[]): SeoIndexItem[] {
  const baseItems: SeoIndexItem[] = [
    {
      path: "/",
      title: "자격증 정보 길잡이",
      description: "공식 데이터 기반 자격증 일정, 응시료, 접수 정보를 확인합니다.",
      canonicalPath: "/",
      priority: 1,
      changeFrequency: "weekly",
    },
    {
      path: "/certifications",
      title: "자격증 목록",
      description: "공식 데이터로 검증된 자격증 목록을 확인합니다.",
      canonicalPath: "/certifications",
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      path: "/compare",
      title: "자격증 비교",
      description: "분야와 수준 기준으로 자격증을 비교합니다.",
      canonicalPath: "/compare",
      priority: 0.7,
      changeFrequency: "monthly",
    },
  ];

  // 직접 작성한 가이드가 있는 종목만 색인합니다. 일정 데이터만 있는 종목까지 넣으면
  // 같은 틀의 페이지 수백 개가 색인돼 저품질 콘텐츠로 평가됩니다.
  const certificationItems = certifications
    .filter((certification) => hasCertificationDetail(certification.name))
    .map((certification) => ({
      path: certificationPath(certification),
      title: `${certification.name} 정보`,
      description: `${certification.name}의 2026 시험일정과 공식 데이터 기반 기본 정보를 확인합니다.`,
      canonicalPath: certificationPath(certification),
      priority: 0.85,
      changeFrequency: "weekly" as const,
      lastModified: certification.updatedAt,
    }));

  return [...baseItems, ...certificationItems];
}

async function publish(): Promise<void> {
  const validation = JSON.parse(
    await readFile(join(validationRoot, "certifications.validation.json"), "utf8"),
  ) as ValidationFile;

  if (!validation.ok) {
    throw new Error("Refusing to publish because validation report is not ok.");
  }

  const normalized = JSON.parse(
    await readFile(join(normalizedRoot, "certifications.normalized.json"), "utf8"),
  ) as NormalizedFile;
  const certifications = normalized.certifications.map((certification) => certificationSchema.parse(certification));

  await assertNotShrinkingPublish(certifications.length);
  const slugs = certifications.map((certification) => certification.slug);
  const seoIndex = buildSeoIndex(certifications);

  await atomicWriteJson(join(publishedRoot, "certifications.json"), { certifications });
  await atomicWriteJson(join(publishedRoot, "certification-slugs.json"), { slugs });
  await atomicWriteJson(join(publishedRoot, "seo-index.json"), { items: seoIndex });
}

/**
 * fixture 로 만든 normalized 파일을 그대로 publish 하면 실제 종목 수백 개가 사라집니다.
 * 이미 게시된 것보다 크게 줄어들면 멈추고, 의도한 축소일 때만 환경변수로 허용합니다.
 */
async function assertNotShrinkingPublish(nextCount: number): Promise<void> {
  const publishedFile = join(publishedRoot, "certifications.json");
  if (!existsSync(publishedFile)) return;

  const current = JSON.parse(await readFile(publishedFile, "utf8")) as { certifications?: unknown[] };
  const currentCount = current.certifications?.length ?? 0;
  if (currentCount === 0 || nextCount >= currentCount / 2) return;

  if (process.env.ALLOW_SHRINKING_PUBLISH === "1") return;

  throw new Error(
    `Refusing to publish ${nextCount} certifications over the ${currentCount} already published. ` +
      "Collect real data first, or set ALLOW_SHRINKING_PUBLISH=1 if the reduction is intended.",
  );
}

if (isCliEntry(import.meta.url)) {
  publish().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}

