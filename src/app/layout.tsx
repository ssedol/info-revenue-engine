import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Analytics, getGoogleSiteVerification } from "@/core/analytics/Analytics";
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
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <div className="page-shell">
          <JsonLd value={websiteJsonLd()} />
          <header className="site-header">
            <div className="site-header__inner">
              <Link href="/" className="site-brand">
                {siteConfig.name}
              </Link>
              <label className="site-search">
                <span>검색</span>
                <input type="search" placeholder="자격증 검색" />
              </label>
              <nav className="site-nav" aria-label="주요 메뉴">
                <Link href="/articles">최신글</Link>
                <Link href="/#popular">인기글</Link>
                <Link href="/certifications">자격증 탐색</Link>
                <Link href="/compare">비교</Link>
              </nav>
            </div>
          </header>
          <main className="content">{children}</main>
          <footer className="site-footer">
            <div className="site-footer__inner">
              <p>시험일정, 응시료, 접수 기간처럼 바뀔 수 있는 정보는 공식 사이트의 최신 안내를 확인하세요.</p>
            </div>
          </footer>
          <Analytics />
        </div>
      </body>
    </html>
  );
}
