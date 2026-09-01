import { describe, expect, it } from "vitest";
import { absoluteUrl, buildMetadata } from "./metadata";
import { faqJsonLd, itemListJsonLd } from "./structured-data";

describe("seo helpers", () => {
  it("builds canonical absolute URLs", () => {
    expect(absoluteUrl("/articles")).toBe("https://cert-insight.online/articles");
    expect(buildMetadata({ title: "A", description: "B", path: "/a" }).alternates?.canonical).toBe("https://cert-insight.online/a");
  });

  it("builds ItemList structured data", () => {
    const value = itemListJsonLd([{ name: "정보처리기사 준비 전 알아둘 것", path: "/articles/what-to-know-before-information-processing-engineer" }]);

    expect(value["@type"]).toBe("ItemList");
    expect(value.itemListElement).toHaveLength(1);
  });

  it("creates FAQ structured data from visible questions", () => {
    const value = faqJsonLd([{ question: "합격 기준은?", answer: "공식 기준을 확인하세요." }]);
    expect(value["@type"]).toBe("FAQPage");
    expect(value.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "합격 기준은?",
        acceptedAnswer: { "@type": "Answer", text: "공식 기준을 확인하세요." },
      },
    ]);
  });
});
