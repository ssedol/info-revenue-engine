export type ExternalSource = {
  id: "korean-history" | "dataq" | "realtor";
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
];

export function validateExternalSourceHtml(source: ExternalSource, html: string): string[] {
  const compact = html.replace(/\s+/g, " ");
  return source.requiredText.filter((text) => !compact.includes(text));
}
