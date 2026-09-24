import { getCertificationDeepDive } from "./certificationDeepDives";
import { getCertificationGuide } from "./certificationGuides";
import { getCertifications } from "./data";
import type { Certification } from "./types";

/**
 * 자격증 상세 페이지는 직접 작성한 가이드나 심화 정보가 있는 종목만 만듭니다.
 * 공식 일정 데이터만 있는 종목은 목록과 일정 페이지에서 다루고,
 * 템플릿 문구로 상세 페이지를 채우지 않습니다.
 */
export function hasCertificationDetail(name: string): boolean {
  return Boolean(getCertificationDeepDive(name) ?? getCertificationGuide(name));
}

export function getDetailCertifications(): Certification[] {
  return getCertifications().filter((certification) => hasCertificationDetail(certification.name));
}
