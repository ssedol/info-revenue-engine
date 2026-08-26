import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/core/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "사이트 소개",
  description: "자격증 인사이트의 운영 목적, 정보 작성 기준과 광고 운영 원칙을 안내합니다.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="article-page">
      <article className="article-detail">
        <header className="article-header">
          <p className="article-kicker">사이트 안내</p>
          <h1>자격증 인사이트 소개</h1>
          <p>자격증을 고르고 준비하는 과정에서 필요한 기준과 공식 확인 경로를 읽기 쉽게 정리하는 정보 사이트입니다.</p>
        </header>

        <div className="article-body article-body--sectioned">
          <section className="article-section">
            <h2><span>01</span>운영 목적</h2>
            <p>자격증 인사이트는 자격증 선택, 시험 준비, 비용과 시간 관리, 취업 활용에 관한 정보를 제공합니다. 처음 준비하는 사람도 공식 정보를 어디서 확인해야 하는지 이해할 수 있도록 설명하는 것이 목표입니다.</p>
          </section>

          <section className="article-section">
            <h2><span>02</span>정보 작성 기준</h2>
            <p>시험일정, 응시료, 응시자격처럼 변경될 수 있는 항목은 Q-Net과 시행기관 등 공식 출처를 우선 확인합니다. 각 글에는 가능한 경우 공식 확인 링크를 함께 제공합니다.</p>
            <p>사이트의 글은 이해를 돕기 위한 참고 자료이며, 실제 원서접수와 시험 준비 전에는 반드시 해당 기관의 최신 공고를 다시 확인해야 합니다.</p>
          </section>

          <section className="article-section">
            <h2><span>03</span>수정 및 업데이트</h2>
            <p>잘못된 정보나 오래된 내용을 발견하면 공식 자료를 기준으로 확인한 뒤 수정합니다. 내용 오류 제보는 <Link href="/contact">문의 페이지</Link>에 안내된 이메일로 보내주세요.</p>
          </section>

          <section className="article-section">
            <h2><span>04</span>광고 운영</h2>
            <p>사이트 운영 비용을 충당하기 위해 Google AdSense 등의 광고가 표시될 수 있습니다. 광고 게재 여부는 정보의 작성 방향이나 평가에 영향을 주지 않습니다.</p>
          </section>

          <aside className="official-note">
            <h2>공식기관 사이트가 아닙니다</h2>
            <p>자격증 인사이트는 Q-Net 또는 자격 시행기관이 운영하는 공식 사이트가 아닙니다. 접수, 환불, 응시자격 판정과 같은 업무는 해당 공식기관에 문의해야 합니다.</p>
          </aside>
        </div>
      </article>
    </div>
  );
}
