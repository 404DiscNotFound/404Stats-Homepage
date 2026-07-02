import { ChevronUp, ChevronDown } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { useT } from "@/lib/i18n";

export default function RankNeighbors({ title, neighbors, accent = "cyan", currentValue }) {
  const t = useT();
  if (!neighbors) return null;
  const color = accent === "cyan" ? "#00F5FF" : "#FF0055";

  return (
    <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-white">{title}</h3>
        <span className="text-xs font-bold" style={{ color, textShadow: `0 0 8px ${color}40` }}>
          #{neighbors.rank}
        </span>
      </div>

      {/* Above */}
      {neighbors.above ? (
        <div className="mb-2 flex items-center justify-between text-xs">
          <div className="flex min-w-0 items-center gap-1.5">
            <ChevronUp className="h-3 w-3 shrink-0 text-gray-600" />
            <span className="truncate text-gray-400">{neighbors.above.name}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="text-[10px] text-gray-600">+{formatNumber(neighbors.above.gap)}</span>
            <span className="text-gray-500">{formatNumber(neighbors.above.value)}</span>
          </div>
        </div>
      ) : (
        <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-700">
          <ChevronUp className="h-3 w-3" /> {t("rankNeighbors.topOfBoard")}
        </div>
      )}

      {/* Current (you) */}
      <div className="mb-2 flex items-center justify-between rounded bg-[#111118] px-2 py-1 text-xs">
        <span className="font-bold text-white">{t("rankNeighbors.you")}</span>
        <span className="font-bold" style={{ color }}>{formatNumber(currentValue)}</span>
      </div>

      {/* Below */}
      {neighbors.below ? (
        <div className="flex items-center justify-between text-xs">
          <div className="flex min-w-0 items-center gap-1.5">
            <ChevronDown className="h-3 w-3 shrink-0 text-gray-600" />
            <span className="truncate text-gray-400">{neighbors.below.name}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="text-[10px] text-gray-600">+{formatNumber(neighbors.below.gap)}</span>
            <span className="text-gray-500">{formatNumber(neighbors.below.value)}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-gray-700">
          <ChevronDown className="h-3 w-3" /> {t("rankNeighbors.noOneBehind")}
        </div>
      )}
    </div>
  );
}