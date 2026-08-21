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

export function getAdSlotConfig(name: AdSlotName): AdSlotConfig {
  const configs: Record<AdSlotName, AdSlotConfig> = {
    "top-banner": {
      name,
      label: "상단 광고",
      width: 728,
      height: 90,
      unitId: process.env.NEXT_PUBLIC_KAKAO_ADFIT_UNIT_TOP || undefined,
    },
    "article-top": {
      name,
      label: "기사 상단 광고",
      width: 728,
      height: 90,
      unitId: process.env.NEXT_PUBLIC_KAKAO_ADFIT_UNIT_TOP || process.env.NEXT_PUBLIC_KAKAO_ADFIT_UNIT_CONTENT || undefined,
    },
    "in-content": {
      name,
      label: "본문 중간 광고",
      width: 320,
      height: 100,
      unitId: process.env.NEXT_PUBLIC_KAKAO_ADFIT_UNIT_CONTENT || undefined,
    },
    "article-inline": {
      name,
      label: "기사 본문 광고",
      width: 320,
      height: 100,
      unitId: process.env.NEXT_PUBLIC_KAKAO_ADFIT_UNIT_CONTENT || undefined,
    },
    "list-inline": {
      name,
      label: "목록 중간 광고",
      width: 728,
      height: 90,
      unitId: process.env.NEXT_PUBLIC_KAKAO_ADFIT_UNIT_CONTENT || undefined,
    },
    sidebar: {
      name,
      label: "사이드 광고",
      width: 300,
      height: 250,
      unitId: process.env.NEXT_PUBLIC_KAKAO_ADFIT_UNIT_CONTENT || undefined,
    },
    "bottom-banner": {
      name,
      label: "하단 광고",
      width: 728,
      height: 90,
      unitId: process.env.NEXT_PUBLIC_KAKAO_ADFIT_UNIT_CONTENT || undefined,
    },
  };
  return configs[name];
}

export function renderAdProvider(providerName: AdProviderName, config: AdSlotConfig): ReactNode {
  if (providerName === "kakao-adfit") {
    return <KakaoAdFitProvider config={config} />;
  }
  if (providerName === "google-adsense") {
    return <GoogleAdSensePlaceholder config={config} />;
  }
  return <PlaceholderProvider config={config} />;
}

function KakaoAdFitProvider({ config }: { config: AdSlotConfig }) {
  if (!config.unitId) {
    return <PlaceholderProvider config={config} />;
  }

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

function GoogleAdSensePlaceholder({ config }: { config: AdSlotConfig }) {
  return <PlaceholderProvider config={config} />;
}

function PlaceholderProvider({ config, reason }: { config: AdSlotConfig; reason?: string }) {
  return (
    <div className="ad-placeholder" style={{ minHeight: Math.min(config.height, 120) }}>
      <p>{reason ?? "광고 영역입니다."}</p>
    </div>
  );
}
