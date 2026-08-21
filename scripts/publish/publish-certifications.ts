import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { atomicWriteJson } from "../../src/core/data/atomic-json";
import { categoryPath, certificationIntentPath, certificationPath, levelPath } from "../../src/sites/certifications/routes";
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

  const certificationItems = certifications.flatMap((certification) => [
    {
      path: certificationPath(certification),
      title: `${certification.name} 정보`,
      description: `${certification.name}의 공식 데이터 기반 기본 정보를 확인합니다.`,
      canonicalPath: certificationPath(certification),
      priority: 0.85,
      changeFrequency: "weekly" as const,
      lastModified: certification.updatedAt,
    },
    {
      path: certificationIntentPath(certification, "schedule"),
      title: `${certification.name} 시험일정`,
      description: `${certification.name} 시험일정의 공식 데이터 확인 상태를 제공합니다.`,
      canonicalPath: certificationIntentPath(certification, "schedule"),
      priority: 0.75,
      changeFrequency: "weekly" as const,
      lastModified: certification.updatedAt,
    },
    {
      path: certificationIntentPath(certification, "fee"),
      title: `${certification.name} 응시료`,
      description: `${certification.name} 응시료의 공식 데이터 확인 상태를 제공합니다.`,
      canonicalPath: certificationIntentPath(certification, "fee"),
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: certification.updatedAt,
    },
    {
      path: certificationIntentPath(certification, "eligibility"),
      title: `${certification.name} 응시자격`,
      description: `${certification.name} 응시자격의 공식 데이터 확인 상태를 제공합니다.`,
      canonicalPath: certificationIntentPath(certification, "eligibility"),
      priority: 0.65,
      changeFrequency: "monthly" as const,
      lastModified: certification.updatedAt,
    },
    {
      path: certificationIntentPath(certification, "apply"),
      title: `${certification.name} 접수처`,
      description: `${certification.name} 원서접수 정보와 공식 링크 확인 상태를 제공합니다.`,
      canonicalPath: certificationIntentPath(certification, "apply"),
      priority: 0.65,
      changeFrequency: "monthly" as const,
      lastModified: certification.updatedAt,
    },
    {
      path: certificationIntentPath(certification, "source"),
      title: `${certification.name} 공식 출처`,
      description: `${certification.name} 데이터 출처와 갱신 상태를 확인합니다.`,
      canonicalPath: certificationIntentPath(certification, "source"),
      priority: 0.65,
      changeFrequency: "monthly" as const,
      lastModified: certification.updatedAt,
    },
  ]);

  const categories = Array.from(new Set(certifications.map((certification) => certification.category))).map((category) => ({
    path: categoryPath(category),
    title: `${category} 자격증`,
    description: `${category} 분야의 자격증 목록을 확인합니다.`,
    canonicalPath: categoryPath(category),
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: certifications[0]?.updatedAt,
  }));

  const levels = Array.from(
    new Set(certifications.map((certification) => certification.level).filter((level): level is string => Boolean(level))),
  ).map((level) => ({
    path: levelPath(level),
    title: `${level} 자격증`,
    description: `${level} 수준의 자격증 목록을 확인합니다.`,
    canonicalPath: levelPath(level),
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: certifications[0]?.updatedAt,
  }));

  return [...baseItems, ...certificationItems, ...categories, ...levels];
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
  const slugs = certifications.map((certification) => certification.slug);
  const seoIndex = buildSeoIndex(certifications);

  await atomicWriteJson(join(publishedRoot, "certifications.json"), { certifications });
  await atomicWriteJson(join(publishedRoot, "certification-slugs.json"), { slugs });
  await atomicWriteJson(join(publishedRoot, "seo-index.json"), { items: seoIndex });
}

if (isCliEntry(import.meta.url)) {
  publish().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
