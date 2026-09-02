import { describe, expect, it } from "vitest";
import { articles, getArticleBySlug, getRelatedArticles, searchArticles } from "./articles";
import { getArticleSeoIndexItems } from "./articleSeo";

describe("certification blog articles", () => {
  it("contains 20 to 30 static articles for the MVP", () => {
    expect(articles.length).toBeGreaterThanOrEqual(20);
    expect(articles.length).toBeLessThanOrEqual(30);
  });

  it("keeps article bodies substantial enough for a blog MVP", () => {
    for (const article of articles) {
      expect(article.body.length, article.slug).toBeGreaterThanOrEqual(8);
      expect(article.body.join("").length, article.slug).toBeGreaterThanOrEqual(1000);
      expect(article.readingMinutes, article.slug).toBeGreaterThanOrEqual(4);
    }
  });

  it("uses specific search-oriented article titles", () => {
    for (const article of articles) {
      expect(article.title.length, article.slug).toBeGreaterThanOrEqual(14);
      expect(article.title).toMatch(/자격증|기사|기능장|국가자격|국가기술자격|오답노트|채용공고/);
    }
  });

  it("creates article SEO URLs without requiring API data", () => {
    const seoItems = getArticleSeoIndexItems();

    expect(seoItems.map((item) => item.path)).toContain("/articles");
    expect(seoItems.some((item) => item.path.startsWith("/articles/"))).toBe(true);
  });

  it("finds related articles by category or tag", () => {
    const article = getArticleBySlug("what-to-know-before-information-processing-engineer");

    expect(article).toBeDefined();
    expect(getRelatedArticles(article!).length).toBeGreaterThan(0);
  });

  it("searches titles, tags, categories, summaries, and article bodies", () => {
    expect(searchArticles("정보처리기사")[0]?.slug).toBe("what-to-know-before-information-processing-engineer");
    expect(searchArticles("비전공자 기사").length).toBeGreaterThan(0);
    expect(searchArticles("존재하지않는검색어")).toEqual([]);
    expect(searchArticles("   ")).toEqual([]);
  });

  it("matches the observed private certification search intent", () => {
    const article = getArticleBySlug("public-vs-private-certifications");
    expect(article?.title).toContain("민간 자격증 조회");
    expect(article?.summary).toContain("PQI");
    expect(article?.officialLinks[0]?.href).toBe("https://www.pqi.or.kr/");
  });
});
