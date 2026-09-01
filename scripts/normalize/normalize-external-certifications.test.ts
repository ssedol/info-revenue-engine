import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  normalizeComputerLiteracyLevel1Html,
  normalizeDataqHtml,
  normalizeKoreanHistoryHtml,
  normalizeKorchamRegionalNoticesHtml,
  normalizeRealtorHtml,
  normalizeSocialWorkerLevel1Html,
  normalizeFinancialManagerHtml,
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

  it("normalizes Korcham regional schedule opening notices", () => {
    const html = readFileSync(
      join(process.cwd(), "scripts/fixtures/certifications/korcham-regional-schedule-notices.fixture.html"),
      "utf8",
    );
    const notices = normalizeKorchamRegionalNoticesHtml(
      html,
      "2026-09-01T00:00:00.000Z",
      "https://license.korcham.net/customer/sangwiGuide.do",
    );

    expect(notices).toMatchObject([
      { region: "특별광역시", chamber: "대구", notice: expect.stringContaining("매주 월요일") },
      { region: "경기도", chamber: "고양", notice: expect.stringContaining("10월 상시검정") },
    ]);
  });

  it("fails when Korcham regional notices disappear", () => {
    expect(() =>
      normalizeKorchamRegionalNoticesHtml(
        "<html><h1>전국상의별 공지안내</h1></html>",
        "2026-09-01T00:00:00.000Z",
        "https://license.korcham.net/customer/sangwiGuide.do",
      ),
    ).toThrow("지역별 시험 개설 공지를 찾지 못했습니다");
  });

  it("normalizes the Q-Net Social Worker Level 1 schedule and official information", () => {
    const mainHtml = readFileSync(
      join(process.cwd(), "scripts/fixtures/certifications/qnet-social-worker-level-1-main.fixture.html"),
      "utf8",
    );
    const infoHtml = readFileSync(
      join(process.cwd(), "scripts/fixtures/certifications/qnet-social-worker-level-1-info.fixture.html"),
      "utf8",
    );
    const certification = normalizeSocialWorkerLevel1Html(
      mainHtml,
      infoHtml,
      "2026-09-01T00:00:00.000Z",
      "https://www.q-net.or.kr/man001.do?gSite=L&gId=52",
    );

    expect(certification).toMatchObject({
      slug: "social-worker-level-1",
      name: "사회복지사 1급",
      issuer: "한국산업인력공단",
      fees: [{ label: "필기", amount: 25000 }],
      schedules: [{
        round: "2026년 제24회",
        applicationStart: "2025-12-08",
        applicationEnd: "2025-12-12",
        examStart: "2026-01-17",
        resultDate: "2026-03-25",
      }],
    });
  });

  it("fails when the Social Worker Level 1 schedule changes unexpectedly", () => {
    expect(() =>
      normalizeSocialWorkerLevel1Html(
        "<html><h1>사회복지사 1급</h1></html>",
        "<html><h1>사회복지사 1급</h1></html>",
        "2026-09-01T00:00:00.000Z",
        "https://www.q-net.or.kr/man001.do?gSite=L&gId=52",
      ),
    ).toThrow("공식 시험일정을 찾지 못했습니다");
  });

  it("normalizes the Samil financial manager schedule and guide", () => {
    const scheduleHtml = readFileSync(
      join(process.cwd(), "scripts/fixtures/certifications/samil-financial-manager-schedule.fixture.html"),
      "utf8",
    );
    const guideHtml = readFileSync(
      join(process.cwd(), "scripts/fixtures/certifications/samil-financial-manager-guide.fixture.html"),
      "utf8",
    );
    const certification = normalizeFinancialManagerHtml(
      scheduleHtml,
      guideHtml,
      "2026-09-01T00:00:00.000Z",
      "https://www.samilexam.com/usr/groupguide.do",
    );

    expect(certification).toMatchObject({
      slug: "financial-manager",
      name: "재경관리사",
      issuer: "삼일회계법인",
      eligibility: "연령, 학력, 경력 제한 없음",
      fees: [{ label: "응시", amount: 70000 }],
      schedules: [
        {
          round: "2026년 제122회",
          applicationStart: "2026-01-06",
          applicationEnd: "2026-01-13",
          examStart: "2026-01-31",
          resultDate: "2026-02-06",
        },
        {
          round: "2026년 제123회",
          applicationStart: "2026-02-26",
          applicationEnd: "2026-03-05",
          examStart: "2026-03-28",
          resultDate: "2026-04-03",
        },
      ],
    });
  });

  it("fails when the financial manager official schedule changes unexpectedly", () => {
    expect(() =>
      normalizeFinancialManagerHtml(
        "<html><h1>2026년 국가공인 회계관리자격시험</h1></html>",
        "<html>재경관리사</html>",
        "2026-09-01T00:00:00.000Z",
        "https://www.samilexam.com/usr/groupguide.do",
      ),
    ).toThrow("재경관리사 공식 시험일정을 찾지 못했습니다");
  });
});
