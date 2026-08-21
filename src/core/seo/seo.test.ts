import { describe, expect, it } from "vitest";
import { absoluteUrl, buildMetadata } from "./metadata";
import { itemListJsonLd } from "./structured-data";

describe("seo helpers", () => {
  it("builds canonical absolute URLs", () => {
    expect(absoluteUrl("/articles")).toMatch(/^http:\/\/localhost:3000\/articles/);
    expect(buildMetadata({ title: "A", description: "B", path: "/a" }).alternates?.canonical).toBe("http://localhost:3000/a");
  });

  it("builds ItemList structured data", () => {
    const value = itemListJsonLd([{ name: "정보처리기사 준비 전 알아둘 것", path: "/articles/what-to-know-before-information-processing-engineer" }]);

    expect(value["@type"]).toBe("ItemList");
    expect(value.itemListElement).toHaveLength(1);
  });
});
