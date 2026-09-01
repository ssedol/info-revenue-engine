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
  const match = value.match(/(?:(20\d{2})\s*\.\s*)?(\d{1,2})\s*\.\s*(\d{1,2})/);
  if (!match) throw new Error(`날짜 형식을 해석할 수 없습니다: ${value}`);
  return `${match[1] ?? year}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
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

export function normalizeComputerLiteracyLevel1Html(
  html: string,
  fetchedAt: string,
  sourceUrl: string,
): Certification {
  const text = pageText(html);
  if (!["컴퓨터활용능력", "응시자격", "시험과목", "수험료"].every((value) => text.includes(value))) {
    throw new Error("컴퓨터활용능력 공식 안내의 필수 정보를 찾지 못했습니다.");
  }

  const writtenFee = Number(text.match(/필기\s*:\s*([\d,]+)원/)?.[1].replaceAll(",", ""));
  const practicalFee = Number(text.match(/실기\s*:\s*([\d,]+)원/)?.[1].replaceAll(",", ""));
  if (!writtenFee || !practicalFee) throw new Error("컴퓨터활용능력 수험료를 찾지 못했습니다.");

  const source = {
    provider: "대한상공회의소",
    endpoint: sourceUrl,
    officialPage: sourceUrl,
    fetchedAt,
  };

  return {
    id: "korcham-computer-literacy-level-1",
    slug: "computer-literacy-level-1",
    name: "컴퓨터활용능력 1급",
    officialName: "컴퓨터활용능력 1급",
    category: "사무정보",
    level: "1급",
    issuer: "대한상공회의소",
    officialUrl: sourceUrl,
    applicationUrl: "https://license.korcham.net/ex/dailyExam_join.do",
    description:
      "스프레드시트와 데이터베이스 활용 능력을 평가하는 국가기술자격입니다. 필기시험 합격 후 2년 이내에 실기시험에 응시할 수 있으며 시험은 지역 시험장별 상시검정으로 운영됩니다.",
    schedules: [{
      round: "상시검정",
      examName: "시험장별 상시 시행 · 개설일로부터 시험일 4일 전까지 접수",
      source,
    }],
    fees: [
      { label: "필기", amount: writtenFee, currency: "KRW", source },
      { label: "실기", amount: practicalFee, currency: "KRW", source },
    ],
    eligibility: "제한 없음(실기시험은 필기 합격 후 2년 이내 응시 가능)",
    passRate: [],
    source,
    updatedAt: fetchedAt,
  };
}

export function normalizeFinancialManagerHtml(
  scheduleHtml: string,
  guideHtml: string,
  fetchedAt: string,
  scheduleUrl: string,
): Certification {
  const $ = load(scheduleHtml);
  const headingText = pageText(scheduleHtml);
  const year = headingText.match(/(20\d{2})년\s*국가공인 회계관리자격시험/)?.[1];
  if (!year) throw new Error("재경관리사 공식 일정 연도를 찾지 못했습니다.");

  const source = {
    provider: "삼일회계법인",
    endpoint: scheduleUrl,
    officialPage: "https://www.samilexam.com/usr/greeting.do",
    fetchedAt,
  };
  const schedules: ExamSchedule[] = [];

  $("table").each((_, table) => {
    const caption = $(table).find("caption").text().replace(/\s+/g, " ").trim();
    if (caption !== "국가공인 회계관리자격시험") return;

    $(table).find("tbody tr").each((__, row) => {
      const cells = $(row).find("td").map((___, cell) => $(cell).text().replace(/\s+/g, " ").trim()).get();
      const values = cells[0] === year ? cells.slice(1) : cells;
      if (values.length < 5) return;
      const roundNumber = values[1].match(/재경관리사\s*(\d+)회/)?.[1];
      if (!roundNumber) return;
      const application = monthDayRange(year, values[2]);
      schedules.push({
        round: `${year}년 제${roundNumber}회`,
        examName: `재경관리사 제${roundNumber}회`,
        applicationStart: application[0],
        applicationEnd: application[1],
        examStart: monthDay(year, values[3]),
        resultDate: monthDay(year, values[4]),
        source,
      });
    });
  });

  if (schedules.length === 0) throw new Error("재경관리사 공식 시험일정을 찾지 못했습니다.");

  const guideText = pageText(guideHtml);
  const requiredGuideText = [
    "재경관리사",
    "연령, 학력, 경력 제한 없음",
    "응시료 70,000원",
    "재무회계, 세무회계, 원가관리회계",
    "과목별 40문항",
    "과목별 70점",
  ];
  const missing = requiredGuideText.filter((value) => !guideText.includes(value));
  if (missing.length > 0) {
    throw new Error(`재경관리사 공식 안내의 필수 정보를 찾지 못했습니다: ${missing.join(", ")}`);
  }

  return {
    id: "samil-financial-manager",
    slug: "financial-manager",
    name: "재경관리사",
    officialName: "국가공인 재경관리사",
    category: "회계·세무",
    level: "국가공인 민간자격",
    issuer: "삼일회계법인",
    officialUrl: "https://www.samilexam.com/usr/greeting.do",
    applicationUrl: "https://www.samilexam.com/usr/login.do",
    description:
      "재무회계·세무회계·원가관리회계 지식과 실무능력을 평가합니다. 세 과목을 150분 동안 객관식으로 치르며, 전 과목에서 과목별 70점 이상을 받아야 합격합니다.",
    schedules,
    fees: [{ label: "응시", amount: 70000, currency: "KRW", source }],
    eligibility: "연령, 학력, 경력 제한 없음",
    passRate: [],
    source,
    updatedAt: fetchedAt,
  };
}
