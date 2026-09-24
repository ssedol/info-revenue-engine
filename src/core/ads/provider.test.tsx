import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderAdProvider } from "./provider";

describe("renderAdProvider", () => {
  it("renders nothing when the Kakao unit id is missing in production", () => {
    vi.stubEnv("NEXT_PUBLIC_KAKAO_ADFIT_UNIT_TOP", "");
    vi.stubEnv("NODE_ENV", "production");

    const { container } = render(
      <>{renderAdProvider("kakao-adfit", { name: "top-banner", label: "상단 광고", width: 728, height: 90 })}</>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for AdSense without a configured client and slot id", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT", "");
    vi.stubEnv("NODE_ENV", "production");

    const { container } = render(
      <>{renderAdProvider("google-adsense", { name: "in-content", label: "본문 중간 광고", width: 320, height: 100 })}</>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a real AdSense unit when client and slot ids are configured", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT", "ca-pub-0000000000000000");
    vi.stubEnv("NODE_ENV", "production");

    const { container } = render(
      <>
        {renderAdProvider("google-adsense", {
          name: "article-top",
          label: "기사 상단 광고",
          width: 728,
          height: 90,
          adsenseSlotId: "1234567890",
        })}
      </>,
    );

    const unit = container.querySelector("ins.adsbygoogle");
    expect(unit).not.toBeNull();
    expect(unit?.getAttribute("data-ad-slot")).toBe("1234567890");
    expect(unit?.getAttribute("data-ad-client")).toBe("ca-pub-0000000000000000");
  });

  it("shows a development placeholder so layout can be checked locally", () => {
    vi.stubEnv("NODE_ENV", "development");

    render(
      <>{renderAdProvider("placeholder", { name: "bottom-banner", label: "하단 광고", width: 728, height: 90 })}</>,
    );

    expect(screen.getByText(/개발용 광고 자리/)).toBeInTheDocument();
  });
});
