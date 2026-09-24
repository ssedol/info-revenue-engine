export type AdSlotName =
  | "top-banner"
  | "article-top"
  | "in-content"
  | "article-inline"
  | "list-inline"
  | "sidebar"
  | "bottom-banner";

export type AdProviderName = "kakao-adfit" | "google-adsense" | "placeholder";

export type AdSlotConfig = {
  name: AdSlotName;
  label: string;
  width: number;
  height: number;
  /** Kakao AdFit 광고 단위 ID */
  unitId?: string;
  /** Google AdSense data-ad-slot 값 */
  adsenseSlotId?: string;
};
