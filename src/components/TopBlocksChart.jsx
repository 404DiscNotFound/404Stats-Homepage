import BlockIcon from "./BlockIcon";

const formatNumber = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return (n || 0).toLocaleString("de-DE");
};

const formatMaterial = (m) =>
  m.split("_").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");

export default function TopBlocksChart({ materials }) {
  if (!materials || materials.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-600">Noch keine Block-Daten verfügbar.</p>;
  }
  const maxTotal = Math.max(...materials.map(m => m.total), 1);

  return (
    <div className="space-y-2">
      {materials.map((m, i) => (
        <div key={i} className="group flex items-center gap-2 sm:gap-3 rounded-lg px-1 py-0.5 transition-colors hover:bg-[#0F0F18]">
          <BlockIcon material={m.material} size={20} className="sm:!w-6 sm:!h-6" />
          <span className="w-20 shrink-0 truncate text-xs text-gray-300 group-hover:text-white sm:w-32 sm:text-sm">
            {formatMaterial(m.material)}
          </span>
          <div className="flex h-5 min-w-[40px] flex-1 overflow-hidden rounded bg-[#111118] sm:h-6">
            <div
              className="bg-[#00F5FF]/70 transition-all duration-500"
              style={{ width: `${(m.mined / maxTotal) * 100}%`, boxShadow: "0 0 6px rgba(0,245,255,0.3)" }}
            />
            <div
              className="bg-[#FF0055]/70 transition-all duration-500"
              style={{ width: `${(m.placed / maxTotal) * 100}%`, boxShadow: "0 0 6px rgba(255,0,85,0.3)" }}
            />
          </div>
          <span className="flex shrink-0 items-center gap-1.5 text-xs tabular-nums sm:gap-2">
            <span className="text-[#00F5FF]/70">{formatNumber(m.mined)}</span>
            <span className="text-gray-700">/</span>
            <span className="text-[#FF0055]/70">{formatNumber(m.placed)}</span>
            <span className="ml-0.5 font-bold text-white sm:ml-1">{formatNumber(m.total)}</span>
          </span>
        </div>
      ))}
    </div>
  );
}