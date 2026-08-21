import type { Article } from "./articles";

export type OfficialResource = {
  title: string;
  body: string;
  href: string;
  label: string;
};

const resourcesByCategory: Record<string, OfficialResource[]> = {
  "license-choice": [
    {
      title: "Q-Net 종목별 상세정보",
      body: "자격증별 관련부처, 시행기관, 시험정보, 기본정보, 우대현황, 일자리정보를 한 화면에서 확인할 수 있습니다.",
      href: "https://www.q-net.or.kr/crf005.do",
      label: "Q-Net 상세정보",
    },
    {
      title: "Q-Net 연간 국가기술자격 일정",
      body: "기술사, 기능장, 기사·산업기사, 기능사 정기/상시 시험 일정을 확인하는 공식 일정 페이지입니다.",
      href: "https://www.q-net.or.kr/crf021.do?id=crf02101&scheType=03",
      label: "연간 일정 보기",
    },
    {
      title: "NCS 직무 분류",
      body: "자격증을 직무와 연결해서 고를 때는 NCS의 대분류, 중분류, 소분류, 세분류 체계를 참고할 수 있습니다.",
      href: "https://www.ncs.go.kr/index.do",
      label: "NCS 보기",
    },
  ],
  "study-strategy": [
    {
      title: "Q-Net 출제기준/공개문제",
      body: "공부 범위와 문제 유형을 잡을 때는 Q-Net 자료실의 출제기준과 공개문제를 먼저 확인하는 것이 좋습니다.",
      href: "https://www.q-net.or.kr/cst006.do?id=cst00601",
      label: "자료실 보기",
    },
    {
      title: "Q-Net 필기시험 접수안내",
      body: "원서접수, 시험장 선택, 수험표 확인, 신분증 지참 같은 실제 응시 전 절차를 확인할 수 있습니다.",
      href: "https://www.q-net.or.kr/rcv001.do?gId=&gSite=Q&id=rcv00104",
      label: "접수안내 보기",
    },
    {
      title: "NCS 학습모듈",
      body: "직무별 학습 단위를 참고하면 자격증 공부 내용을 실제 직무 흐름과 연결해 이해하는 데 도움이 됩니다.",
      href: "https://www.ncs.go.kr/unity/th03/ncsSearchMain.do",
      label: "학습모듈 검색",
    },
  ],
  career: [
    {
      title: "Q-Net 일자리정보/우대현황",
      body: "종목별 상세정보 안의 우대현황과 일자리정보 탭을 보면 자격증이 어떤 직무와 연결되는지 확인할 수 있습니다.",
      href: "https://www.q-net.or.kr/crf005.do",
      label: "자격 상세 보기",
    },
    {
      title: "고용24 직업정보",
      body: "직업별 업무, 관련 직무, 취업 정보를 확인해 자격증이 실제 커리어에 어떻게 연결되는지 볼 수 있습니다.",
      href: "https://www.work24.go.kr/",
      label: "고용24 보기",
    },
    {
      title: "워크넷 직업정보",
      body: "직업 검색, 직업 분류, 미래직업, 직업인 인터뷰 등 커리어 글 소재로 활용할 수 있는 정보가 있습니다.",
      href: "https://www.work.go.kr/consltJobCarpa/srch/jobInfoSrch/srchJobInfo.do",
      label: "직업정보 보기",
    },
  ],
  "official-info": [
    {
      title: "Q-Net 공지사항",
      body: "시험 제도, 신분증 인정 범위, 실기시험 변경처럼 실제 응시에 영향을 주는 공지사항을 확인할 수 있습니다.",
      href: "https://www.q-net.or.kr/man004.do",
      label: "공지사항 보기",
    },
    {
      title: "Q-Net 국가기술자격 통계연보",
      body: "취득자 현황, 접수 상위 종목, 연령별 취득자 현황 등 글 소재로 쓸 수 있는 공식 통계가 있습니다.",
      href: "https://www.q-net.or.kr/crf012.do?gId=&gSite=Q&id=crf01209",
      label: "통계연보 보기",
    },
    {
      title: "Q-Net 자격정보 오픈 API",
      body: "자동 수집이 필요할 때는 자격정보 오픈 API를 활용할 수 있습니다. 운영 자동화는 이 단계에서 붙이면 됩니다.",
      href: "https://www.q-net.or.kr/cst012.do?gId=&gSite=Q&id=cst01203",
      label: "오픈 API 보기",
    },
  ],
  "cost-time": [
    {
      title: "Q-Net 필기/실기 수수료",
      body: "응시 수수료는 종목별 상세정보의 시험정보 영역에서 확인할 수 있습니다. 글 안의 금액은 확인일 기준입니다.",
      href: "https://www.q-net.or.kr/crf005.do",
      label: "수수료 확인",
    },
    {
      title: "고용24 훈련 정보",
      body: "직업훈련과 지원 제도를 확인하면 교재, 강의, 훈련비 계획을 세우는 데 도움이 됩니다.",
      href: "https://www.work24.go.kr/",
      label: "훈련 정보 보기",
    },
    {
      title: "HRD-Net",
      body: "직업훈련 과정과 훈련기관 정보를 확인할 때 참고할 수 있는 공식 직업훈련 사이트입니다.",
      href: "https://www.hrd.go.kr/",
      label: "HRD-Net 보기",
    },
  ],
  "exam-types": [
    {
      title: "Q-Net 국가기술자격 제도정보",
      body: "기능사, 산업기사, 기사, 기능장, 기술사 등 자격 체계를 이해할 때 먼저 볼 공식 제도 페이지입니다.",
      href: "https://www.q-net.or.kr/crf006.do",
      label: "제도정보 보기",
    },
    {
      title: "Q-Net 종목별 상세정보",
      body: "등급별 종목명, 영문명, 관련부처, 시행기관, 시험정보를 확인할 수 있습니다.",
      href: "https://www.q-net.or.kr/crf005.do",
      label: "종목 검색",
    },
    {
      title: "Q-Net 통계연보",
      body: "자격 등급별 취득자 현황과 접수 상위 종목을 보면 어떤 자격 체계가 많이 활용되는지 파악할 수 있습니다.",
      href: "https://www.q-net.or.kr/crf012.do?gId=&gSite=Q&id=crf01209",
      label: "통계 보기",
    },
  ],
};

export function getOfficialResources(article: Pick<Article, "category">): OfficialResource[] {
  return resourcesByCategory[article.category.slug] ?? resourcesByCategory["official-info"];
}
