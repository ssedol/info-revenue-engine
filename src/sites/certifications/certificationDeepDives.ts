export type CertificationDeepDive = {
  examSubjects: Array<{ stage: string; subjects: string[] }>;
  examFormat: string;
  passRule: string;
  eligibility: string;
  planNote: string;
  studyPlan: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  officialSource: string;
  verifiedAt: string;
};

const qnetArticlePassRule = "필기는 과목당 40점 이상이면서 전 과목 평균 60점 이상, 실기는 100점 만점에 60점 이상이어야 합니다.";
const qnetArticleEligibility = "기사 등급 응시자격이 적용됩니다. 학력·경력·관련 전공에 따라 달라지므로 Q-Net 응시자격 자가진단에서 본인 조건을 확인해야 합니다.";

const deepDives: Record<string, CertificationDeepDive> = {
  "컴퓨터활용능력 1급": {
    examSubjects: [
      { stage: "필기", subjects: ["컴퓨터 일반", "스프레드시트 일반", "데이터베이스 일반"] },
      { stage: "실기", subjects: ["스프레드시트 실무", "데이터베이스 실무"] },
    ],
    examFormat: "필기는 객관식, 실기는 컴퓨터 작업형으로 시행됩니다. 1급 실기는 스프레드시트와 데이터베이스 두 과목을 모두 치릅니다.",
    passRule: "필기는 과목당 40점 이상이면서 평균 60점 이상, 실기는 두 과목 모두 70점 이상이어야 합니다.",
    eligibility: "응시자격 제한이 없어 학력이나 경력과 관계없이 응시할 수 있습니다.",
    planNote: "처음 준비한다면 8~12주를 예시로 잡되, 엑셀·액세스 사용 경험에 따라 기간을 조정하세요. 공식 권장 기간이 아닌 학습계획 예시입니다.",
    studyPlan: [
      { title: "1단계 · 기능 익히기", description: "함수와 데이터 처리 기능을 직접 실행하며 메뉴 위치와 결과를 익힙니다." },
      { title: "2단계 · 작업 순서 만들기", description: "기출 유형별로 풀이 순서를 정하고 자주 틀리는 함수와 쿼리를 따로 기록합니다." },
      { title: "3단계 · 시간 맞춰 풀기", description: "실제 시험 시간에 맞춰 두 과목을 풀고 저장 위치와 파일 제출까지 점검합니다." },
    ],
    faqs: [
      { question: "컴활 1급은 필기와 실기를 같은 날 보나요?", answer: "아닙니다. 필기 합격 후 실기를 별도로 접수합니다. 지역과 시험장별 개설 일정도 서로 다를 수 있습니다." },
      { question: "실기 한 과목만 70점을 넘으면 합격인가요?", answer: "아닙니다. 1급 실기는 스프레드시트와 데이터베이스 두 과목 모두 70점 이상이어야 합니다." },
      { question: "시험장마다 프로그램 환경이 같은가요?", answer: "시험에 적용되는 프로그램 버전과 운영 안내는 변경될 수 있으므로 접수 전 대한상공회의소 종목소개와 수험자 안내를 확인하세요." },
    ],
    officialSource: "https://license.korcham.net/co/examguide.do?cd=0103&mm=21",
    verifiedAt: "2026-09-02",
  },
  "정보처리기사": {
    examSubjects: [
      { stage: "필기", subjects: ["소프트웨어 설계", "소프트웨어 개발", "데이터베이스 구축", "프로그래밍 언어 활용", "정보시스템 구축관리"] },
      { stage: "실기", subjects: ["정보처리 실무"] },
    ],
    examFormat: "필기는 객관식 4지 택일형으로 과목당 20문항, 실기는 필답형으로 시행됩니다.",
    passRule: qnetArticlePassRule,
    eligibility: qnetArticleEligibility,
    planNote: "기초가 있다면 8~12주, 비전공 입문자는 더 긴 기간을 두고 계획하는 방식이 일반적입니다. 개인별 차이가 큰 학습계획 예시입니다.",
    studyPlan: [
      { title: "1단계 · 전체 구조 파악", description: "다섯 필기 과목의 용어를 연결하고 데이터베이스와 프로그래밍 기초를 먼저 정리합니다." },
      { title: "2단계 · 기출로 약점 확인", description: "과목별 과락을 피할 수 있도록 점수가 낮은 영역을 찾아 개념과 문제를 함께 복습합니다." },
      { title: "3단계 · 실기 답안 연습", description: "SQL, 프로그래밍, 요구사항과 테스트 관련 답을 직접 쓰며 정확한 용어 표현을 익힙니다." },
    ],
    faqs: [
      { question: "비전공자도 정보처리기사에 응시할 수 있나요?", answer: "전공 여부만으로 결정되지 않습니다. 학력·경력·보유 자격에 따라 달라지므로 Q-Net 응시자격 자가진단이 필요합니다." },
      { question: "필기 한 과목이 40점 미만이면 평균이 높아도 합격인가요?", answer: "아닙니다. 전 과목 평균 60점 이상이어도 한 과목이 40점 미만이면 필기 과락입니다." },
      { question: "2026년 출제기준을 따로 확인해야 하나요?", answer: "네. Q-Net에 2026년 적용 출제기준이 안내되어 있으므로 과거 교재를 사용한다면 변경 범위를 먼저 확인하세요." },
    ],
    officialSource: "https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=1320",
    verifiedAt: "2026-09-02",
  },
  "전기기사": {
    examSubjects: [
      { stage: "필기", subjects: ["전기자기학", "전력공학", "전기기기", "회로이론 및 제어공학", "전기설비기술기준"] },
      { stage: "실기", subjects: ["전기설비설계 및 관리"] },
    ],
    examFormat: "필기는 객관식 4지 택일형으로 과목당 20문항, 실기는 2시간 30분 필답형으로 시행됩니다.",
    passRule: qnetArticlePassRule,
    eligibility: qnetArticleEligibility,
    planNote: "전기 기초가 있다면 12~16주를 예시로 잡고, 수학·회로 기초가 약하면 선행학습 기간을 추가하세요.",
    studyPlan: [
      { title: "1단계 · 회로 기초 정리", description: "회로이론과 전기자기학의 공식이 어떤 상황에 쓰이는지 단위와 함께 정리합니다." },
      { title: "2단계 · 과목별 계산 반복", description: "전력·기기 과목의 대표 계산 유형을 풀고 기술기준은 최신 기준으로 암기합니다." },
      { title: "3단계 · 실기 서술과 계산", description: "단답·계산·설비 문제를 시간 안에 풀고 풀이 과정과 단위를 빠뜨리지 않는 연습을 합니다." },
    ],
    faqs: [
      { question: "전기기사와 전기산업기사 중 무엇을 먼저 봐야 하나요?", answer: "응시자격과 목표 직무가 기준입니다. 기사 응시자격이 아직 없다면 산업기사 또는 기능사 경로와 비교하세요." },
      { question: "실기시험은 작업형인가요?", answer: "Q-Net 안내 기준 전기기사 실기는 전기설비설계 및 관리에 대한 필답형입니다." },
      { question: "법규는 예전 교재로 준비해도 되나요?", answer: "전기설비기술기준과 한국전기설비규정은 시험일 기준이 적용되므로 최신 출제기준과 개정 내용을 확인해야 합니다." },
    ],
    officialSource: "https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=1150",
    verifiedAt: "2026-09-02",
  },
  "산업안전기사": {
    examSubjects: [
      { stage: "필기", subjects: ["산업재해 예방 및 안전보건교육", "인간공학 및 위험성 평가·관리", "기계·기구 및 설비 안전관리", "전기설비 안전관리", "화학설비 안전관리", "건설공사 안전관리"] },
      { stage: "실기", subjects: ["산업안전관리 실무"] },
    ],
    examFormat: "필기는 객관식 4지 택일형, 실기는 필답형과 작업형을 결합한 복합형으로 시행됩니다.",
    passRule: qnetArticlePassRule,
    eligibility: qnetArticleEligibility,
    planNote: "안전 관련 업무 경험이 없다면 10~14주를 예시로 잡고, 법규와 설비별 위험요인을 반복해서 연결하세요.",
    studyPlan: [
      { title: "1단계 · 위험요인 분류", description: "기계·전기·화학·건설 분야별 사고 유형과 예방 원칙을 나누어 정리합니다." },
      { title: "2단계 · 법규와 수치 정리", description: "안전보건 기준의 핵심 수치와 의무를 최신 출제기준에 맞춰 복습합니다." },
      { title: "3단계 · 사례형 답안", description: "사진과 사고 사례에서 위험요인을 찾고 대책을 법적·기술적 표현으로 작성합니다." },
    ],
    faqs: [
      { question: "산업안전기사와 건설안전기사의 차이는 무엇인가요?", answer: "산업안전기사는 여러 산업의 기계·전기·화학·건설 위험을 폭넓게 다루고, 건설안전기사는 건설 공정과 현장 안전에 더 집중합니다." },
      { question: "실기는 필답형만 준비하면 되나요?", answer: "아닙니다. Q-Net 안내 기준 복합형이므로 필답형과 작업형을 모두 준비해야 합니다." },
      { question: "법령 개정 내용을 확인해야 하나요?", answer: "네. 안전보건 관련 기준은 변경될 수 있으므로 시험 시행일에 적용되는 출제기준과 최신 법령을 확인하세요." },
    ],
    officialSource: "https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=1431",
    verifiedAt: "2026-09-02",
  },
  "공인중개사": {
    examSubjects: [
      { stage: "1차", subjects: ["부동산학개론", "민법 및 민사특별법 중 부동산 중개 관련 규정"] },
      { stage: "2차", subjects: ["공인중개사법령 및 중개실무", "부동산공법 중 부동산 중개 관련 규정", "부동산공시법 및 부동산세법"] },
    ],
    examFormat: "1차와 2차 모두 객관식 5지 선택형입니다. 같은 해에 1·2차를 함께 응시하거나 단계적으로 준비할 수 있습니다.",
    passRule: "1차와 2차 각각 매 과목 40점 이상이면서 전 과목 평균 60점 이상이어야 합니다. 세부 면제·합격 처리 기준은 해당 연도 시행계획을 확인하세요.",
    eligibility: "응시자격 제한은 없지만 부정행위 처분 등 개별 제한 사유는 해당 연도 시행계획에서 확인해야 합니다.",
    planNote: "동차 준비는 보통 장기 계획이 필요합니다. 1·2차 범위를 함께 시작할지 1차 중심으로 갈지 먼저 정하고 월별 계획을 세우세요.",
    studyPlan: [
      { title: "1단계 · 민법과 학개론 기초", description: "1차 핵심 개념을 이해하고 용어와 계산 유형을 먼저 안정시킵니다." },
      { title: "2단계 · 2차 법령 연결", description: "중개사법·공법·공시세법을 과목별 체계와 빈출 규정 중심으로 정리합니다." },
      { title: "3단계 · 전 과목 모의시험", description: "과락 과목이 생기지 않도록 실제 시간표에 맞춰 전 과목 점수 균형을 점검합니다." },
    ],
    faqs: [
      { question: "공인중개사 시험은 누구나 응시할 수 있나요?", answer: "원칙적으로 응시자격 제한은 없습니다. 다만 부정행위 처분 등 제한 사유는 공식 시행계획을 확인해야 합니다." },
      { question: "1차만 합격하면 다음 해에 다시 볼 수 있나요?", answer: "1차시험 합격자는 다음 회 시험에서 1차 면제 제도가 적용될 수 있습니다. 정확한 범위는 해당 연도 시행계획을 확인하세요." },
      { question: "평균 60점이면 한 과목이 40점 미만이어도 되나요?", answer: "아닙니다. 각 시험에서 매 과목 40점 이상과 전 과목 평균 60점 이상을 모두 충족해야 합니다." },
    ],
    officialSource: "https://www.q-net.or.kr/site/junggae",
    verifiedAt: "2026-09-02",
  },
  "한국사능력검정시험": {
    examSubjects: [{ stage: "심화", subjects: ["한국사 전 범위: 선사 시대부터 현대까지"] }],
    examFormat: "심화 시험은 50문항으로 역사 자료의 해석, 시대 흐름과 주요 사건의 이해를 평가합니다. 회차별 시험 종류와 시간은 공식 응시요강을 확인하세요.",
    passRule: "심화 기준 80점 이상은 1급, 70점 이상은 2급, 60점 이상은 3급으로 인증됩니다.",
    eligibility: "연령·학력 등 응시자격 제한 없이 응시할 수 있습니다.",
    planNote: "기초가 약하다면 6~10주를 예시로 시대 흐름을 먼저 잡고, 목표 등급에 맞춰 기출 점수를 확인하세요.",
    studyPlan: [
      { title: "1단계 · 시대 흐름", description: "왕조와 정치 변화만 외우기보다 사회·경제·문화 사건을 같은 시간축에 놓습니다." },
      { title: "2단계 · 자료 연결", description: "유물·지도·사료의 핵심 단어를 보고 시대와 사건을 찾는 연습을 합니다." },
      { title: "3단계 · 목표 등급 점검", description: "최근 기출을 시간 안에 풀고 1·2·3급 목표 점수에 안정적으로 도달하는지 확인합니다." },
    ],
    faqs: [
      { question: "몇 점을 받아야 한국사 1급인가요?", answer: "심화 시험에서 80점 이상이면 1급으로 인증됩니다." },
      { question: "한국사 시험에 응시자격이 있나요?", answer: "별도의 학력이나 경력 제한 없이 응시할 수 있습니다." },
      { question: "모든 회차에 같은 시험 종류가 열리나요?", answer: "회차별 시행 종류와 접수 일정이 달라질 수 있으므로 국사편찬위원회 공식 응시요강을 확인하세요." },
    ],
    officialSource: "https://www.historyexam.go.kr/",
    verifiedAt: "2026-09-02",
  },
  "SQLD": {
    examSubjects: [{ stage: "필기", subjects: ["데이터 모델링의 이해", "SQL 기본 및 활용"] }],
    examFormat: "객관식 50문항을 90분 동안 치르는 필기시험입니다. 과목별 문항 비중은 공식 출제기준에서 확인하세요.",
    passRule: "총점 60점 이상이면서 각 과목에서 40% 이상 득점해야 합니다.",
    eligibility: "응시자격 제한이 없어 전공이나 경력과 관계없이 응시할 수 있습니다.",
    planNote: "SQL을 처음 접한다면 4~8주를 예시로 잡고, 문법을 읽는 데 그치지 말고 직접 쿼리를 실행하세요.",
    studyPlan: [
      { title: "1단계 · 모델링 이해", description: "엔터티·속성·관계와 정규화가 실제 테이블 구조에 어떻게 반영되는지 익힙니다." },
      { title: "2단계 · SQL 직접 실행", description: "조회·조인·서브쿼리·집계와 윈도 함수의 결과를 예측한 뒤 직접 확인합니다." },
      { title: "3단계 · 과락 방지", description: "문항 비중이 작은 모델링 과목도 과락이 없도록 기출 점수를 따로 관리합니다." },
    ],
    faqs: [
      { question: "비전공자도 SQLD에 응시할 수 있나요?", answer: "네. SQLD는 응시자격 제한이 없습니다." },
      { question: "총점 60점이면 무조건 합격인가요?", answer: "아닙니다. 총점 60점 이상과 함께 과목별 40% 이상 조건도 충족해야 합니다." },
      { question: "SQL을 설치해서 연습해야 하나요?", answer: "필수 조건은 아니지만 쿼리 결과를 직접 확인하면 조인과 함수의 동작을 이해하는 데 도움이 됩니다." },
    ],
    officialSource: "https://www.dataq.or.kr/www/main.do",
    verifiedAt: "2026-09-02",
  },
  "ADsP": {
    examSubjects: [{ stage: "필기", subjects: ["데이터 이해", "데이터분석 기획", "데이터분석"] }],
    examFormat: "세 과목, 총 50문항을 90분 동안 치르는 객관식 필기시험입니다.",
    passRule: "총점 60점 이상이면서 각 과목에서 40% 이상 득점해야 합니다.",
    eligibility: "응시자격 제한이 없어 전공이나 경력과 관계없이 응시할 수 있습니다.",
    planNote: "통계 기초가 있다면 4~6주, 처음 접한다면 6~10주를 예시로 개념과 문제풀이 시간을 나누세요.",
    studyPlan: [
      { title: "1단계 · 분석 흐름 파악", description: "문제 정의부터 데이터 준비·분석·활용까지 전체 과정을 먼저 연결합니다." },
      { title: "2단계 · 통계 기초", description: "확률·추정·검정과 분석 방법이 어떤 상황에 쓰이는지 예시로 구분합니다." },
      { title: "3단계 · 유사 개념 구분", description: "기출문제에서 자주 섞이는 용어를 비교표로 정리하고 과목별 과락 여부를 점검합니다." },
    ],
    faqs: [
      { question: "ADsP는 코딩 실기시험이 있나요?", answer: "아닙니다. ADsP는 데이터 이해·분석 기획·데이터분석을 다루는 필기시험입니다." },
      { question: "통계 전공자만 응시할 수 있나요?", answer: "아닙니다. 응시자격 제한이 없어 누구나 응시할 수 있습니다." },
      { question: "SQLD와 ADsP 중 무엇을 먼저 준비해야 하나요?", answer: "데이터베이스와 SQL 활용이 목표면 SQLD, 분석 기획과 통계의 전체 흐름이 목표면 ADsP가 더 직접적입니다." },
    ],
    officialSource: "https://www.dataq.or.kr/www/main.do",
    verifiedAt: "2026-09-02",
  },
  "소방설비기사(전기분야)": {
    examSubjects: [
      { stage: "필기", subjects: ["소방원론", "소방전기일반", "소방관계법규", "소방전기시설의 구조 및 원리"] },
      { stage: "실기", subjects: ["소방전기시설 설계 및 시공실무"] },
    ],
    examFormat: "필기는 객관식 4지 택일형, 실기는 소방전기시설 설계 및 시공실무에 대한 필답형으로 시행됩니다.",
    passRule: qnetArticlePassRule,
    eligibility: qnetArticleEligibility,
    planNote: "전기 기초가 있다면 10~14주를 예시로 잡고, 소방관계법규와 설비별 동작 원리를 함께 학습하세요.",
    studyPlan: [
      { title: "1단계 · 전기와 소방 기초", description: "회로 기초와 화재·소화 원리를 정리해 설비 동작의 배경을 이해합니다." },
      { title: "2단계 · 설비별 기준", description: "자동화재탐지·비상방송 등 설비의 구성, 설치 기준과 동작 순서를 연결합니다." },
      { title: "3단계 · 도면과 계산", description: "실기 도면·시퀀스·계산 문제를 반복하고 단답형 법규 표현을 정확히 작성합니다." },
    ],
    faqs: [
      { question: "전기분야와 기계분야 시험은 같은가요?", answer: "소방원론과 법규 일부는 연결되지만 전기분야는 경보·전기설비, 기계분야는 소화·유체설비 중심으로 시험과 실무 범위가 다릅니다." },
      { question: "실기는 작업형인가요?", answer: "Q-Net 종목 안내 기준 소방설비기사 전기분야 실기는 필답형입니다." },
      { question: "전기기사와 같이 준비해도 되나요?", answer: "회로와 전기 기초는 일부 연결되지만 소방관계법규와 소방시설 구조는 별도로 학습해야 합니다." },
    ],
    officialSource: "https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=1910",
    verifiedAt: "2026-09-02",
  },
  "직업상담사2급": {
    examSubjects: [
      { stage: "필기", subjects: ["직업심리", "직업상담 및 취업지원", "직업정보", "노동시장", "고용노동관계법규(Ⅰ)"] },
      { stage: "실기", subjects: ["직업상담 실무"] },
    ],
    examFormat: "필기는 객관식 4지 택일형, 실기는 직업상담 실무에 대한 필답형으로 시행됩니다.",
    passRule: qnetArticlePassRule,
    eligibility: "응시자격 제한 없이 누구나 응시할 수 있습니다.",
    planNote: "상담 이론이 처음이라면 8~12주를 예시로 잡고, 필기 개념을 실기 서술 답안까지 이어서 준비하세요.",
    studyPlan: [
      { title: "1단계 · 이론 틀 만들기", description: "상담·심리 이론의 학자, 핵심 개념과 적용 상황을 한 묶음으로 정리합니다." },
      { title: "2단계 · 법규와 직업정보", description: "고용노동관계법규와 노동시장 용어를 최신 기준과 사례로 구분합니다." },
      { title: "3단계 · 실기 키워드", description: "기출 질문에 필요한 핵심어를 먼저 쓰고 정의·절차·예시로 답을 확장하는 연습을 합니다." },
    ],
    faqs: [
      { question: "직업상담사 2급은 관련 전공이 필요하나요?", answer: "아닙니다. 별도의 응시자격 제한 없이 응시할 수 있습니다." },
      { question: "실기는 상담을 직접 시연하나요?", answer: "Q-Net 안내 기준 실기는 직업상담 실무에 대한 필답형입니다." },
      { question: "필기와 실기를 따로 공부해야 하나요?", answer: "범위가 연결되므로 필기 개념을 공부할 때부터 정의와 절차를 서술형으로 정리하면 실기 준비에 도움이 됩니다." },
    ],
    officialSource: "https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9511",
    verifiedAt: "2026-09-02",
  },
};

export const certificationDeepDiveNames = Object.keys(deepDives);

export function getCertificationDeepDive(name: string): CertificationDeepDive | undefined {
  return deepDives[name];
}
