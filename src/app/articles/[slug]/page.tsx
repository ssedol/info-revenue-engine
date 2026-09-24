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
  const sections = getArticleSections(article);
  const faqItems = getArticleFaqs(article);
  const latestNews = getArticles()
    .filter((candidate) => candidate.slug !== article.slug)
    .slice(0, 6);

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
          <AdSlot name="article-top" />
          <div className="article-body article-body--sectioned">
            {sections ? (
              sections.map((section) => (
                <section key={section.id} id={section.id} className="article-section">
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))
            ) : (
              <section className="article-section">
                {article.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            )}

            {qnetInfo ? <QnetOfficialPanel info={qnetInfo} /> : null}

            {faqItems.length > 0 ? (
              <section id="faq" className="article-section article-faq">
                <h2>자주 묻는 질문</h2>
                {faqItems.map((item) => (
                  <details key={item.question} open>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </section>
            ) : null}

            <OfficialResourcePanel resources={officialResources} />

            <aside className="official-note" aria-labelledby="official-note-title">
              <h2 id="official-note-title">원문 출처</h2>
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
      <section id="latest-news" className="section latest-news-section" aria-labelledby="latest-news-title">
        <h2 id="latest-news-title">최신 자격증 글</h2>
        <ol className="latest-news-list">
          {latestNews.map((latestArticle, index) => (
            <li key={latestArticle.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
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
};

/**
 * 모든 글에 같은 목차·같은 문단을 붙이면 중복 콘텐츠가 됩니다.
 * 소제목은 그 글에 맞게 직접 쓴 경우에만 사용하고, 나머지는 본문을 그대로 보여줍니다.
 */
function getArticleSections(article: Article): ArticleSection[] | undefined {
  if (article.slug === "public-vs-private-certifications") {
    return privateCertificationSections;
  }
  return undefined;
}

function getArticleFaqs(article: Article): Array<{ question: string; answer: string }> {
  if (article.slug === "public-vs-private-certifications") {
    return privateCertificationFaqs;
  }
  return [];
}

const privateCertificationSections: ArticleSection[] = [
  {
    id: "summary",
    title: "민간 자격증 핵심 요약",
    paragraphs: [
      "민간 자격증은 민간 기관이 만든 자격입니다. 등록 민간자격이라는 표시만으로 국가가 자격의 품질이나 취업 효과를 보증하는 것은 아닙니다.",
      "신청 전에는 민간자격정보서비스(PQI)에서 자격명, 등록번호, 발급기관과 공인 여부를 조회하고 실제 채용공고에서 활용되는지도 따로 확인해야 합니다.",
    ],
  },
  {
    id: "qualification-types",
    title: "국가자격·공인 민간자격·등록 민간자격 차이",
    paragraphs: [
      "국가자격은 법령에 따라 국가가 신설하고 관리하는 자격입니다. 국가기술자격과 국가전문자격처럼 운영 근거와 시행기관이 정해져 있습니다.",
      "국가공인 민간자격은 등록 민간자격 가운데 일정 요건을 갖춰 주무부처의 공인을 받은 자격입니다. 등록 민간자격은 민간기관이 운영 정보를 등록한 것으로, 공인 여부와는 구분해야 합니다.",
    ],
  },
  {
    id: "lookup",
    title: "민간 자격증 등록 여부 조회 방법",
    paragraphs: [
      "PQI의 공인 민간자격 검색 또는 등록 민간자격 검색에서 자격명과 기관명을 조회합니다. 이름이 같거나 비슷한 자격이 여러 기관에 등록됐을 수 있으므로 기관명과 등록번호까지 비교해야 합니다.",
      "검색 결과에서는 자격관리기관, 주무부처, 등록번호, 등급과 공인 여부를 확인하세요. 검색되지 않거나 홍보 페이지의 정보와 다르면 결제 전에 운영기관에 근거를 요청하는 편이 안전합니다.",
    ],
  },
  {
    id: "before-payment",
    title: "결제 전에 확인할 6가지",
    paragraphs: [
      "등록번호와 발급기관, 총비용, 시험 또는 평가 방식, 자격증 발급비, 유효기간과 갱신비, 환불 규정을 확인하세요. 무료 수강을 강조해도 발급비나 갱신비가 별도로 붙을 수 있습니다.",
      "취업이 목적이라면 광고의 취업 보장 표현보다 실제 채용공고에서 해당 자격명이 필수 또는 우대로 반복되는지를 확인해야 합니다.",
    ],
  },
  {
    id: "value",
    title: "등록된 민간 자격증이면 취업에 도움이 될까",
    paragraphs: [
      "등록 사실과 취업 활용도는 별개의 문제입니다. 직무에서 널리 쓰이는 자격인지, 교육 내용이 실무와 연결되는지, 채용 담당자가 알아보는 명칭인지에 따라 가치가 달라집니다.",
      "자기계발 목적이라면 교육 내용과 비용을 중심으로 판단할 수 있지만, 취업 목적이라면 채용공고와 현직자 요구 역량을 먼저 확인하는 편이 현실적입니다.",
    ],
  },
];

const privateCertificationFaqs = [
  {
    question: "등록 민간자격은 국가가 인정한 자격증인가요?",
    answer:
      "등록은 민간기관이 자격을 관리·운영한다는 정보를 등록한 것입니다. 국가공인 여부와 품질 보증을 의미하지 않으므로 PQI에서 공인 여부를 별도로 확인해야 합니다.",
  },
  {
    question: "민간 자격증 등록번호는 어디에서 조회하나요?",
    answer:
      "민간자격정보서비스(PQI)의 등록 민간자격 검색에서 자격명이나 기관명으로 조회할 수 있습니다. 동일한 명칭이 있을 수 있으므로 발급기관과 등록번호를 함께 비교하세요.",
  },
  {
    question: "민간 자격증이 취업에 도움이 되는지 어떻게 확인하나요?",
    answer:
      "희망 직무의 채용공고에서 해당 자격명이 필수·우대 조건으로 반복되는지 확인하세요. 등록 여부만으로 취업 활용도를 판단하기는 어렵습니다.",
  },
];

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
