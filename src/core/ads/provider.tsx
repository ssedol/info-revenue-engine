import Script from "next/script";
import type { ReactNode } from "react";
import type { AdProviderName, AdSlotConfig, AdSlotName } from "./types";

export function getAdProviderName(): AdProviderName {
  const raw = process.env.NEXT_PUBLIC_AD_PROVIDER;
  if (raw === "kakao-adfit" || raw === "google-adsense") {
    return raw;
  }
  return "placeholder";
}

/** 이 사이트의 AdSense 퍼블리셔 ID. public/ads.txt 와 같은 값이어야 합니다. */
const DEFAULT_ADSENSE_CLIENT = "ca-pub-4773298245322018";

export function getAdSenseClientId(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || DEFAULT_ADSENSE_CLIENT;
}

export function getAdSlotConfig(name: AdSlotName): AdSlotConfig {
  const kakaoTop = process.env.NEXT_PUBLIC_KAKAO_ADFIT_UNIT_TOP || undefined;
  const kakaoContent = process.env.NEXT_PUBLIC_KAKAO_ADFIT_UNIT_CONTENT || undefined;
  const adsenseTop = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_TOP || undefined;
  const adsenseContent = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_CONTENT || undefined;

  const configs: Record<AdSlotName, AdSlotConfig> = {
    "top-banner": { name, label: "상단 광고", width: 728, height: 90, unitId: kakaoTop, adsenseSlotId: adsenseTop },
    "article-top": {
      name,
      label: "기사 상단 광고",
      width: 728,
      height: 90,
      unitId: kakaoTop ?? kakaoContent,
      adsenseSlotId: adsenseTop ?? adsenseContent,
    },
    "in-content": { name, label: "본문 중간 광고", width: 320, height: 100, unitId: kakaoContent, adsenseSlotId: adsenseContent },
    "article-inline": { name, label: "기사 본문 광고", width: 320, height: 100, unitId: kakaoContent, adsenseSlotId: adsenseContent },
    "list-inline": { name, label: "목록 중간 광고", width: 728, height: 90, unitId: kakaoContent, adsenseSlotId: adsenseContent },
    sidebar: { name, label: "사이드 광고", width: 300, height: 250, unitId: kakaoContent, adsenseSlotId: adsenseContent },
    "bottom-banner": { name, label: "하단 광고", width: 728, height: 90, unitId: kakaoContent, adsenseSlotId: adsenseContent },
  };
  return configs[name];
}

/**
 * 광고 단위 ID가 없으면 아무것도 렌더하지 않습니다.
 * 빈 회색 상자에 "광고"라고 적어 두면 방문자에게는 깨진 영역으로 보이고,
 * 광고 심사에서는 준비되지 않은 사이트로 읽힙니다.
 * 개발 환경에서만 배치 확인용 자리 표시를 보여줍니다.
 */
export function renderAdProvider(providerName: AdProviderName, config: AdSlotConfig): ReactNode {
  if (providerName === "kakao-adfit" && config.unitId) {
    return <KakaoAdFitProvider config={config} />;
  }
  if (providerName === "google-adsense" && config.adsenseSlotId && getAdSenseClientId()) {
    return <GoogleAdSenseProvider config={config} />;
  }
  if (process.env.NODE_ENV === "development") {
    return <DevelopmentPlaceholder config={config} />;
  }
  return null;
}

function KakaoAdFitProvider({ config }: { config: AdSlotConfig }) {
  return (
    <>
      <ins
        className="kakao_ad_area"
        style={{ display: "none", width: "100%" }}
        data-ad-unit={config.unitId}
        data-ad-width={config.width}
        data-ad-height={config.height}
      />
      <Script async src="https://t1.kakaocdn.net/kas/static/ba.min.js" strategy="afterInteractive" />
    </>
  );
}

function GoogleAdSenseProvider({ config }: { config: AdSlotConfig }) {
  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={getAdSenseClientId()}
        data-ad-slot={config.adsenseSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={`adsense-${config.name}`} strategy="afterInteractive">
        {"(adsbygoogle = window.adsbygoogle || []).push({});"}
      </Script>
    </>
  );
}

function DevelopmentPlaceholder({ config }: { config: AdSlotConfig }) {
  return (
    <div className="ad-placeholder" style={{ minHeight: Math.min(config.height, 120) }}>
      <p>개발용 광고 자리 ({config.label})</p>
    </div>
  );
}
