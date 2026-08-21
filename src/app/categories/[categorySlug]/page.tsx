import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/core/ui/Breadcrumb";
import { buildMetadata } from "@/core/seo/metadata";
import { JsonLd, itemListJsonLd } from "@/core/seo/structured-data";
import { formatArticleDate } from "@/sites/certifications/components/ArticleCard";
import { articleCategories, articleCategoryPath, articlePath, getArticlesByCategory } from "@/sites/certifications/articles";

export const dynamic = "error";

export function generateStaticParams() {
  return articleCategories.map((category) => ({
    categorySlug: category.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = articleCategories.find((item) => item.slug === categorySlug);
  if (!category) {
    return {};
  }

  return buildMetadata({
    title: `${category.name} 자격증`,
    description: `${category.name} 분야의 자격증 목록을 확인합니다.`,
    path: articleCategoryPath(category),
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const category = articleCategories.find((item) => item.slug === categorySlug);
  const articles = getArticlesByCategory(categorySlug);

  if (!category || articles.length === 0) {
    notFound();
  }

  return (
    <>
      <JsonLd value={itemListJsonLd(articles.map((article) => ({ name: article.title, path: articlePath(article) })))} />
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "글 목록", href: "/articles" }, { label: category.name }]} />
      <section className="hero">
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </section>
      <section className="section news-board" aria-labelledby="category-articles-title">
        <div className="home-section-header">
          <h2 id="category-articles-title">{category.name} 기사</h2>
        </div>
        <ol className="headline-list headline-list--columns">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link className="headline-list__title" href={articlePath(article)}>
                {article.title}
              </Link>
              <p>{article.summary}</p>
              <div className="headline-list__meta">
                <span>{formatArticleDate(article.publishedAt)}</span>
                <span>{article.readingMinutes}분</span>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
