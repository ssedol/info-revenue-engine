import type { Metadata } from "next";
import { Breadcrumb } from "@/core/ui/Breadcrumb";
import { buildMetadata } from "@/core/seo/metadata";
import { JsonLd, itemListJsonLd } from "@/core/seo/structured-data";
import { ArticleCard } from "@/sites/certifications/components/ArticleCard";
import { articleCategories, articleCategoryPath, articlePath, getArticles, getPopularArticles, getTags, tagPath } from "@/sites/certifications/articles";

export const dynamic = "error";
export const metadata: Metadata = buildMetadata({
  title: "자격증 탐색",
  description: "자격증 선택, 공부 전략, 취업 활용 주제별 글을 탐색합니다.",
  path: "/certifications",
});

export default function CertificationsPage() {
  const articles = getArticles();
  const popularArticles = getPopularArticles();
  const tags = getTags().slice(0, 14);

  return (
    <>
      <JsonLd value={itemListJsonLd(articles.slice(0, 10).map((article) => ({ name: article.title, path: articlePath(article) })))} />
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "자격증 탐색" }]} />
      <section className="hero">
        <h1>자격증 글을 주제별로 찾아보세요</h1>
        <p>정확한 시험일정보다 먼저 필요한 선택 기준, 공부 전략, 커리어 활용법을 중심으로 정리했습니다.</p>
      </section>
      <section className="section" aria-labelledby="category-list-title">
        <h2 id="category-list-title">카테고리</h2>
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
      <section className="section" aria-labelledby="topic-title">
        <h2 id="topic-title">인기 주제</h2>
        <div className="topic-cloud">
          {tags.map((tag) => (
            <a href={tagPath(tag.name)} key={tag.slug}>
              {tag.name} <span>{tag.count}</span>
            </a>
          ))}
        </div>
      </section>
      <section className="section" aria-labelledby="popular-title">
        <h2 id="popular-title">추천 탐색 글</h2>
        <div className="grid">
          {popularArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} compact />
          ))}
        </div>
      </section>
    </>
  );
}
