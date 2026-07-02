import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useT } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";
import { CATEGORY_META, getWorldMeta } from "@/lib/materialCategories";

function DonutCard({ title, icon, data, total }) {
  const t = useT();

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
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="name" cx="50%" cy="50%"
              innerRadius={50} outerRadius={75} paddingAngle={2} stroke="none">
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 0 3px ${entry.color}60)` }} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#0A0A0F", border: "1px solid #1A1A24", borderRadius: "8px", fontSize: "12px" }}
              labelStyle={{ color: "#666" }}
              formatter={(v, n) => [formatNumber(v), n]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9px] uppercase tracking-wider text-gray-600">{t("common.total")}</span>
          <span className="text-lg font-black text-white">{formatNumber(total)}</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: d.color, boxShadow: `0 0 4px ${d.color}80` }} />
            <span className="truncate text-gray-400">{d.name}</span>
            <span className="ml-auto font-bold text-white">{total > 0 ? Math.round(d.total / total * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServerDonuts({ materialCategories, worldDistribution }) {
  const t = useT();

  const catData = (materialCategories || [])
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .map(c => ({
      total: c.total,
      color: CATEGORY_META[c.category]?.color || "#6B7280",
      name: t(CATEGORY_META[c.category]?.labelKey || "donuts.other")
    }));
  const catTotal = catData.reduce((s, d) => s + d.total, 0);

  const worldData = (worldDistribution || [])
    .filter(w => w.total > 0)
    .sort((a, b) => b.total - a.total)
    .map(w => {
      const meta = getWorldMeta(w.world);
      return {
        total: w.total,
        color: meta.color,
        name: meta.labelKey ? t(meta.labelKey) : w.world
      };
    });
  const worldTotal = worldData.reduce((s, d) => s + d.total, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DonutCard title={t("donuts.materialCategories")} icon="🧱" data={catData} total={catTotal} />
      <DonutCard title={t("donuts.worldDistribution")} icon="🌍" data={worldData} total={worldTotal} />
    </div>
  );
}