import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/core/ui/Breadcrumb";
import { buildMetadata } from "@/core/seo/metadata";
import { getCertificationGuide } from "@/sites/certifications/contentQuality";
import { getCertificationBySlug, getCertifications } from "@/sites/certifications/data";
import { certificationPath } from "@/sites/certifications/routes";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return getCertifications().map(({ slug }) => ({ slug }));
}

type CertificationPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CertificationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const certification = getCertificationBySlug(slug);
  if (!certification) return {};
  return buildMetadata({
    title: `${certification.name} 2026 시험일정`,
    description: `${certification.name}의 2026년 필기·실기 원서접수, 시험일정과 공식 정보를 확인합니다.`,
    path: certificationPath(certification),
  });
}

function formatDate(value?: string): string {
  return value ? value.replaceAll("-", ".") : "-";
}

export default async function CertificationDetailPage({ params }: CertificationPageProps) {
  const { slug } = await params;
  const certification = getCertificationBySlug(slug);
  if (!certification) notFound();
  const providerName = certification.source.provider;
  const guide = getCertificationGuide(certification);

  return (
    <>
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "자격증 목록", href: "/certifications" }, { label: certification.name }]} />
      <section className="hero certification-detail-hero">
        <div className="certification-card-meta">
          {certification.level && <span>{certification.level}</span>}
          <span>{certification.category}</span>
        </div>
        <h1>{certification.name}</h1>
        <p>시행기관 {certification.issuer} · 공식 데이터 {providerName}</p>
        <div className="official-actions">
          {certification.officialUrl && <a href={certification.officialUrl} target="_blank" rel="noreferrer">공식 상세정보</a>}
          {certification.applicationUrl && <a href={certification.applicationUrl} target="_blank" rel="noreferrer">원서접수</a>}
        </div>
      </section>

      <section className="section" aria-labelledby="schedule-title">
        <h2 id="schedule-title">2026 시험일정</h2>
        <p className="schedule-notice">아래 일정은 {providerName} 공식 시험정보 기준입니다. 종목과 지역에 따라 시행 회차가 다를 수 있으므로 접수 전 공식 상세정보를 다시 확인하세요.</p>
        {certification.schedules.length > 0 ? (
          <div className="schedule-table-wrap">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th scope="col">회차</th>
                  <th scope="col">필기 접수</th>
                  <th scope="col">필기시험</th>
                  <th scope="col">실기 접수</th>
                  <th scope="col">실기시험</th>
                  <th scope="col">최종 발표</th>
                </tr>
              </thead>
              <tbody>
                {certification.schedules.map((schedule) => (
                  <tr key={schedule.round ?? schedule.examName}>
                    <th scope="row">{schedule.examName ?? schedule.round}</th>
                    <td>{formatDate(schedule.applicationStart)} ~ {formatDate(schedule.applicationEnd)}</td>
                    <td>{formatDate(schedule.examStart)}</td>
                    <td>{formatDate(schedule.practicalApplicationStart)} ~ {formatDate(schedule.practicalApplicationEnd)}</td>
                    <td>{formatDate(schedule.practicalExamStart)} ~ {formatDate(schedule.practicalExamEnd)}</td>
                    <td>{formatDate(schedule.practicalResultDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="search-empty">
            <h3>공식 일정 확인이 필요합니다</h3>
            <p>이 종목은 공통 회차 일정과 바로 연결되지 않았습니다. Q-Net 상세정보에서 정확한 시행 일정을 확인하세요.</p>
          </div>
        )}
      </section>

      <section className="section certification-guide" aria-labelledby="guide-title">
        <h2 id="guide-title">{certification.name} 준비 전 핵심 정리</h2>
        <p className="guide-overview">{guide.overview}</p>
        <div className="guide-grid">
          <article className="card">
            <h3>이런 사람에게 먼저 맞습니다</h3>
            <ul className="check-list">
              {guide.goodFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h3>접수 전 확인할 것</h3>
            <ul className="check-list">
              {guide.beforeApply.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h3>공부 방향</h3>
            <ul className="check-list">
              {guide.studyFocus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section" aria-labelledby="basic-info-title">
        <h2 id="basic-info-title">기본정보</h2>
        <dl className="meta-list">
          <div><dt>자격명</dt><dd>{certification.officialName}</dd></div>
          <div><dt>등급</dt><dd>{certification.level ?? "분류 없음"}</dd></div>
          <div><dt>분야</dt><dd>{certification.category}</dd></div>
          <div><dt>시행기관</dt><dd>{certification.issuer}</dd></div>
          <div><dt>데이터 기준일</dt><dd>{certification.updatedAt.slice(0, 10)}</dd></div>
          {certification.eligibility && <div><dt>응시자격</dt><dd>{certification.eligibility}</dd></div>}
          {certification.fees.map((fee) => (
            <div key={fee.label}><dt>{fee.label} 수험료</dt><dd>{fee.amount.toLocaleString("ko-KR")}원</dd></div>
          ))}
        </dl>
        {certification.description && !certification.description.includes("fixture") && <p>{certification.description}</p>}
        <div className="source-notice">
          <h3>정보 확인 기준</h3>
          <p>
            시험일정과 접수 가능 여부는 시행기관 공지에 따라 바뀔 수 있습니다. 이 페이지는 공식 데이터와 공개 안내를 바탕으로
            준비 흐름을 정리하지만, 실제 원서접수 전에는 반드시 공식 상세정보에서 최종 조건을 확인하세요.
          </p>
        </div>
        <p><Link href="/certifications">자격증 목록으로 돌아가기</Link></p>
      </section>
    </>
  );
}
