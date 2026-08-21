import type { Article } from "./articles";

export type QnetSchedule = {
  round: string;
  writtenApply: string;
  writtenExam: string;
  writtenResult: string;
  practicalApply: string;
  practicalExam: string;
  finalResult: string;
};

export type QnetOfficialInfo = {
  articleSlug: string;
  certificationName: string;
  jmCd: string;
  detailUrl: string;
  sourceName: string;
  checkedAt: string;
  ministry: string;
  issuer: string;
  writtenFee: string;
  practicalFee: string;
  scheduleNote: string;
  schedules: QnetSchedule[];
};

const regularEngineerSchedules: QnetSchedule[] = [
  {
    round: "2026년 정기 기사 1회",
    writtenApply: "2026.01.12 ~ 2026.01.15",
    writtenExam: "2026.01.30 ~ 2026.03.03",
    writtenResult: "2026.03.11",
    practicalApply: "2026.03.23 ~ 2026.03.26",
    practicalExam: "2026.04.18 ~ 2026.05.06",
    finalResult: "2026.06.12",
  },
  {
    round: "2026년 정기 기사 2회",
    writtenApply: "2026.04.20 ~ 2026.04.23",
    writtenExam: "2026.05.09 ~ 2026.05.29",
    writtenResult: "2026.06.10",
    practicalApply: "2026.06.22 ~ 2026.06.25",
    practicalExam: "2026.07.18 ~ 2026.08.05",
    finalResult: "2026.09.11",
  },
  {
    round: "2026년 정기 기사 3회",
    writtenApply: "2026.07.20 ~ 2026.07.23",
    writtenExam: "2026.08.07 ~ 2026.09.01",
    writtenResult: "2026.09.09",
    practicalApply: "2026.09.21 ~ 2026.09.28",
    practicalExam: "2026.10.24 ~ 2026.11.13",
    finalResult: "2026.12.18",
  },
];

const commonInfo = {
  sourceName: "Q-Net 국가자격 종목별 상세정보",
  checkedAt: "2026-08-21",
  issuer: "한국산업인력공단",
  writtenFee: "19,400원",
  scheduleNote:
    "원서접수는 첫날 10:00부터 마지막 날 18:00까지이며, 시험 일정은 종목별·지역별로 달라질 수 있습니다.",
  schedules: regularEngineerSchedules,
};

export const qnetOfficialInfoByArticleSlug: Record<string, QnetOfficialInfo> = {
  "what-to-know-before-information-processing-engineer": {
    ...commonInfo,
    articleSlug: "what-to-know-before-information-processing-engineer",
    certificationName: "정보처리기사",
    jmCd: "1320",
    detailUrl: "https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=1320",
    ministry: "과학기술정보통신부",
    practicalFee: "22,600원",
  },
  "why-electrical-engineer-license-is-popular": {
    ...commonInfo,
    articleSlug: "why-electrical-engineer-license-is-popular",
    certificationName: "전기기사",
    jmCd: "1150",
    detailUrl: "https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=1150",
    ministry: "산업통상자원부",
    practicalFee: "22,600원",
  },
  "industrial-safety-engineer-checkpoints": {
    ...commonInfo,
    articleSlug: "industrial-safety-engineer-checkpoints",
    certificationName: "산업안전기사",
    jmCd: "1431",
    detailUrl: "https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=1431",
    ministry: "고용노동부",
    practicalFee: "34,600원",
  },
};

export function getQnetOfficialInfo(article: Pick<Article, "slug">): QnetOfficialInfo | undefined {
  return qnetOfficialInfoByArticleSlug[article.slug];
}
