export type SiteConfig = {
  name: string;
  description: string;
  defaultUrl: string;
  topic: string;
  locale: string;
};

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export const siteConfig: SiteConfig = {
  name: "자격증 인사이트",
  description: "자격증 선택, 공부 전략, 취업 활용법을 뉴스처럼 읽는 블로그형 정보사이트입니다.",
  defaultUrl: getSiteUrl(),
  topic: "certifications",
  locale: "ko_KR",
};
