import type { Metadata } from "next";
import { buildMetadata } from "@/core/seo/metadata";
import { JsonLd, itemListJsonLd } from "@/core/seo/structured-data";
import { Breadcrumb } from "@/core/ui/Breadcrumb";
import { ArticleCard } from "@/sites/certifications/components/ArticleCard";
import { articleCategories, articleCategoryPath, articlePath, getArticles, getTags, tagPath } from "@/sites/certifications/articles";

export const dynamic = "error";
export const metadata: Metadata = buildMetadata({
  title: "자격증 글 목록",
  description: "자격증 선택, 공부 전략, 취업 활용법을 다룬 최신 정보글을 모아 봅니다.",
  path: "/articles",
});

export default function ArticlesPage() {
  const articles = getArticles();
  const topArticles = articles.slice(0, 10);
  const remainingArticles = articles.slice(10);

  return (
    <>
      <JsonLd value={itemListJsonLd(articles.map((article) => ({ name: article.title, path: articlePath(article) })))} />
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "글 목록" }]} />
      <section className="hero">
        <h1>최신 자격증 정보글</h1>
        <p>시험 준비를 시작하기 전 읽기 좋은 선택 기준, 공부 전략, 커리어 활용법을 모았습니다.</p>
      </section>
      <section className="section" aria-labelledby="latest-title">
        <h2 id="latest-title">최신글</h2>
        <div className="article-list">
          {topArticles.map((article) => (
            <div key={article.slug}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </section>
      <section className="section" aria-labelledby="category-title">
        <h2 id="category-title">카테고리</h2>
        <div className="grid">
          {articleCategories.map((category) => (
            <article className="card" key={category.slug}>
              <h3>
                <a href={articleCategoryPath(category)}>{category.name}</a>
              </h3>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section" aria-labelledby="more-title">
        <h2 id="more-title">더 읽기</h2>
        <div className="grid">
          {remainingArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} compact />
          ))}
        </div>
      </section>
      <section className="section" aria-labelledby="tag-title">
        <h2 id="tag-title">인기 주제</h2>
        <div className="topic-cloud">
          {getTags()
            .slice(0, 16)
            .map((tag) => (
              <a key={tag.slug} href={tagPath(tag.name)}>
                {tag.name} <span>{tag.count}</span>
              </a>
            ))}
        </div>
      </section>
    </>
  );
}
