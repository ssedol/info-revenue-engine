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

function monthDay(year: string, value: string): string {
  const match = value.match(/(\d{1,2})\.(\d{1,2})/);
  if (!match) throw new Error(`날짜 형식을 해석할 수 없습니다: ${value}`);
  return `${year}-${match[1].padStart(2, "0")}-${match[2].padStart(2, "0")}`;
}

function monthDayRange(year: string, value: string): [string, string] {
  const [startValue, endValue] = value.replace(/\([^)]*\)/g, "").split("~");
  if (!startValue || !endValue) throw new Error(`기간 형식을 해석할 수 없습니다: ${value}`);
  const start = monthDay(year, startValue);
  const startMonth = start.slice(5, 7);
  const end = endValue.includes(".")
    ? monthDay(year, endValue)
    : `${year}-${startMonth}-${endValue.padStart(2, "0")}`;
  return [start, end];
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

type DataqTarget = {
  officialName: "데이터분석 준전문가" | "SQL 개발자";
  name: "ADsP" | "SQLD";
  slug: "adsp" | "sqld";
};

const dataqTargets: DataqTarget[] = [
  { officialName: "데이터분석 준전문가", name: "ADsP", slug: "adsp" },
  { officialName: "SQL 개발자", name: "SQLD", slug: "sqld" },
];

export function normalizeDataqHtml(
  html: string,
  fetchedAt: string,
  sourceUrl: string,
): Certification[] {
  const $ = load(html);
  const heading = $.root().text().replace(/\s+/g, " ");
  const year = heading.match(/(20\d{2})년도 일정/)?.[1];
  if (!year) throw new Error("데이터자격시험 일정 연도를 찾지 못했습니다.");

  const schedules = new Map<string, ExamSchedule[]>(
    dataqTargets.map(({ officialName }) => [officialName, []]),
  );
  let currentName = "";

  $("tr").each((_, row) => {
    const cells = $(row)
      .find("th, td")
      .map((__, cell) => $(cell).text().replace(/\s+/g, " ").trim())
      .get();
    const declared = dataqTargets.find(({ officialName }) => cells[0] === officialName);
    if (declared) currentName = declared.officialName;
    if (!schedules.has(currentName)) return;

    const values = declared ? cells.slice(1) : cells;
    if (!/^제\d+회$/.test(values[0] ?? "") || values.length < 7) return;
    const application = monthDayRange(year, values[2]);
    const examDate = monthDay(year, values[4]);
    const resultDate = monthDay(year, values[6]);
    const source = { provider: "한국데이터산업진흥원", endpoint: sourceUrl, officialPage: sourceUrl, fetchedAt };

    schedules.get(currentName)?.push({
      round: `${year}년 ${values[0]}`,
      examName: `${year}년 ${values[0]}`,
      applicationStart: application[0],
      applicationEnd: application[1],
      examStart: examDate,
      resultDate,
      source,
    });
  });

  return dataqTargets.map((target) => {
    const source = { provider: "한국데이터산업진흥원", endpoint: sourceUrl, officialPage: sourceUrl, fetchedAt };
    const targetSchedules = schedules.get(target.officialName) ?? [];
    if (targetSchedules.length === 0) throw new Error(`${target.name} 일정을 찾지 못했습니다.`);
    return {
      id: `external-${target.slug}`,
      slug: target.slug,
      name: target.name,
      officialName: target.officialName,
      category: "데이터",
      level: "국가공인",
      issuer: "한국데이터산업진흥원",
      officialUrl: sourceUrl,
      applicationUrl: "https://www.dataq.or.kr/www/accept/list.do",
      description: `${target.officialName} 자격시험입니다.`,
      schedules: targetSchedules,
      fees: [],
      eligibility: "응시자격 제한 없음",
      passRate: [],
      source,
      updatedAt: fetchedAt,
    };
  });
}

export function normalizeKoreanHistoryHtml(
  html: string,
  fetchedAt: string,
  sourceUrl: string,
): Certification {
  const text = pageText(html);
  const round = text.match(/제(\d+)회 한국사능력검정시험/)?.[1];
  const exam = text.match(/시험일\s*:\s*(20\d{2})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  const applicationStart = text.match(/원서접수 기간[\s\S]*?(\d{1,2})\.(\d{1,2})\.\([^)]*\)\s*10:00/);
  const applicationEnd = text.match(/(\d{1,2})\.(\d{1,2})\.\([^)]*\)\s*17:00\s*전지역/);
  if (!round || !exam || !applicationStart || !applicationEnd) {
    throw new Error("한국사능력검정시험 공식 일정의 필수 날짜를 찾지 못했습니다.");
  }
  const year = exam[1];
  const source = { provider: "국사편찬위원회", endpoint: sourceUrl, officialPage: sourceUrl, fetchedAt };
  const date = (month: string, day: string) =>
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  return {
    id: "external-korean-history",
    slug: "korean-history-proficiency-test",
    name: "한국사능력검정시험",
    officialName: "한국사능력검정시험",
    category: "역사",
    level: "인증시험",
    issuer: "국사편찬위원회",
    officialUrl: sourceUrl,
    applicationUrl: sourceUrl,
    description: "한국사 학습 능력을 평가하고 인증하는 시험입니다.",
    schedules: [{
      round: `${year}년 제${round}회`,
      examName: `${year}년 제${round}회 한국사능력검정시험`,
      applicationStart: date(applicationStart[1], applicationStart[2]),
      applicationEnd: date(applicationEnd[1], applicationEnd[2]),
      examStart: date(exam[2], exam[3]),
      source,
    }],
    fees: [],
    eligibility: "응시자격 제한 없음",
    passRate: [],
    source,
    updatedAt: fetchedAt,
  };
}
