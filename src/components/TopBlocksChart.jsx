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
    <div className="space-y-1.5">
      {materials.map((m, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-3">
          <span className="w-20 shrink-0 truncate text-xs text-gray-400 sm:w-32 sm:text-sm">
            {formatMaterial(m.material)}
          </span>
          <div className="flex h-5 min-w-[40px] flex-1 overflow-hidden rounded bg-[#111118] sm:h-6">
            <div
              className="bg-[#00F5FF]/70 transition-all duration-500"
              style={{ width: `${(m.mined / maxTotal) * 100}%` }}
            />
            <div
              className="bg-[#FF0055]/70 transition-all duration-500"
              style={{ width: `${(m.placed / maxTotal) * 100}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-xs font-semibold text-white sm:w-16 sm:text-sm">
            {formatNumber(m.total)}
          </span>
        </div>
      ))}
    </div>
  );
}