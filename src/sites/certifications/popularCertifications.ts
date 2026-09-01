export type CertificationProvider = "qnet" | "history" | "dataq" | "korcham" | "samil";

export type PopularCertification = {
  name: string;
  provider: CertificationProvider;
  officialUrl?: string;
};

export const popularCertifications: PopularCertification[] = [
  { name: "정보처리기사", provider: "qnet" },
  { name: "전기기사", provider: "qnet" },
  { name: "산업안전기사", provider: "qnet" },
  { name: "건설안전기사", provider: "qnet" },
  { name: "소방설비기사(전기분야)", provider: "qnet" },
  { name: "소방설비기사(기계분야)", provider: "qnet" },
  { name: "건축기사", provider: "qnet" },
  { name: "토목기사", provider: "qnet" },
  { name: "일반기계기사", provider: "qnet" },
  { name: "전기산업기사", provider: "qnet" },
  { name: "위험물산업기사", provider: "qnet" },
  { name: "가스기사", provider: "qnet" },
  { name: "에너지관리기사", provider: "qnet" },
  { name: "대기환경기사", provider: "qnet" },
  { name: "수질환경기사", provider: "qnet" },
  { name: "직업상담사2급", provider: "qnet" },
  { name: "사회조사분석사2급", provider: "qnet" },
  { name: "지게차운전기능사", provider: "qnet" },
  { name: "전기기능사", provider: "qnet" },
  { name: "한식조리기능사", provider: "qnet" },
  { name: "제과기능사", provider: "qnet" },
  { name: "제빵기능사", provider: "qnet" },
  { name: "미용사(일반)", provider: "qnet" },
  { name: "컴퓨터그래픽스운용기능사", provider: "qnet" },
  { name: "웹디자인개발기능사", provider: "qnet" },
  {
    name: "한국사능력검정시험",
    provider: "history",
    officialUrl: "https://www.historyexam.go.kr/",
  },
  {
    name: "SQLD",
    provider: "dataq",
    officialUrl: "https://www.dataq.or.kr/www/main.do",
  },
  {
    name: "ADsP",
    provider: "dataq",
    officialUrl: "https://www.dataq.or.kr/www/main.do",
  },
  {
    name: "공인중개사",
    provider: "qnet",
    officialUrl: "https://www.q-net.or.kr/man001.do?gSite=L&gId=08",
  },
  {
    name: "컴퓨터활용능력 1급",
    provider: "korcham",
    officialUrl: "https://license.korcham.net/co/examguide.do?cd=0103&mm=21",
  },
  {
    name: "재경관리사",
    provider: "samil",
    officialUrl: "https://www.samilexam.com/usr/greeting.do",
  },
];

export const popularCertificationNames = new Set(
  popularCertifications.map(({ name }) => name),
);
