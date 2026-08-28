import type { Metadata } from "next";
import { buildMetadata } from "@/core/seo/metadata";

const CONTACT_EMAIL = "devement2@gmail.com";

export const metadata: Metadata = buildMetadata({
  title: "개인정보처리방침",
  description: "자격증 인사이트의 개인정보 처리와 쿠키, 광고 서비스 이용 방침을 안내합니다.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="article-page">
      <article className="article-detail">
        <header className="article-header">
          <p className="article-kicker">시행일 2026년 8월 26일</p>
          <h1>개인정보처리방침</h1>
          <p>자격증 인사이트는 이용자의 개인정보를 최소한으로 처리하며, 별도의 회원가입 기능을 운영하지 않습니다.</p>
        </header>

        <div className="article-body article-body--sectioned">
          <section className="article-section">
            <h2><span>01</span>처리하는 정보</h2>
            <p>사이트는 회원가입, 댓글, 자체 문의 폼을 제공하지 않으므로 이름이나 전화번호를 직접 수집하지 않습니다.</p>
            <p>사이트 이용 과정에서 IP 주소, 브라우저 및 기기 정보, 접속 일시, 방문 페이지, 이전 방문 주소, 쿠키 또는 광고 식별자 등이 호스팅·보안·통계·광고 서비스를 통해 자동으로 처리될 수 있습니다.</p>
            <p>이메일로 문의하면 발신 이메일 주소, 메일에 작성한 이름과 문의 내용이 답변을 위해 처리됩니다.</p>
          </section>

          <section className="article-section">
            <h2><span>02</span>처리 목적과 보유 기간</h2>
            <p>자동 생성 정보는 사이트 제공, 오류 확인, 보안, 이용 현황 분석과 광고 제공을 위해 사용될 수 있습니다. 관련 기록은 각 외부 서비스의 정책에 따라 보관됩니다.</p>
            <p>이메일 문의 내용은 답변과 후속 확인에 필요한 기간 동안 보관한 뒤 삭제합니다. 법령상 보존 의무가 있는 경우에는 해당 기간 동안 보관할 수 있습니다.</p>
          </section>

          <section className="article-section">
            <h2><span>03</span>외부 서비스</h2>
            <p>사이트 제공과 운영을 위해 Vercel의 호스팅 및 Web Analytics 서비스를 사용합니다. Vercel Web Analytics는 쿠키 없이 익명화된 방문 통계를 처리합니다. 광고 제공을 위해 Google AdSense를 사용하며, Google이 쿠키와 광고 식별자 등을 이용할 수 있습니다. 향후 Google Analytics가 추가로 사용될 수 있습니다.</p>
            <p>외부 서비스 사업자는 서비스 제공 과정에서 정보를 국외 서버에서 처리할 수 있으며, 구체적인 처리 방식과 기간은 각 사업자의 개인정보처리방침을 따릅니다.</p>
            <ul className="official-link-list">
              <li><a className="official-link official-link--stacked" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer"><span>Google 개인정보처리방침</span><small>policies.google.com/privacy</small></a></li>
              <li><a className="official-link official-link--stacked" href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer"><span>Google 광고 및 쿠키 안내</span><small>policies.google.com/technologies/ads</small></a></li>
              <li><a className="official-link official-link--stacked" href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer"><span>Vercel 개인정보처리방침</span><small>vercel.com/legal/privacy-policy</small></a></li>
            </ul>
          </section>

          <section className="article-section">
            <h2><span>04</span>쿠키 관리</h2>
            <p>이용자는 브라우저 설정에서 쿠키를 삭제하거나 저장을 차단할 수 있습니다. 쿠키를 차단하면 일부 광고 또는 사이트 기능이 정상적으로 동작하지 않을 수 있습니다.</p>
          </section>

          <section className="article-section">
            <h2><span>05</span>이용자의 권리와 문의</h2>
            <p>본인의 개인정보에 대한 열람, 정정, 삭제 또는 처리 제한을 요청하려면 아래 이메일로 문의할 수 있습니다.</p>
            <p><a className="official-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </section>

          <section className="article-section">
            <h2><span>06</span>방침 변경</h2>
            <p>개인정보처리방침이 변경되면 시행일과 변경 내용을 이 페이지에 안내합니다.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
