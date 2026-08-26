import type { Metadata } from "next";
import { buildMetadata } from "@/core/seo/metadata";

const CONTACT_EMAIL = "devement2@gmail.com";

export const metadata: Metadata = buildMetadata({
  title: "문의",
  description: "자격증 인사이트의 정보 오류 제보와 사이트 운영 문의 방법을 안내합니다.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="article-page">
      <article className="article-detail">
        <header className="article-header">
          <p className="article-kicker">문의 안내</p>
          <h1>문의하기</h1>
          <p>정보 오류 제보, 출처 수정 요청, 사이트 운영 관련 문의를 이메일로 받고 있습니다.</p>
        </header>

        <div className="article-body article-body--sectioned">
          <section className="article-section">
            <h2><span>01</span>문의 이메일</h2>
            <p>
              <a className="official-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
            <p>메일 제목에 문의할 글의 제목이나 주소를 적어주면 내용을 더 빠르게 확인할 수 있습니다.</p>
          </section>

          <section className="article-section">
            <h2><span>02</span>오류를 제보할 때</h2>
            <ul className="article-checklist">
              <li>오류가 있는 페이지 주소</li>
              <li>수정이 필요한 문장이나 항목</li>
              <li>확인 가능한 공식 출처 주소</li>
            </ul>
          </section>

          <section className="article-section">
            <h2><span>03</span>개인정보 주의사항</h2>
            <p>주민등록번호, 수험번호, 전화번호, 결제정보 등 민감한 개인정보는 보내지 마세요. 문의 답변에 필요하지 않은 개인정보는 작성하지 않는 것을 권장합니다.</p>
          </section>

          <aside className="official-note">
            <h2>시험 접수 관련 문의</h2>
            <p>원서접수, 환불, 응시자격 판정, 시험장 변경은 이 사이트에서 처리할 수 없습니다. 해당 자격증의 시행기관 또는 Q-Net 고객센터를 이용해주세요.</p>
          </aside>
        </div>
      </article>
    </div>
  );
}
