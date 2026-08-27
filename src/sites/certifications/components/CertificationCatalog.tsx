"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { certificationPath } from "../routes";
export type CertificationSummary = {
  id: string;
  slug: string;
  name: string;
  category: string;
  level?: string;
  nextSchedule: string;
};

const PAGE_SIZE = 48;

export function CertificationCatalog({ certifications }: { certifications: CertificationSummary[] }) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");
  const filtered = useMemo(
    () =>
      certifications.filter((certification) =>
        [certification.name, certification.category, certification.level]
          .filter(Boolean)
          .some((value) => value?.toLocaleLowerCase("ko-KR").includes(normalizedQuery)),
      ),
    [certifications, normalizedQuery],
  );

  return (
    <>
      <div className="certification-search">
        <label htmlFor="certification-query">자격증 이름·분야 검색</label>
        <input
          id="certification-query"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder="예: 정보처리기사, 전기, 안전관리"
        />
        <p role="status">총 {filtered.length.toLocaleString("ko-KR")}개</p>
      </div>

      {filtered.length > 0 ? (
        <div className="certification-grid">
          {filtered.slice(0, visibleCount).map((certification) => (
            <article className="certification-card" key={certification.id}>
              <div className="certification-card-meta">
                {certification.level && <span>{certification.level}</span>}
                <span>{certification.category}</span>
              </div>
              <h2>
                <Link href={certificationPath(certification)}>{certification.name}</Link>
              </h2>
              <p>{certification.nextSchedule}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="search-empty">
          <h2>검색 결과가 없습니다</h2>
          <p>자격증 이름이나 분야를 짧게 입력해 보세요.</p>
        </div>
      )}

      {visibleCount < filtered.length && (
        <button className="catalog-more" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
          더 보기
        </button>
      )}
    </>
  );
}
