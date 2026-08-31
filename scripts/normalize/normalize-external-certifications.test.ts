import { describe, expect, it } from "vitest";
import {
  normalizeComputerLiteracyLevel1Html,
  normalizeDataqHtml,
  normalizeKoreanHistoryHtml,
  normalizeRealtorHtml,
} from "./normalize-external-certifications";

describe("normalize external certifications", () => {
  it("normalizes the Q-Net realtor schedule", () => {
    const certification = normalizeRealtorHtml(
      `<main>
        <h1>2026년도 제37회 공인중개사</h1>
        <p>접수기간 2026.08.03 ~ 2026.08.07</p>
        <p>시험일정 2026.10.31 ~ 2026.10.31</p>
        <p>합격자발표기간 2026.12.02 ~ 2027.01.31</p>
      </main>`,
      "2026-08-31T00:00:00.000Z",
      "https://www.q-net.or.kr/example",
    );

    expect(certification.name).toBe("공인중개사");
    expect(certification.schedules[0]).toMatchObject({
      round: "2026년도 제37회 공인중개사",
      applicationStart: "2026-08-03",
      examStart: "2026-10-31",
      resultDate: "2026-12-02",
    });
  });

  it("normalizes SQLD and ADsP schedule tables", () => {
    const html = `<h1>2026년도 일정</h1><table>
      <tr><td>데이터분석 준전문가</td><td>제51회</td><td>-</td><td>9.28~10.2</td><td>10.16</td><td>10.31(토)</td><td>11.13~17</td><td>11.20</td><td>-</td></tr>
      <tr><td>SQL 개발자</td><td>제63회</td><td>-</td><td>10.12~16</td><td>10.30</td><td>11.14(토)</td><td>11.27~12.1</td><td>12.4</td><td>-</td></tr>
    </table>`;
    const result = normalizeDataqHtml(html, "2026-08-31T00:00:00.000Z", "https://dataq.example");

    expect(result.map(({ name }) => name)).toEqual(["ADsP", "SQLD"]);
    expect(result[0].schedules[0]).toMatchObject({
      applicationStart: "2026-09-28",
      applicationEnd: "2026-10-02",
      examStart: "2026-10-31",
      resultDate: "2026-11-20",
    });
  });

  it("normalizes the current Korean history schedule", () => {
    const certification = normalizeKoreanHistoryHtml(
      `<main>제80회 한국사능력검정시험 시험일 : 2026년 10월 17일(토)
      원서접수 기간 9.15.(화) 10:00 9.18.(금) 13:00 ~ 9.22.(화) 17:00 전지역</main>`,
      "2026-08-31T00:00:00.000Z",
      "https://history.example",
    );
    expect(certification.schedules[0]).toMatchObject({
      applicationStart: "2026-09-15",
      applicationEnd: "2026-09-22",
      examStart: "2026-10-17",
    });
  });

  it("normalizes Computer Literacy Level 1 official information", () => {
    const certification = normalizeComputerLiteracyLevel1Html(
      `<main><h1>컴퓨터활용능력</h1><h2>응시자격</h2><p>제한없음</p>
      <h2>시험과목</h2><p>컴퓨터 일반, 스프레드시트 일반, 데이터베이스 일반</p>
      <h2>수험료</h2><p>필기 : 20,500원</p><p>실기 : 25,000원</p></main>`,
      "2026-08-31T00:00:00.000Z",
      "https://license.korcham.net/example",
    );

    expect(certification).toMatchObject({
      name: "컴퓨터활용능력 1급",
      issuer: "대한상공회의소",
      eligibility: "제한 없음(실기시험은 필기 합격 후 2년 이내 응시 가능)",
      schedules: [{ round: "상시검정" }],
      fees: [
        { label: "필기", amount: 20500 },
        { label: "실기", amount: 25000 },
      ],
    });
  });
});
