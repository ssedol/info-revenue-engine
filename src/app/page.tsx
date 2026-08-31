import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/core/seo/metadata";
import { JsonLd, itemListJsonLd } from "@/core/seo/structured-data";
import { formatArticleDate } from "@/sites/certifications/components/ArticleCard";
import { getCertifications } from "@/sites/certifications/data";
import { certificationPath } from "@/sites/certifications/routes";
import type { Certification, ExamSchedule } from "@/sites/certifications/types";
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
  const upcomingSchedules = getUpcomingSchedules(getCertifications()).slice(0, 8);

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
      <section className="section schedule-board" aria-labelledby="upcoming-schedules-title">
        <div className="home-section-header">
          <h2 id="upcoming-schedules-title">다가오는 시험일정</h2>
          <Link href="/certifications">전체 일정 보기</Link>
        </div>
        {upcomingSchedules.length > 0 ? (
          <ol className="upcoming-schedule-list">
            {upcomingSchedules.map((item) => (
              <li key={item.key}>
                <Link className="upcoming-schedule-link" href={item.href}>
                  <div className="schedule-date">
                    <strong>{formatScheduleDate(item.date)}</strong>
                    <span>{formatDday(item.date)}</span>
                  </div>
                  <div className="schedule-summary">
                    <div className="certification-card-meta">
                      <span>{item.level}</span>
                      <span>{item.label}</span>
                    </div>
                    <h3>{item.certificationName}</h3>
                    <p>{item.round}</p>
                  </div>
                  <span className="schedule-detail-link">일정 자세히</span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="search-empty">
            <h3>다가오는 일정이 없습니다</h3>
            <p>새로운 공식 시험일정이 게시되면 이 영역에 자동으로 표시됩니다.</p>
          </div>
        )}
      </section>
    </>
  );
}

type UpcomingSchedule = {
  key: string;
  level: string;
  round: string;
  label: string;
  date: string;
  certificationName: string;
  href: string;
};

const featuredCertificationNames = [
  "정보처리기사",
  "전기기사",
  "산업안전기사",
  "건설안전기사",
  "컴퓨터활용능력1급",
  "한식조리기능사",
  "전기기능사",
  "지게차운전기능사",
];

const scheduleMilestones: Array<{ field: keyof ExamSchedule; label: string }> = [
  { field: "applicationStart", label: "필기 접수" },
  { field: "examStart", label: "필기시험" },
  { field: "resultDate", label: "필기 발표" },
  { field: "practicalApplicationStart", label: "실기 접수" },
  { field: "practicalExamStart", label: "실기시험" },
  { field: "practicalResultDate", label: "최종 발표" },
];

export function getUpcomingSchedules(
  certifications: Certification[],
  today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date()),
): UpcomingSchedule[] {
  const featuredOrder = new Map(featuredCertificationNames.map((name, index) => [name, index]));
  const candidates = certifications
    .filter((certification) => featuredOrder.has(certification.name))
    .sort(
      (a, b) =>
        (featuredOrder.get(a.name) ?? Number.MAX_SAFE_INTEGER) -
        (featuredOrder.get(b.name) ?? Number.MAX_SAFE_INTEGER),
    );
  const upcoming: UpcomingSchedule[] = [];

  for (const certification of candidates) {
    const level = certification.level ?? "기타";
    let next: UpcomingSchedule | undefined;

    for (const schedule of certification.schedules) {
      const round = schedule.round ?? schedule.examName ?? "정기 시험";
      for (const milestone of scheduleMilestones) {
        const date = schedule[milestone.field];
        if (typeof date !== "string" || date < today) continue;

        const item = {
          key: `${certification.id}:${milestone.field}:${date}`,
          level,
          round,
          label: milestone.label,
          date,
          certificationName: certification.name,
          href: certificationPath(certification),
        };
        if (!next || item.date < next.date) {
          next = item;
        }
      }
    }

    if (next) upcoming.push(next);
  }

  return upcoming.sort((a, b) => a.date.localeCompare(b.date));
}

function formatScheduleDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric", weekday: "short", timeZone: "Asia/Seoul" })
    .format(new Date(`${value}T00:00:00+09:00`));
}

function formatDday(value: string): string {
  const today = new Date();
  const target = new Date(`${value}T00:00:00+09:00`);
  const diff = Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
  return diff <= 0 ? "오늘" : `D-${diff}`;
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
