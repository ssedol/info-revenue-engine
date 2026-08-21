import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/core/seo/metadata";
import { JsonLd, itemListJsonLd } from "@/core/seo/structured-data";
import { formatArticleDate } from "@/sites/certifications/components/ArticleCard";
import {
  articleCategoryPath,
  articlePath,
  getPopularArticles,
  getArticles,
  type Article,
} from "@/sites/certifications/articles";

export const metadata: Metadata = buildMetadata({
  title: "자격증 블로그",
  description: "자격증 선택, 공부 전략, 취업 활용법을 뉴스처럼 읽는 블로그형 정보사이트입니다.",
  path: "/",
});

export default function HomePage() {
  const articles = getArticles();
  const latestList = articles.slice(0, 8);
  const popularArticles = getPopularArticles();
  const popularList = popularArticles.slice(0, 8);
  const allList = articles.slice(8, 22);

  return (
    <>
      <JsonLd value={itemListJsonLd(articles.slice(0, 12).map((article) => ({ name: article.title, path: articlePath(article) })))} />
      <section className="hero">
        <h1>자격증 선택부터 공부 전략까지 읽기 쉽게 정리합니다</h1>
        <p>자격증 준비 전에 읽어볼 만한 최신 기사, 인기 기사, 실전 가이드를 한곳에 모았습니다.</p>
      </section>
      <section className="section news-board" aria-labelledby="latest-title">
        <div className="home-section-header">
          <h2 id="latest-title">최신 기사</h2>
          <Link href="/articles">전체 보기</Link>
        </div>
        <ArticleHeadlineList articles={latestList} columns />
      </section>
      <section id="popular" className="section news-board" aria-labelledby="popular-title">
        <div className="home-section-header">
          <h2 id="popular-title">많이 읽는 기사</h2>
        </div>
        <ArticleHeadlineList articles={popularList} columns />
      </section>
      <section className="section news-board" aria-labelledby="all-articles-title">
        <div className="home-section-header">
          <h2 id="all-articles-title">전체 기사</h2>
          <Link href="/articles">더 보기</Link>
        </div>
        <ArticleHeadlineList articles={allList} columns />
      </section>
    </>
  );
}

function ArticleHeadlineList({ articles, columns = false }: { articles: Article[]; columns?: boolean }) {
  return (
    <ol className={`headline-list${columns ? " headline-list--columns" : ""}`}>
      {articles.map((article) => (
        <li key={article.slug}>
          <Link className="headline-list__title" href={articlePath(article)}>
            {article.title}
          </Link>
          <p>{article.summary}</p>
          <div className="headline-list__meta">
            <Link href={articleCategoryPath(article.category)}>{article.category.name}</Link>
            <span>{formatArticleDate(article.publishedAt)}</span>
            <span>{article.readingMinutes}분</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
