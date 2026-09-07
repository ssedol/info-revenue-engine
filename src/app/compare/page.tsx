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
  const criteria = [
    {
      title: "목표 직무와 연결되는가",
      body: "채용공고에서 자격명이 실제로 등장하는지 먼저 봅니다. 같은 기사 등급이라도 시설관리, 안전관리, 개발, 조리처럼 쓰이는 직무가 다르면 우선순위가 달라집니다.",
    },
    {
      title: "응시 조건을 충족하는가",
      body: "기사·산업기사·기능장·기술사는 학력, 경력, 관련 자격에 따라 응시 가능 여부가 갈립니다. 공부를 시작하기 전 공식 응시자격부터 확인해야 시간을 아낄 수 있습니다.",
    },
    {
      title: "준비 시간을 감당할 수 있는가",
      body: "필기만 보고 결정하지 말고 실기 준비 기간까지 합쳐서 봅니다. 계산형, 작업형, 서술형 중 어떤 부담이 큰지에 따라 직장인과 취업준비생의 선택이 달라집니다.",
    },
    {
      title: "공식 일정과 접수 기회가 맞는가",
      body: "연 1~3회 중심인지, 상시 또는 여러 회차로 운영되는지 확인합니다. 접수 기간을 놓치면 다음 회차까지 기다려야 하므로 일정 적합성도 중요한 비교 기준입니다.",
    },
  ];

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
          {criteria.map((criterion) => (
            <article className="card" key={criterion.title}>
              <h3>{criterion.title}</h3>
              <p>{criterion.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section" aria-labelledby="compare-flow-title">
        <h2 id="compare-flow-title">비교할 때 추천 순서</h2>
        <ol className="step-list">
          <li>
            <strong>1순위: 직무 요구 확인</strong>
            목표 회사·직무 공고에서 필수 또는 우대 자격으로 적힌 이름을 먼저 모읍니다.
          </li>
          <li>
            <strong>2순위: 응시자격 확인</strong>
            지금 바로 접수 가능한 자격인지, 경력이나 학점이 더 필요한지 공식 안내로 확인합니다.
          </li>
          <li>
            <strong>3순위: 일정 역산</strong>
            접수일, 필기일, 실기일, 최종 발표일을 놓고 실제 준비 가능한 주 수를 계산합니다.
          </li>
          <li>
            <strong>4순위: 공부 부담 비교</strong>
            계산·암기·작업형·서술형 중 내게 가장 큰 부담이 되는 유형을 기준으로 우선순위를 조정합니다.
          </li>
        </ol>
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
