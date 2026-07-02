import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useT } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";
import { CATEGORY_META, getWorldMeta } from "@/lib/materialCategories";

function DonutTooltip({ active, payload, mode, t }) {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0].payload;

  return (
    <div className="rounded-lg border border-[#00F5FF]/30 bg-[#0A0A0F] px-3 py-2 shadow-[0_0_15px_rgba(0,245,255,0.15)]" style={{ minWidth: 170 }}>
      <p className="text-[11px] font-black text-white">{entry.name}</p>
      <p className="mb-1 text-[10px] text-gray-500">{formatNumber(entry.total)} {t("common.total")}</p>
      {mode === "server" && entry.topPlayers && entry.topPlayers.length > 0 ? (
        <div className="space-y-0.5 border-t border-[#1A1A24] pt-1">
          {entry.topPlayers.map((p, i) => (
            <div key={i} className="flex items-center justify-between gap-3 text-[10px]">
              <span className="truncate text-gray-400">{i + 1}. {p.name}</span>
              <span className="text-white">{formatNumber(p.total)}</span>
              <span className="w-8 text-right font-bold text-[#00F5FF]">{p.pct}%</span>
            </div>
          ))}
        </div>
      ) : mode === "player" && entry.serverTotal != null ? (
        <div className="space-y-0.5 border-t border-[#1A1A24] pt-1">
          <div className="flex items-center justify-between gap-3 text-[10px]">
            <span className="text-gray-500">{t("donuts.yourShare")}</span>
            <span className="font-black text-[#00F5FF]">{entry.sharePct}%</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-[10px]">
            <span className="text-gray-500">{t("donuts.you")}</span>
            <span className="text-white">{formatNumber(entry.total)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-[10px]">
            <span className="text-gray-500">{t("donuts.serverTotal")}</span>
            <span className="text-gray-400">{formatNumber(entry.serverTotal)}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DonutCard({ title, icon, data, mode, t }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
        <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-white sm:text-sm">{icon} {title}</h3>
        <p className="py-8 text-center text-sm text-gray-600">{t("donuts.noData")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
      <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-white sm:text-sm">{icon} {title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="name" cx="50%" cy="50%"
            innerRadius={55} outerRadius={80} paddingAngle={2} stroke="none">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 0 3px ${entry.color}60)` }} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip mode={mode} t={t} />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: d.color, boxShadow: `0 0 4px ${d.color}80` }} />
            <span className="truncate text-gray-400">{d.name}</span>
            <span className="ml-auto font-bold text-white">{Math.round(d.total / data.reduce((s, x) => s + x.total, 0) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServerDonuts({ materialCategories, worldDistribution, mode = "server" }) {
  const t = useT();

  const catData = (materialCategories || [])
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .map(c => ({
      total: c.total,
      color: CATEGORY_META[c.category]?.color || "#6B7280",
      name: t(CATEGORY_META[c.category]?.labelKey || "donuts.other"),
      topPlayers: c.topPlayers || [],
      serverTotal: c.serverTotal,
      sharePct: c.sharePct
    }));

  const worldData = (worldDistribution || [])
    .filter(w => w.total > 0)
    .sort((a, b) => b.total - a.total)
    .map(w => {
      const meta = getWorldMeta(w.world);
      return {
        total: w.total,
        color: meta.color,
        name: meta.labelKey ? t(meta.labelKey) : w.world,
        topPlayers: w.topPlayers || [],
        serverTotal: w.serverTotal,
        sharePct: w.sharePct
      };
    });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DonutCard title={t("donuts.materialCategories")} icon="🧱" data={catData} mode={mode} t={t} />
      <DonutCard title={t("donuts.worldDistribution")} icon="🌍" data={worldData} mode={mode} t={t} />
    </div>
  );
}