export type ExternalSource = {
  id:
    | "korean-history"
    | "dataq"
    | "realtor"
    | "korcham-computer-level-1"
    | "korcham-regional-schedule-notices"
    | "samil-financial-manager-schedule"
    | "samil-financial-manager-guide";
  provider: string;
  certificationNames: string[];
  url: string;
  requiredText: string[];
};

export const externalSources: ExternalSource[] = [
  {
    id: "korean-history",
    provider: "국사편찬위원회",
    certificationNames: ["한국사능력검정시험"],
    url: "https://www.historyexam.go.kr/",
    requiredText: ["한국사능력검정시험"],
  },
  {
    id: "dataq",
    provider: "한국데이터산업진흥원",
    certificationNames: ["SQLD", "ADsP"],
    url: "https://www.dataq.or.kr/www/accept/schedule.do",
    requiredText: ["SQLD", "ADsP"],
  },
  {
    id: "realtor",
    provider: "Q-Net",
    certificationNames: ["공인중개사"],
    url: "https://www.q-net.or.kr/man001.do?gSite=L&gId=08",
    requiredText: ["공인중개사"],
  },
  {
    id: "korcham-computer-level-1",
    provider: "대한상공회의소",
    certificationNames: ["컴퓨터활용능력 1급"],
    url: "https://license.korcham.net/co/examguide.do?cd=0103&mm=21",
    requiredText: ["컴퓨터활용능력", "응시자격", "시험과목", "수험료"],
  },
  {
    id: "korcham-regional-schedule-notices",
    provider: "대한상공회의소",
    certificationNames: [],
    url: "https://license.korcham.net/customer/sangwiGuide.do",
    requiredText: ["전국상의별 공지안내", "지역", "상의", "공지사항"],
  },
  {
    id: "samil-financial-manager-schedule",
    provider: "삼일회계법인",
    certificationNames: ["재경관리사"],
    url: "https://www.samilexam.com/usr/groupguide.do",
    requiredText: ["국가공인 회계관리자격시험", "재경관리사", "원서접수", "합격자발표"],
  },
  {
    id: "samil-financial-manager-guide",
    provider: "삼일회계법인",
    certificationNames: [],
    url: "https://www.samilexam.com/usr/greeting.do",
    requiredText: ["재경관리사", "응시자격", "총비용", "합격기준", "재무회계", "세무회계", "원가관리회계"],
  },
];

export function validateExternalSourceHtml(source: ExternalSource, html: string): string[] {
  const compact = html.replace(/\s+/g, " ");
  return source.requiredText.filter((text) => !compact.includes(text));
}
