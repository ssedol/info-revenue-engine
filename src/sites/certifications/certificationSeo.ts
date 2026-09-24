import type { SeoIndexItem } from "./types";
import { getDetailCertifications } from "./detailPages";
import { certificationPath } from "./routes";

/**
 * 직접 작성한 가이드·심화 정보가 있는 자격증 상세 페이지만 사이트맵에 넣습니다.
 * 공식 일정만 있는 종목은 /schedules 와 /certifications 목록에서 다룹니다.
 */
export function getCertificationSeoIndexItems(): SeoIndexItem[] {
  return getDetailCertifications().map((certification) => ({
    path: certificationPath(certification),
    title: `${certification.name} 시험일정과 준비 방법`,
    description: `${certification.name}의 2026년 시험일정, 시험 구성과 합격기준, 준비 순서를 정리했습니다.`,
    canonicalPath: certificationPath(certification),
    priority: 0.8,
    changeFrequency: "weekly" as const,
    lastModified: certification.updatedAt,
  }));
}
