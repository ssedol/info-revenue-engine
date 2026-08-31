import { describe, expect, it } from "vitest";
import { externalSources, validateExternalSourceHtml } from "./external-sources";

describe("external certification sources", () => {
  it("covers all six non-technical managed certifications", () => {
    expect(externalSources.flatMap(({ certificationNames }) => certificationNames)).toEqual([
      "컴퓨터활용능력 1급",
      "한국사능력검정시험",
      "SQLD",
      "ADsP",
      "공인중개사",
      "재경관리사",
    ]);
  });

  it("rejects unrelated or blocked HTML", () => {
    expect(validateExternalSourceHtml(externalSources[0], "<html>blocked</html>")).toEqual([
      "컴퓨터활용능력",
      "시험일정",
    ]);
    expect(
      validateExternalSourceHtml(
        externalSources[0],
        "<html><h1>컴퓨터활용능력 시험일정</h1></html>",
      ),
    ).toEqual([]);
  });
});
