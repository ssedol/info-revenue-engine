import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/core/ui/Breadcrumb";
import { buildMetadata } from "@/core/seo/metadata";
import { faqJsonLd, JsonLd } from "@/core/seo/structured-data";
import { getCertificationDeepDive } from "@/sites/certifications/certificationDeepDives";
import { getCertificationGuide } from "@/sites/certifications/certificationGuides";
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
  const deepDive = getCertificationDeepDive(certification.name);
  return buildMetadata({
    title: deepDive?.seoTitle ?? `${certification.name} 2026 시험일정`,
    description: deepDive?.seoDescription ?? `${certification.name}의 2026년 필기·실기 원서접수, 시험일정과 공식 정보를 확인합니다.`,
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
  const guide = getCertificationGuide(certification.name);
  const deepDive = getCertificationDeepDive(certification.name);
  const providerName = certification.source.provider;
  const hasPracticalSchedule = certification.schedules.some((schedule) =>
    Boolean(schedule.practicalApplicationStart || schedule.practicalExamStart),
  );

  return (
    <>
      {deepDive && <JsonLd value={faqJsonLd(deepDive.faqs)} />}
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "자격증 목록", href: "/certifications" }, { label: certification.name }]} />
      <section className="hero certification-detail-hero">
        <div className="certification-hero-copy">
          <div className="certification-card-meta">
            {certification.level && <span>{certification.level}</span>}
            <span>{certification.category}</span>
            <span>2026 일정</span>
          </div>
          <h1>{certification.name}</h1>
          <p>{deepDive?.eligibility ?? guide?.overview ?? `시행기관 ${certification.issuer}의 공식 시험정보를 정리했습니다.`}</p>
          <div className="official-actions">
            {certification.applicationUrl && <a href={certification.applicationUrl} target="_blank" rel="noreferrer">원서접수 바로가기</a>}
            {certification.officialUrl && <a href={certification.officialUrl} target="_blank" rel="noreferrer">공식정보 확인</a>}
          </div>
        </div>
        <dl className="certification-quick-facts">
          <div><dt>시행기관</dt><dd>{certification.issuer}</dd></div>
          <div><dt>시험 단계</dt><dd>{deepDive ? deepDive.examSubjects.map(({ stage }) => stage).join(" · ") : hasPracticalSchedule ? "필기 · 실기" : "단일 시험"}</dd></div>
          <div><dt>응시료</dt><dd>{certification.fees.length > 0 ? certification.fees.map((fee) => `${fee.label} ${fee.amount.toLocaleString("ko-KR")}원`).join(" · ") : "공식정보 확인"}</dd></div>
          <div><dt>정보 기준일</dt><dd>{deepDive?.verifiedAt ?? certification.updatedAt.slice(0, 10)}</dd></div>
        </dl>
      </section>

      <nav className="certification-page-nav" aria-label="페이지 바로가기">
        <a href="#schedule-title">시험일정</a>
        {deepDive && <a href="#exam-guide-title">시험정보</a>}
        {deepDive && <a href="#study-plan-title">준비순서</a>}
        {deepDive && <a href="#faq-title">FAQ</a>}
        <a href="#basic-info-title">기본정보</a>
      </nav>

      <section className="section certification-content-section" aria-labelledby="schedule-title">
        <div className="certification-section-heading">
          <div><span>01</span><h2 id="schedule-title">2026 시험일정</h2></div>
          <p>접수 전 공식 공고를 한 번 더 확인하세요.</p>
        </div>
        <p className="schedule-notice">아래 일정은 {providerName} 공식 시험정보 기준입니다. 종목과 지역에 따라 시행 회차가 다를 수 있으므로 접수 전 공식 상세정보를 다시 확인하세요.</p>
        {certification.schedules.length > 0 ? (
          <div className="schedule-table-wrap">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th scope="col">회차</th>
                  <th scope="col">{hasPracticalSchedule ? "필기 접수" : "원서접수"}</th>
                  <th scope="col">{hasPracticalSchedule ? "필기시험" : "시험일"}</th>
                  {hasPracticalSchedule && <th scope="col">실기 접수</th>}
                  {hasPracticalSchedule && <th scope="col">실기시험</th>}
                  <th scope="col">합격자 발표</th>
                </tr>
              </thead>
              <tbody>
                {certification.schedules.map((schedule) => (
                  <tr key={schedule.round ?? schedule.examName}>
                    <th scope="row">{schedule.examName ?? schedule.round}</th>
                    <td>{formatDate(schedule.applicationStart)} ~ {formatDate(schedule.applicationEnd)}</td>
                    <td>{formatDate(schedule.examStart)}</td>
                    {hasPracticalSchedule && <td>{formatDate(schedule.practicalApplicationStart)} ~ {formatDate(schedule.practicalApplicationEnd)}</td>}
                    {hasPracticalSchedule && <td>{formatDate(schedule.practicalExamStart)} ~ {formatDate(schedule.practicalExamEnd)}</td>}
                    <td>{formatDate(schedule.practicalResultDate ?? schedule.resultDate)}</td>
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

      {certification.slug === "computer-literacy-level-1" && (
        <section className="section certification-content-section" aria-labelledby="regional-schedule-title">
          <div className="certification-section-heading compact">
            <div><span>+</span><h2 id="regional-schedule-title">지역·시험장별 상시검정</h2></div>
          </div>
          <p className="schedule-notice">
            대한상공회의소 공식 지역별 개설 공지와 직접 확인한 시험장 일정을 함께 제공합니다.
            잔여석은 수시로 바뀌므로 원서접수 전 공식 시험장 조회에서 다시 확인하세요.
          </p>

          <h3>직접 확인한 시험장 일정 <span className="schedule-source-badge manual">수동 검증</span></h3>
          {(certification.manualVenueSchedules?.length ?? 0) > 0 ? (
            <div className="schedule-table-wrap">
              <table className="schedule-table">
                <thead><tr><th scope="col">지역</th><th scope="col">시험장</th><th scope="col">구분</th><th scope="col">시험일시</th><th scope="col">확인일</th></tr></thead>
                <tbody>
                  {certification.manualVenueSchedules?.map((schedule) => (
                    <tr key={`${schedule.venue}-${schedule.examType}-${schedule.examDate}-${schedule.startTime ?? ""}`}>
                      <td>{schedule.region} · {schedule.chamber}</td>
                      <th scope="row"><a href={schedule.officialUrl} target="_blank" rel="noreferrer">{schedule.venue}</a></th>
                      <td>{schedule.examType}</td>
                      <td>{formatDate(schedule.examDate)} {schedule.startTime ?? ""}{schedule.note ? ` · ${schedule.note}` : ""}</td>
                      <td>{formatDate(schedule.verifiedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="search-empty"><p>현재 직접 확인해 등록한 시험장 일정은 없습니다.</p></div>
          )}

          <details className="regional-notice-details">
            <summary>전국 상공회의소 개설 공지 보기 <span className="schedule-source-badge">공식 자동수집</span></summary>
            <div className="regional-notice-list">
              {certification.regionalScheduleNotices?.map((notice) => (
                <article key={`${notice.region}-${notice.chamber}`}>
                  <h3>{notice.region} · {notice.chamber}상공회의소</h3>
                  <p>{notice.notice}</p>
                </article>
              ))}
            </div>
          </details>

          <p><a href="https://license.korcham.net/ex/dailyExamPlaceConf.do" target="_blank" rel="noreferrer">공식 시험장별 날짜·시간·잔여석 확인</a></p>
        </section>
      )}

      {deepDive && (
        <>
          <section className="section certification-content-section" aria-labelledby="exam-guide-title">
            <div className="certification-section-heading">
              <div><span>02</span><h2 id="exam-guide-title">시험 구성과 합격 기준</h2></div>
              <p>공식 출제 범위를 기준으로 핵심만 정리했습니다.</p>
            </div>

            <div className="exam-guide-grid">
              <article className="exam-info-card exam-info-card--wide">
                <p className="card-eyebrow">시험과목</p>
                {deepDive.examSubjects.map(({ stage, subjects }) => (
                  <div className="subject-group" key={stage}>
                    <strong>{stage}</strong>
                    <ul>{subjects.map((subject) => <li key={subject}>{subject}</li>)}</ul>
                  </div>
                ))}
              </article>
              <article className="exam-info-card">
                <p className="card-eyebrow">시험 방식</p>
                <p>{deepDive.examFormat}</p>
              </article>
              <article className="exam-info-card exam-info-card--accent">
                <p className="card-eyebrow">합격 기준</p>
                <p>{deepDive.passRule}</p>
              </article>
              <article className="exam-info-card">
                <p className="card-eyebrow">응시자격</p>
                <p>{deepDive.eligibility}</p>
              </article>
            </div>

            <p className="official-source-line">공식 확인 · <a href={deepDive.officialSource} target="_blank" rel="noreferrer">시행기관 시험정보</a> · 확인일 {deepDive.verifiedAt}</p>
          </section>

          <section className="section certification-content-section" aria-labelledby="study-plan-title">
            <div className="certification-section-heading">
              <div><span>03</span><h2 id="study-plan-title">준비 순서</h2></div>
              <p>무엇부터 해야 할지 단계별로 정리했습니다.</p>
            </div>
            <p className="study-plan-note">{deepDive.planNote}</p>
            <ol className="study-plan-list">
              {deepDive.studyPlan.map((step) => (
                <li key={step.title}><strong>{step.title}</strong><p>{step.description}</p></li>
              ))}
            </ol>
          </section>

          {guide && (
            <section className="section certification-content-section" aria-labelledby="use-guide-title">
              <div className="certification-section-heading compact">
                <div><span>04</span><h2 id="use-guide-title">취득 후 활용 방향</h2></div>
              </div>
              <div className="use-guide-grid">
                <article><h3>활용 분야</h3><ul className="clean-check-list">{guide.useCases.map((item) => <li key={item}>{item}</li>)}</ul></article>
                <article><h3>함께 비교할 자격증</h3><ul className="related-certification-list">
                  {guide.comparisons.map((name) => {
                    const comparison = getCertifications().find((item) => item.name === name);
                    return comparison ? <li key={name}><Link href={certificationPath(comparison)}>{name}<span>비교하기 →</span></Link></li> : null;
                  })}
                </ul></article>
              </div>
            </section>
          )}

          <section className="section certification-content-section" aria-labelledby="faq-title">
            <div className="certification-section-heading">
              <div><span>05</span><h2 id="faq-title">자주 묻는 질문</h2></div>
            </div>
            <div className="certification-faq-list">
              {deepDive.faqs.map((faq) => (
                <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>
              ))}
            </div>
          </section>
        </>
      )}

      {guide && !deepDive && (
        <section className="section certification-content-section" aria-labelledby="guide-title">
          <div className="certification-section-heading">
            <div><span>02</span><h2 id="guide-title">{certification.name} 준비 가이드</h2></div>
          </div>
          <p className="guide-overview">{guide.overview}</p>

          <div className="use-guide-grid">
            <section>
              <h3>어디에 활용할 수 있나요?</h3>
              <ul className="clean-check-list">
                {guide.useCases.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
            <section>
              <h3>준비할 때 확인할 점</h3>
              <ul className="clean-check-list">
                {guide.preparation.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
            <section>
              <h3>함께 비교할 자격증</h3>
              <ul className="related-certification-list">
                {guide.comparisons.map((name) => {
                  const comparison = getCertifications().find((item) => item.name === name);
                  return comparison ? (
                    <li key={name}><Link href={certificationPath(comparison)}>{name}<span>비교하기 →</span></Link></li>
                  ) : null;
                })}
              </ul>
            </section>
          </div>
        </section>
      )}

      <section className="section certification-content-section certification-basic-section" aria-labelledby="basic-info-title">
        <details>
          <summary id="basic-info-title">자격증 기본정보 전체 보기</summary>
          <dl className="meta-list">
            <div><dt>공식 자격명</dt><dd>{certification.officialName}</dd></div>
            <div><dt>등급</dt><dd>{certification.level ?? "분류 없음"}</dd></div>
            <div><dt>분야</dt><dd>{certification.category}</dd></div>
            <div><dt>시행기관</dt><dd>{certification.issuer}</dd></div>
            <div><dt>데이터 기준일</dt><dd>{certification.updatedAt.slice(0, 10)}</dd></div>
            {certification.eligibility && <div><dt>응시자격</dt><dd>{certification.eligibility}</dd></div>}
            {certification.fees.map((fee) => (
              <div key={fee.label}><dt>{fee.label} 수험료</dt><dd>{fee.amount.toLocaleString("ko-KR")}원</dd></div>
            ))}
          </dl>
        </details>
        <p className="back-to-list"><Link href="/certifications">← 자격증 전체 목록</Link></p>
      </section>
    </>
  );
}
