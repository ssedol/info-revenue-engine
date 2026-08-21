import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderAdProvider } from "./provider";

describe("renderAdProvider", () => {
  it("falls back to a clearly labeled placeholder when Kakao unit id is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_KAKAO_ADFIT_UNIT_TOP", "");
    render(
      <>{renderAdProvider("kakao-adfit", { name: "top-banner", label: "상단 광고", width: 728, height: 90 })}</>,
    );

    expect(screen.getByText("광고 영역입니다.")).toBeInTheDocument();
  });

  it("renders an AdSense placeholder instead of a CTA-like element", () => {
    render(
      <>{renderAdProvider("google-adsense", { name: "in-content", label: "본문 중간 광고", width: 320, height: 100 })}</>,
    );

    expect(screen.getByText(/광고 영역입니다/)).toBeInTheDocument();
  });
});
