import { describe, expect, it } from "vitest";
import { externalSources, validateExternalSourceHtml } from "./external-sources";

describe("external certification sources", () => {
  it("covers the six additional managed certifications", () => {
    expect(externalSources.flatMap(({ certificationNames }) => certificationNames)).toEqual([
      "한국사능력검정시험",
      "SQLD",
      "ADsP",
      "공인중개사",
      "컴퓨터활용능력 1급",
      "재경관리사",
    ]);
  });

  it("rejects unrelated or blocked HTML", () => {
    expect(validateExternalSourceHtml(externalSources[0], "<html>blocked</html>")).toEqual([
      "한국사능력검정시험",
    ]);
    expect(
      validateExternalSourceHtml(
        externalSources[0],
        "<html><h1>한국사능력검정시험</h1></html>",
      ),
    ).toEqual([]);
  });

  it("collects the public Korcham regional notice page", () => {
    expect(externalSources).toContainEqual(
      expect.objectContaining({
        id: "korcham-regional-schedule-notices",
        provider: "대한상공회의소",
      }),
    );
  });
});
