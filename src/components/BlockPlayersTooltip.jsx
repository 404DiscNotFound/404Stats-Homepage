import PlayerHead from "./PlayerHead";
import { formatNumber, formatMaterial } from "@/lib/format";
import { useT } from "@/lib/i18n";

export default function BlockPlayersTooltip({ tooltipRef, active, metric = "total" }) {
  const t = useT();
  const metricLabel = metric === "mined" ? t("common.mined") : metric === "placed" ? t("common.placed") : t("common.total");
  const accentColor = metric === "placed" ? "#FF0055" : "#00F5FF";
  const materialVal = active
    ? metric === "mined" ? active.mined : metric === "placed" ? active.placed : active.total
    : 0;

  const players = (active?.topPlayers || [])
    .map(p => ({ ...p, val: p[metric] || 0 }))
    .sort((a, b) => b.val - a.val)
    .slice(0, 5);

  return (
    <div
      ref={tooltipRef}
      className="pointer-events-none fixed z-50 rounded-lg border border-[#00F5FF]/30 bg-[#0A0A0F] px-3 py-2 shadow-[0_0_15px_rgba(0,245,255,0.1)]"
      style={{ display: active ? "block" : "none", minWidth: "220px" }}
    >
      {active && (
        <div>
          <p className="text-[10px] font-bold text-white">{formatMaterial(active.material)}</p>
          <p className="mt-0.5 text-[9px] text-gray-500">{t("blockPlayers.top5")} · {metricLabel}</p>
          <div className="mt-1.5 space-y-1">
            {players.map((p, i) => {
              const pct = materialVal > 0 ? Math.round((p.val / materialVal) * 100) : 0;
              return (
                <div key={p.uuid} className="flex items-center gap-2">
                  <span className="w-3 text-right text-[9px] font-bold text-gray-600">{i + 1}</span>
                  <PlayerHead uuid={p.uuid} name={p.name} size={16} />
                  <span className="w-14 truncate text-[10px] text-gray-300">{p.name}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#111118]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: accentColor, boxShadow: `0 0 4px ${accentColor}80` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[10px] font-bold text-white">{pct}%</span>
                </div>
              );
            })}
            {players.length === 0 && (
              <p className="py-1 text-[10px] text-gray-600">{t("blockPlayers.noData")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}