import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/core/seo/metadata";
import { JsonLd, itemListJsonLd } from "@/core/seo/structured-data";
import { Breadcrumb } from "@/core/ui/Breadcrumb";
import { ArticleCard } from "@/sites/certifications/components/ArticleCard";
import { articlePath, getArticlesByTag, getTags, tagPath } from "@/sites/certifications/articles";

export const dynamic = "error";

export function generateStaticParams() {
  return getTags()
    .slice(0, 12)
    .map((tag) => ({
      tagSlug: tag.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ tagSlug: string }> }): Promise<Metadata> {
  const { tagSlug } = await params;
  const tag = getTags().find((item) => item.slug === tagSlug);
  if (!tag) {
    return {};
  }

  return buildMetadata({
    title: `${tag.name} 글`,
    description: `${tag.name} 주제의 자격증 글을 모아 봅니다.`,
    path: tagPath(tag.name),
  });
}

export default async function TagPage({ params }: { params: Promise<{ tagSlug: string }> }) {
  const { tagSlug } = await params;
  const tag = getTags().find((item) => item.slug === tagSlug);
  const articles = getArticlesByTag(tagSlug);

  if (!tag || articles.length === 0) {
    notFound();
  }

  return (
    <>
      <JsonLd value={itemListJsonLd(articles.map((article) => ({ name: article.title, path: articlePath(article) })))} />
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "글 목록", href: "/articles" }, { label: tag.name }]} />
      <section className="hero">
        <h1>{tag.name}</h1>
        <p>{tag.name} 주제의 자격증 정보글입니다.</p>
      </section>
      <div className="grid">
        {articles.map((article) => (
          <div key={article.slug}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </>
  );
}
