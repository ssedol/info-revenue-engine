import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/core/seo/metadata";
import { JsonLd, itemListJsonLd } from "@/core/seo/structured-data";
import { formatArticleDate } from "@/sites/certifications/components/ArticleCard";
import { getCertifications } from "@/sites/certifications/data";
import { getDetailCertifications, hasCertificationDetail } from "@/sites/certifications/detailPages";
import { certificationPath } from "@/sites/certifications/routes";
import type { Certification, ExamSchedule } from "@/sites/certifications/types";
import {
  articleCategoryPath,
  articlePath,
  getPopularArticles,
  getArticles,
  type Article,
} from "@/sites/certifications/articles";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "자격증 시험일정 D-day",
  description: "Q-Net 공식 데이터로 520개 국가자격 종목의 접수일과 시험일을 가까운 순서대로 보여주고, 주요 자격증의 준비 방법을 함께 정리합니다.",
  path: "/",
});

export default function HomePage() {
  const articles = getArticles();
  const latestList = articles.slice(0, 8);
  const popularArticles = getPopularArticles();
  const popularList = popularArticles.slice(0, 8);
  const certifications = getCertifications();
  const upcomingSchedules = getUpcomingSchedules(certifications).slice(0, 12);
  const guidedCertifications = getDetailCertifications();

  return (
    <>
      <JsonLd value={itemListJsonLd(articles.slice(0, 12).map((article) => ({ name: article.title, path: articlePath(article) })))} />
      <section className="hero">
        <h1>다음 자격증 시험까지 며칠 남았는지 한눈에</h1>
        <p>
          Q-Net 공식 데이터로 {certifications.length.toLocaleString("ko-KR")}개 국가자격 종목의 원서접수일과 시험일을 모아
          가까운 순서대로 보여줍니다. 주요 종목은 시험 구성·합격기준·준비 순서까지 정리했습니다.
        </p>
      </section>
      <section className="section schedule-board" aria-labelledby="upcoming-schedules-title">
        <div className="home-section-header">
          <h2 id="upcoming-schedules-title">가장 가까운 시험일정</h2>
          <Link href="/schedules">전체 일정 보기</Link>
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
                  <span className="schedule-detail-link">자세히</span>
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
      <section className="section" aria-labelledby="guided-certifications-title">
        <div className="home-section-header">
          <h2 id="guided-certifications-title">준비 방법까지 정리한 자격증</h2>
          <Link href="/certifications">전체 종목 검색</Link>
        </div>
        <ul className="tag-list">
          {guidedCertifications.map((certification) => (
            <li key={certification.slug}>
              <Link href={certificationPath(certification)}>{certification.name}</Link>
            </li>
          ))}
        </ul>
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
  const upcoming: UpcomingSchedule[] = [];

  for (const certification of certifications) {
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
          href: hasCertificationDetail(certification.name)
            ? certificationPath(certification)
            : certification.officialUrl ?? "/schedules",
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
