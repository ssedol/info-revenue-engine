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
  unitId?: string;
};
