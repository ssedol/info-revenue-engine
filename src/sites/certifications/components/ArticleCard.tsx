import Link from "next/link";
import type { Article } from "../articles";
import { articleCategoryPath, articlePath } from "../articles";

export function ArticleCard({
  article,
  compact = false,
  variant = "default",
}: {
  article: Article;
  compact?: boolean;
  variant?: "default" | "lead";
}) {
  return (
    <article className={`card article-card${compact ? " article-card--compact" : ""}${variant === "lead" ? " article-card--lead" : ""}`}>
      <div className="article-meta">
        <Link href={articleCategoryPath(article.category)}>{article.category.name}</Link>
        <span>{formatArticleDate(article.publishedAt)}</span>
        <span>{article.readingMinutes}분</span>
      </div>
      <h3>
        <Link href={articlePath(article)}>{article.title}</Link>
      </h3>
      <p className={compact ? "article-card__summary article-card__summary--compact" : "article-card__summary"}>{article.summary}</p>
      <ul className="tag-list" aria-label={`${article.title} 태그`}>
        {article.tags.slice(0, compact ? 2 : 3).map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <Link className="read-more-link" href={articlePath(article)}>
        기사 읽기
      </Link>
    </article>
  );
}

export function formatArticleDate(date: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00.000Z`));
}
