import { describe, expect, it } from "vitest";
import { articleCategories } from "./articles";
import { articleCategoryNavigation, primaryNavigation } from "./navigation";

describe("site navigation", () => {
  it("uses clear labels for the main site functions", () => {
    expect(primaryNavigation.map(({ label }) => label)).toEqual([
      "자격증 찾기", "시험일정", "자격증 비교", "글 목록",
    ]);
  });

  it("keeps header topic labels identical to article category names", () => {
    expect(articleCategoryNavigation.map(({ label }) => label)).toEqual(articleCategories.map(({ name }) => name));
  });
});
