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
  description: "2026 자격증 시험일정, 응시자격, 합격기준과 공부 순서를 공식정보 기준으로 정리합니다.",
  defaultUrl: getSiteUrl(),
  topic: "certifications",
  locale: "ko_KR",
};
