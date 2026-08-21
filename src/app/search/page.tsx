import type { Metadata } from "next";
import { Breadcrumb } from "@/core/ui/Breadcrumb";
import { ArticleCard } from "@/sites/certifications/components/ArticleCard";
import { searchArticles } from "@/sites/certifications/articles";

export const metadata: Metadata = {
  title: "자격증 검색",
  description: "자격증명과 관심 주제로 자격증 인사이트의 글을 검색합니다.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const results = searchArticles(query);

  return (
    <>
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "검색" }]} />
      <section className="hero">
        <h1>자격증 검색</h1>
        <p>자격증명, 카테고리, 관심 키워드로 관련 글을 찾아보세요.</p>
      </section>
      <section className="section" aria-labelledby="search-results-title">
        {query ? (
          <>
            <h2 id="search-results-title">검색 결과</h2>
            <p className="search-summary" aria-live="polite">
              <strong>&lsquo;{query}&rsquo;</strong> 관련 글 {results.length}개
            </p>
            {results.length > 0 ? (
              <div className="article-list">
                {results.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <div className="search-empty">
                <h2>검색 결과가 없습니다</h2>
                <p>자격증 이름을 줄여 쓰거나 ‘기사’, ‘취업’, ‘공부 전략’처럼 다른 키워드로 검색해 보세요.</p>
              </div>
            )}
          </>
        ) : (
          <div className="search-empty">
            <h2 id="search-results-title">검색어를 입력해 주세요</h2>
            <p>상단 검색창에 찾고 싶은 자격증명이나 관심 주제를 입력하면 관련 글이 표시됩니다.</p>
          </div>
        )}
      </section>
    </>
  );
}
