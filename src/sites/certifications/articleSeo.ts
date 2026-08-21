import type { SeoIndexItem } from "./types";
import { articleCategories, articleCategoryPath, articlePath, getArticles, getTags, tagPath } from "./articles";

export function getArticleSeoIndexItems(): SeoIndexItem[] {
  const articles = getArticles();
  const latest = articles[0]?.publishedAt;
  const latestDateTime = latest ? `${latest}T00:00:00.000Z` : undefined;

  return [
    {
      path: "/",
      title: "자격증 블로그",
      description: "자격증 선택, 공부 전략, 취업 활용법을 뉴스처럼 읽는 정보 블로그입니다.",
      canonicalPath: "/",
      priority: 1,
      changeFrequency: "weekly",
      lastModified: latestDateTime,
    },
    {
      path: "/articles",
      title: "자격증 글 목록",
      description: "자격증 준비와 커리어에 도움이 되는 최신 글을 모아 봅니다.",
      canonicalPath: "/articles",
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: latestDateTime,
    },
    {
      path: "/certifications",
      title: "자격증 탐색",
      description: "자격증 주제별 글과 선택 가이드를 탐색합니다.",
      canonicalPath: "/certifications",
      priority: 0.7,
      changeFrequency: "weekly",
      lastModified: latestDateTime,
    },
    {
      path: "/compare",
      title: "자격증 선택 기준",
      description: "비슷한 자격증을 비교하고 선택할 때 보는 기준을 정리합니다.",
      canonicalPath: "/compare",
      priority: 0.65,
      changeFrequency: "monthly",
      lastModified: latestDateTime,
    },
    ...articles.map((article) => ({
      path: articlePath(article),
      title: article.title,
      description: article.summary,
      canonicalPath: articlePath(article),
      priority: article.featured ? 0.85 : 0.75,
      changeFrequency: "monthly" as const,
      lastModified: `${article.publishedAt}T00:00:00.000Z`,
    })),
    ...articleCategories.map((category) => ({
      path: articleCategoryPath(category),
      title: `${category.name} 글`,
      description: category.description,
      canonicalPath: articleCategoryPath(category),
      priority: 0.7,
      changeFrequency: "weekly" as const,
      lastModified: latestDateTime,
    })),
    ...getTags()
      .slice(0, 12)
      .map((tag) => ({
        path: tagPath(tag.name),
        title: `${tag.name} 글`,
        description: `${tag.name} 주제의 자격증 글을 모아 봅니다.`,
        canonicalPath: tagPath(tag.name),
        priority: 0.55,
        changeFrequency: "monthly" as const,
        lastModified: latestDateTime,
      })),
  ];
}
