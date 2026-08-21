import { describe, expect, it } from "vitest";
import { getArticleBySlug } from "./articles";
import { getQnetOfficialInfo } from "./qnetOfficial";

describe("Q-Net official certification info", () => {
  it("shows official Q-Net info for core certification articles", () => {
    const article = getArticleBySlug("what-to-know-before-information-processing-engineer");

    expect(article).toBeDefined();
    const info = getQnetOfficialInfo(article!);

    expect(info).toMatchObject({
      certificationName: "정보처리기사",
      jmCd: "1320",
      ministry: "과학기술정보통신부",
      writtenFee: "19,400원",
      practicalFee: "22,600원",
    });
    expect(info?.schedules).toHaveLength(3);
    expect(info?.schedules[0].round).toBe("2026년 정기 기사 1회");
  });
});
