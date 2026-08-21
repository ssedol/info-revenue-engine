import type { AdSlotName } from "./types";
import { getAdProviderName, getAdSlotConfig, renderAdProvider } from "./provider";

export function AdSlot({ name }: { name: AdSlotName }) {
  const config = getAdSlotConfig(name);
  const providerName = getAdProviderName();

  return (
    <aside className={`ad-slot ad-slot--${name}`} aria-label={config.label}>
      <div className="ad-slot__label">광고</div>
      <div className="ad-slot__body">{renderAdProvider(providerName, config)}</div>
    </aside>
  );
}
