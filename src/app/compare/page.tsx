import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/core/ui/Breadcrumb";
import { buildMetadata } from "@/core/seo/metadata";
import { JsonLd, itemListJsonLd } from "@/core/seo/structured-data";
import { ArticleCard } from "@/sites/certifications/components/ArticleCard";
import { articlePath, getArticles, getPopularArticles } from "@/sites/certifications/articles";

export const dynamic = "error";
export const metadata: Metadata = buildMetadata({
  title: "자격증 선택 기준",
  description: "비슷한 자격증을 비교하고 선택할 때 보는 기준을 정리합니다.",
  path: "/compare",
});

export default function ComparePage() {
  const articles = getArticles().filter((article) => article.category.slug === "license-choice" || article.tags.includes("비교"));
  const popularArticles = getPopularArticles().slice(0, 4);

  return (
    <>
      <JsonLd value={itemListJsonLd(articles.map((article) => ({ name: article.title, path: articlePath(article) })))} />
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "비교" }]} />
      <section className="hero">
        <h1>비슷한 자격증을 비교할 때 보는 기준</h1>
        <p>난이도만 비교하기보다 목표 직무, 준비 시간, 공식 요건, 활용도를 함께 살펴보세요.</p>
      </section>
      <section className="section" aria-labelledby="criteria-title">
        <h2 id="criteria-title">비교 기준</h2>
        <div className="grid">
          {["목표 직무와 연결되는가", "응시 조건을 충족하는가", "준비 시간을 감당할 수 있는가", "채용공고에서 자주 언급되는가"].map((criterion) => (
            <article className="card" key={criterion}>
              <h3>{criterion}</h3>
              <p>블로그 글과 후기를 참고하되, 최종 조건과 일정은 공식 사이트에서 최신 안내를 확인하세요.</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section" aria-labelledby="compare-articles-title">
        <h2 id="compare-articles-title">비교에 도움 되는 글</h2>
        <div className="grid">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
      <section className="section" aria-labelledby="more-title">
        <h2 id="more-title">함께 읽기</h2>
        <p>
          <Link href="/articles">전체 글 목록 보기</Link>
        </p>
        <div className="grid">
          {popularArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} compact />
          ))}
        </div>
      </section>
    </>
  );
}
