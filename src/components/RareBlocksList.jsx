import BlockIcon from "./BlockIcon";

const formatNumber = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return (n || 0).toLocaleString("de-DE");
};

const formatMaterial = (m) => m.split("_").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");

export default function RareBlocksList({ blocks }) {
  if (!blocks || blocks.length === 0) {
    return <p className="py-4 text-center text-sm text-gray-600">Noch keine seltenen Blöcke gefunden.</p>;
  }

  return (
    <div className="space-y-1">
      {blocks.map((b, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#0F0F18]">
          <BlockIcon material={b.material} size={20} className="sm:!w-6 sm:!h-6" />
          <span className="flex-1 truncate text-xs text-gray-300 sm:text-sm">{formatMaterial(b.material)}</span>
          {b.topPlayer && (
            <span className="hidden text-xs text-[#00F5FF]/60 sm:inline">👑 {b.topPlayer}</span>
          )}
          <span className="flex shrink-0 items-center gap-1.5 text-xs tabular-nums">
            <span className="text-[#00F5FF]/70">{formatNumber(b.mined)}</span>
            <span className="text-gray-700">/</span>
            <span className="text-[#FF0055]/70">{formatNumber(b.placed)}</span>
            <span className="ml-0.5 font-bold text-white">{formatNumber(b.total)}</span>
          </span>
        </div>
      ))}
    </div>
  );
}