import type { Metadata } from "next";
import Link from "next/link";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import "./globals.css";
import { Analytics as GoogleAnalytics, getGoogleSiteVerification } from "@/core/analytics/Analytics";
import { siteConfig } from "@/core/config/site";
import { JsonLd, websiteJsonLd } from "@/core/seo/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.defaultUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.defaultUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  verification: {
    google: getGoogleSiteVerification(),
    other: {
      "naver-site-verification": "db525a696003921b6f22fa0c781804b50c9b3d42",
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4773298245322018"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div className="page-shell">
          <JsonLd value={websiteJsonLd()} />
          <header className="site-header">
            <div className="site-header__inner">
              <Link href="/" className="site-brand">
                {siteConfig.name}
              </Link>
              <form className="site-search" action="/search" method="get" role="search">
                <label htmlFor="site-search-input">자격증 검색</label>
                <input
                  id="site-search-input"
                  name="q"
                  type="search"
                  placeholder="자격증 검색"
                  autoComplete="off"
                />
              </form>
              <nav className="site-nav" aria-label="주요 메뉴">
                <Link href="/articles">최신글</Link>
                <Link href="/#popular">인기글</Link>
                <Link href="/schedules">시험일정</Link>
                <Link href="/certifications">자격증 탐색</Link>
                <Link href="/compare">비교</Link>
              </nav>
            </div>
          </header>
          <main className="content">{children}</main>
          <footer className="site-footer">
            <div className="site-footer__inner">
              <nav className="site-nav" aria-label="사이트 안내">
                <Link href="/about">사이트 소개</Link>
                <Link href="/privacy-policy">개인정보처리방침</Link>
                <Link href="/contact">문의</Link>
              </nav>
              <p>시험일정, 응시료, 접수 기간처럼 바뀔 수 있는 정보는 공식 사이트의 최신 안내를 확인하세요.</p>
              <p>© 2026 자격증 인사이트</p>
            </div>
          </footer>
          <GoogleAnalytics />
          <VercelAnalytics />
        </div>
      </body>
    </html>
  );
}
