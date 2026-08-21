export type OfficialApiEndpoint = {
  name: string;
  serviceUrl: string;
  dataGoKrPage: string;
  format: "XML";
};

export const qnetQualificationListEndpoint: OfficialApiEndpoint = {
  name: "한국산업인력공단_국가자격 종목 목록 정보",
  serviceUrl: "http://openapi.q-net.or.kr/api/service/rest/InquiryListNationalQualifcationSVC/getList",
  dataGoKrPage: "https://www.data.go.kr/data/15003024/openapi.do",
  format: "XML",
};

export const qnetTradeInformationEndpoint: OfficialApiEndpoint = {
  name: "한국산업인력공단_국가자격 종목별 자격정보",
  serviceUrl: "http://openapi.q-net.or.kr/api/service/rest/InquiryInformationTradeNTQSVC/getList",
  dataGoKrPage: "https://www.data.go.kr/data/15003003/openapi.do",
  format: "XML",
};

export const qnetTestInformationEndpoint: OfficialApiEndpoint = {
  name: "한국산업인력공단_국가기술자격 종목별 시험정보",
  serviceUrl: "http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getPEList",
  dataGoKrPage: "https://www.data.go.kr/data/15003029/openapi.do",
  format: "XML",
};
