import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/core/ads/AdSlot";
import { buildMetadata } from "@/core/seo/metadata";
import { JsonLd, articleJsonLd } from "@/core/seo/structured-data";
import { Breadcrumb } from "@/core/ui/Breadcrumb";
import { ArticleCard, formatArticleDate } from "@/sites/certifications/components/ArticleCard";
import { OfficialResourcePanel } from "@/sites/certifications/components/OfficialResourcePanel";
import { QnetOfficialPanel } from "@/sites/certifications/components/QnetOfficialPanel";
import { articleCategoryPath, articlePath, getArticleBySlug, getArticles, getRelatedArticles, tagPath, type Article } from "@/sites/certifications/articles";
import { getOfficialResources } from "@/sites/certifications/officialResources";
import { getQnetOfficialInfo } from "@/sites/certifications/qnetOfficial";

export const dynamic = "error";

export function generateStaticParams() {
  return getArticles().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return {};
  }

  return buildMetadata({
    title: article.title,
    description: article.summary,
    path: articlePath(article),
  });
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article);
  const qnetInfo = getQnetOfficialInfo(article);
  const officialResources = getOfficialResources(article);
  const articleSections = buildArticleSections(article, Boolean(qnetInfo));
  const latestNews = getArticles()
    .filter((candidate) => candidate.slug !== article.slug)
    .slice(0, 10);
  const faqItems = buildFaqItems(article);

  return (
    <>
      <JsonLd
        value={articleJsonLd({
          headline: article.title,
          description: article.summary,
          path: articlePath(article),
          dateModified: `${article.publishedAt}T00:00:00.000Z`,
        })}
      />
      <div className="article-page">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "글 목록", href: "/articles" },
            { label: article.category.name, href: articleCategoryPath(article.category) },
            { label: article.title },
          ]}
        />
        <article className="article-detail">
          <header className="article-header">
            <p className="article-kicker">{article.category.name}</p>
            <div className="article-meta">
              <Link href={articleCategoryPath(article.category)}>{article.category.name}</Link>
              <span>등록 {formatArticleDate(article.publishedAt)}</span>
              <span>약 {article.readingMinutes}분 읽기</span>
            </div>
            <h1>{article.title}</h1>
            <p>{article.summary}</p>
            <ul className="tag-list" aria-label="태그">
              {article.tags.map((tag) => (
                <li key={tag}>
                  <Link href={tagPath(tag)}>{tag}</Link>
                </li>
              ))}
            </ul>
          </header>
          <figure className="article-thumbnail">
            <Image src={getArticleImage(article)} alt="" width={1200} height={675} priority />
          </figure>
          <aside className="article-takeaways" aria-labelledby="takeaways-title">
            <h2 id="takeaways-title">핵심 요약</h2>
            <ul>
              <li>{article.summary}</li>
              <li>{article.category.name} 관점에서 먼저 확인할 기준을 정리했습니다.</li>
              <li>{qnetInfo ? "아래 Q-Net 공식 확인 정보에서 일정과 수수료를 바로 확인할 수 있습니다." : "시험일정, 응시료, 접수 기간은 실제 접수 전 공식 사이트에서 다시 확인하세요."}</li>
            </ul>
          </aside>
          <AdSlot name="article-top" />
          <aside className="article-guide" aria-labelledby="article-guide-title">
            <h2 id="article-guide-title">이 글의 핵심 목차</h2>
            <ol>
              {articleSections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>
                    <span>{formatSectionNumber(index)}</span>
                    {section.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq">
                  <span>{formatSectionNumber(articleSections.length)}</span>
                  자주 묻는 질문
                </a>
              </li>
              <li>
                <a href="#latest-news">
                  <span>{formatSectionNumber(articleSections.length + 1)}</span>
                  최신 자격증 글
                </a>
              </li>
            </ol>
          </aside>
          <p className="article-intro">{article.summary} 아래에서는 핵심 요약, 공식 확인 방법, 준비 순서, 비용과 시간 관리, 주의사항을 한 번에 볼 수 있게 정리했습니다.</p>
          <a className="article-source-cta official-link official-link--stacked" href={article.officialLinks[0]?.href ?? "https://www.q-net.or.kr/"} rel="noreferrer" target="_blank">
            <span>공식 정보 확인하기</span>
            <small>{article.officialLinks[0]?.href ?? "https://www.q-net.or.kr/"}</small>
          </a>
          <div className="article-body article-body--sectioned">
            {articleSections.map((section, index) => (
              <section key={section.id} id={section.id} className="article-section">
                <h2>
                  <span>{formatSectionNumber(index)}</span>
                  {section.title}
                </h2>
                {section.kind === "summary" ? (
                  <div className="article-table" role="table" aria-label="핵심 요약 표">
                    <div role="row">
                      <strong role="cell">먼저 볼 것</strong>
                      <span role="cell">{article.summary}</span>
                    </div>
                    <div role="row">
                      <strong role="cell">분류</strong>
                      <span role="cell">{article.category.name}</span>
                    </div>
                    <div role="row">
                      <strong role="cell">읽는 시간</strong>
                      <span role="cell">{article.readingMinutes}분</span>
                    </div>
                  </div>
                ) : null}
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.kind === "checklist" ? (
                  <ol className="article-checklist">
                    <li>목표가 취업, 이직, 승진, 전공 보완 중 어디에 가까운지 먼저 정합니다.</li>
                    <li>필기와 실기 중 현재 막히는 영역을 나눠서 공부 시간을 배분합니다.</li>
                    <li>접수 전에는 Q-Net 종목 상세, 시행 공고, 접수 기간을 다시 확인합니다.</li>
                  </ol>
                ) : null}
                {section.kind === "official" && qnetInfo ? <QnetOfficialPanel info={qnetInfo} /> : null}
                {section.kind === "resources" ? <OfficialResourcePanel resources={officialResources} /> : null}
                {index % 2 === 1 ? <AdSlot name="article-inline" /> : null}
              </section>
            ))}
            <section id="faq" className="article-section article-faq">
              <h2>
                <span>{formatSectionNumber(articleSections.length)}</span>
                자주 묻는 질문
              </h2>
              {faqItems.map((item) => (
                <details key={item.question} open>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </section>
            <AdSlot name="in-content" />
            <aside className="official-note" aria-labelledby="official-note-title">
              <h2 id="official-note-title">원문 출처</h2>
              <p>자격증 시행기관, 응시자격, 수수료, 시험일정처럼 바뀌는 정보는 Q-Net과 고용 관련 공식 자료를 기준으로 확인합니다.</p>
              <ul className="official-link-list">
                {article.officialLinks.map((link) => (
                  <li key={link.href}>
                    <a className="official-link official-link--stacked" href={link.href} rel="noreferrer" target="_blank">
                      <span>{link.label}</span>
                      <small>{link.href}</small>
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
            <AdSlot name="bottom-banner" />
          </div>
        </article>
      </div>
      <AdSlot name="list-inline" />
      <section id="latest-news" className="section latest-news-section" aria-labelledby="latest-news-title">
        <h2 id="latest-news-title">최신 자격증 글</h2>
        <ol className="latest-news-list">
          {latestNews.map((latestArticle, index) => (
            <li key={latestArticle.slug}>
              <span>{formatSectionNumber(index)}</span>
              <Link href={articlePath(latestArticle)}>{latestArticle.title}</Link>
              <small>{formatArticleDate(latestArticle.publishedAt)}</small>
            </li>
          ))}
        </ol>
      </section>
      <section className="section related-section" aria-labelledby="related-title">
        <h2 id="related-title">함께 보면 좋은 글</h2>
        <div className="grid">
          {related.map((relatedArticle) => (
            <ArticleCard key={relatedArticle.slug} article={relatedArticle} compact />
          ))}
        </div>
      </section>
    </>
  );
}

type ArticleSection = {
  id: string;
  title: string;
  paragraphs: string[];
  kind?: "summary" | "official" | "checklist" | "resources";
};

function buildArticleSections(article: Article, hasQnetInfo: boolean): ArticleSection[] {
  const mainKeyword = article.tags[0] ?? article.category.name;
  const paragraph = (index: number, fallback: string) => article.body[index] ?? fallback;

  return [
    {
      id: "summary",
      title: `${mainKeyword} 핵심 요약`,
      kind: "summary",
      paragraphs: [
        paragraph(0, `${article.title}을 준비할 때는 먼저 목표와 현재 상황을 나눠서 판단해야 합니다.`),
        paragraph(1, "시험 범위, 접수 방식, 공부 기간을 한 번에 보려고 하면 기준이 흐려지므로 핵심 항목부터 정리하는 편이 좋습니다."),
      ],
    },
    {
      id: "official-info",
      title: hasQnetInfo ? "Q-Net 공식 정보 확인" : "공식 정보 확인",
      kind: "official",
      paragraphs: [
        "자격증 글에서 가장 먼저 확인해야 하는 것은 시행기관, 응시 수수료, 접수 기간, 시험일정입니다. 아래 공식 정보 영역은 운영자가 수동으로 확인해 넣은 Q-Net 기준 정보입니다.",
        "실제 접수 직전에는 세부 공고가 바뀔 수 있으므로 같은 항목을 다시 확인하는 방식으로 보는 것이 안전합니다.",
      ],
    },
    {
      id: "preparation-order",
      title: "준비 전 체크 순서",
      kind: "checklist",
      paragraphs: [
        paragraph(2, "처음 준비할 때는 시험 난이도보다 본인의 목적을 먼저 정리하는 것이 중요합니다."),
        paragraph(3, "비전공자는 용어와 흐름을 먼저 익히고, 전공자는 기출 문제를 통해 약한 영역을 빠르게 찾는 방식이 효율적입니다."),
      ],
    },
    {
      id: "study-method",
      title: "공부 방향과 선택 기준",
      paragraphs: [
        paragraph(4, "필기와 실기를 별개의 시험처럼 나눠 보면 준비 계획을 세우기 쉽습니다."),
        paragraph(5, "합격만 목표로 할지, 직무 이해까지 같이 가져갈지에 따라 교재와 강의 선택 기준도 달라집니다."),
      ],
    },
    {
      id: "cost-time",
      title: "비용과 시간 관리",
      paragraphs: [
        paragraph(6, "응시료 외에도 교재, 강의, 실습 환경, 재응시 가능성까지 고려하면 실제 준비 비용은 더 커질 수 있습니다."),
        paragraph(7, "퇴근 후 준비하는 직장인은 매일 긴 시간을 확보하기보다 반복 가능한 최소 시간을 정해두는 편이 현실적입니다."),
      ],
    },
    {
      id: "career-point",
      title: "취업과 커리어 활용 포인트",
      paragraphs: [
        paragraph(8, "자격증은 단독으로 모든 것을 해결해 주기보다 이력서에서 기본 역량을 설명하는 근거로 쓰이는 경우가 많습니다."),
        paragraph(9, "직무와 연결되는 프로젝트, 실습 경험, 기존 경력을 함께 정리하면 자격증의 활용도가 올라갑니다."),
      ],
    },
    {
      id: "job-posting",
      title: "채용공고에서 확인할 표현",
      paragraphs: [
        "채용공고에서는 같은 자격증도 필수, 우대, 관련 자격, 보유자 우대처럼 다른 표현으로 등장합니다. 이 표현을 구분해야 자격증 준비의 우선순위를 잘못 잡지 않습니다.",
        "공고를 여러 개 모아 보면 반복되는 자격명이 보입니다. 한두 개 공고보다 반복적으로 등장하는 조건을 기준으로 판단하는 편이 더 현실적입니다.",
      ],
    },
    {
      id: "caution",
      title: "주의해야 할 점",
      paragraphs: [
        "인터넷 글만 보고 접수 일정이나 응시자격을 확정하면 안 됩니다. 특히 정기 시험 회차, 원서접수 마감, 실기 방식은 해마다 바뀔 수 있습니다.",
        "광고성 강의 추천이나 과장된 합격 후기를 볼 때는 본인의 배경, 공부 가능 시간, 실제 시험 범위를 따로 확인해야 합니다.",
      ],
    },
    {
      id: "before-apply",
      title: "접수 전 마지막 확인",
      paragraphs: [
        "접수 전에는 자격명, 회차, 필기와 실기 구분, 시험장, 수수료, 결제 완료 여부를 다시 확인해야 합니다. 작은 착오가 접수 실패나 불필요한 재응시로 이어질 수 있습니다.",
        "시험 당일 준비물과 입실 시간도 함께 확인하세요. 공부를 충분히 했더라도 신분증, 수험표, 시험장 위치 같은 기본 항목을 놓치면 실제 응시에 문제가 생길 수 있습니다.",
      ],
    },
    {
      id: "official-resources",
      title: "함께 보면 좋은 공식 자료",
      kind: "resources",
      paragraphs: ["아래 링크는 자격증 선택과 접수 전에 같이 보면 좋은 공식 자료입니다. 시험 정보와 취업 정보를 분리해서 확인하면 판단이 더 쉬워집니다."],
    },
  ];
}

function buildFaqItems(article: Article) {
  const keyword = article.tags[0] ?? article.title;

  return [
    {
      question: `${keyword} 준비는 언제 시작하는 게 좋나요?`,
      answer: "시험 회차와 본인의 기초 수준에 따라 다릅니다. 처음 준비한다면 접수일을 기준으로 역산하지 말고, 필기 개념 정리와 기출 풀이 시간을 먼저 확보하는 방식이 좋습니다.",
    },
    {
      question: "비전공자도 준비할 수 있나요?",
      answer: "가능하지만 용어와 문제 표현에 익숙해지는 시간이 필요합니다. 처음에는 전체 범위를 빠르게 훑고, 이후 반복 출제되는 부분을 중심으로 좁혀 가는 편이 현실적입니다.",
    },
    {
      question: "이 글의 일정과 수수료만 보고 접수해도 되나요?",
      answer: "아닙니다. 이 글은 공식 정보를 보기 쉽게 정리한 안내 글입니다. 실제 접수 전에는 Q-Net의 종목 상세 페이지와 해당 회차 공고를 반드시 다시 확인해야 합니다.",
    },
  ];
}

function formatSectionNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function getArticleImage(article: Article) {
  if (article.tags.includes("전기기사")) {
    return "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80";
  }
  if (article.tags.includes("산업안전기사") || article.tags.includes("안전관리")) {
    return "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80";
  }
  if (article.tags.includes("정보처리기사")) {
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
  }
  return "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80";
}
