import type { AdSlotName } from "./types";
import { getAdProviderName, getAdSlotConfig, renderAdProvider } from "./provider";

export function AdSlot({ name }: { name: AdSlotName }) {
  const config = getAdSlotConfig(name);
  const content = renderAdProvider(getAdProviderName(), config);

  // 표시할 광고가 없으면 라벨과 빈 상자도 만들지 않습니다.
  if (!content) return null;

  return (
    <aside className={`ad-slot ad-slot--${name}`} aria-label={config.label}>
      <div className="ad-slot__label">광고</div>
      <div className="ad-slot__body">{content}</div>
    </aside>
  );
}
