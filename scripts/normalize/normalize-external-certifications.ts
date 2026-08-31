import { load } from "cheerio";
import type { Certification, ExamSchedule } from "../../src/sites/certifications/types";

function pageText(html: string): string {
  const $ = load(html);
  $("script, style, noscript").remove();
  return $.root().text().replace(/\s+/g, " ").trim();
}

function isoDate(value: string): string {
  return value.replaceAll(".", "-");
}

function dateRange(text: string, label: string): [string, string] | undefined {
  const escaped = label.replace(/[.*+?^()|[\]\\]/g, "\\$&");
  const match = text.match(
    new RegExp(`${escaped}\\s*(20\\d{2}\\.\\d{2}\\.\\d{2})\\s*~\\s*(20\\d{2}\\.\\d{2}\\.\\d{2})`),
  );
  return match ? [isoDate(match[1]), isoDate(match[2])] : undefined;
}

export function normalizeRealtorHtml(
  html: string,
  fetchedAt: string,
  sourceUrl: string,
): Certification {
  const text = pageText(html);
  const application = dateRange(text, "접수기간");
  const exam = dateRange(text, "시험일정");
  const result = dateRange(text, "합격자발표기간");

  if (!application || !exam || !result) {
    throw new Error("공인중개사 공식 일정의 필수 날짜를 찾지 못했습니다.");
  }

  const year = exam[0].slice(0, 4);
  const roundNumber = text.match(/제?(\d+)회\s*공인중개사/)?.[1] ?? text.match(/(\d+)회\s*1차/)?.[1];
  const round = `${year}년도${roundNumber ? ` 제${roundNumber}회` : ""} 공인중개사`;
  const source = {
    provider: "Q-Net",
    endpoint: sourceUrl,
    officialPage: sourceUrl,
    fetchedAt,
  };
  const schedule: ExamSchedule = {
    round,
    examName: round,
    applicationStart: application[0],
    applicationEnd: application[1],
    examStart: exam[0],
    examEnd: exam[1],
    resultDate: result[0],
    source,
  };

  return {
    id: "external-realtor",
    slug: "certified-realtor",
    name: "공인중개사",
    officialName: "공인중개사",
    category: "부동산",
    level: "전문자격",
    issuer: "한국산업인력공단",
    officialUrl: sourceUrl,
    applicationUrl: sourceUrl,
    description: "부동산 중개 업무에 필요한 국가전문자격입니다.",
    schedules: [schedule],
    fees: [],
    eligibility: "응시자격 제한 없음",
    passRate: [],
    source,
    updatedAt: fetchedAt,
  };
}
