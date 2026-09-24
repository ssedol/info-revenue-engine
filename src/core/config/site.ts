export type SiteConfig = {
  name: string;
  description: string;
  defaultUrl: string;
  topic: string;
  locale: string;
};

const PRODUCTION_SITE_URL = "https://cert-insight.online";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || PRODUCTION_SITE_URL;
}

export const siteConfig: SiteConfig = {
  name: "자격증 인사이트",
  description:
    "Q-Net 공식 데이터로 국가자격 시험일정을 가까운 순서대로 보여주고, 주요 자격증의 시험 구성·합격기준·준비 방법을 정리합니다.",
  defaultUrl: getSiteUrl(),
  topic: "certifications",
  locale: "ko_KR",
};

