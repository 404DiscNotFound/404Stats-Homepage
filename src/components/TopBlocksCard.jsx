import BlockIcon from "./BlockIcon";
import PlayerHead from "./PlayerHead";
import { formatNumber, formatMaterial } from "@/lib/format";

export default function TopBlocksCard({ materials }) {
  if (!materials || materials.length === 0) return null;

  const top10 = materials.slice(0, 10);
  const maxTotal = Math.max(...top10.map(m => m.total), 1);

  const rankStyles = [
    "border-yellow-400/40 bg-yellow-400/5",
    "border-gray-300/30 bg-gray-300/5",
    "border-amber-600/40 bg-amber-600/5",
  ];

  return (
    <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
          <span className="text-base">🏆</span> Top 10 Blocks Hall of Fame
        </h2>
        <span className="text-[10px] text-gray-600 sm:text-xs">Most active blocks</span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        {top10.map((m, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${rankStyles[i] || "border-[#1A1A24] bg-[#08080E]"}`}
          >
            {/* Rank badge */}
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
              i === 0 ? "bg-yellow-400/20 text-yellow-400" :
              i === 1 ? "bg-gray-300/20 text-gray-300" :
              i === 2 ? "bg-amber-600/20 text-amber-500" :
              "bg-[#111118] text-gray-600"
            }`}>
              {i + 1}
            </span>

            {/* Block icon */}
            <BlockIcon material={m.material} size={28} className="shrink-0" />

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-bold text-white sm:text-sm">
                  {formatMaterial(m.material)}
                </p>
                <span className="shrink-0 text-xs font-black text-white sm:text-sm">
                  {formatNumber(m.total)}
                </span>
              </div>

              {/* Bar */}
              <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-[#111118]">
                <div
                  className="bg-[#00F5FF]/70"
                  style={{ width: `${(m.mined / maxTotal) * 100}%` }}
                />
                <div
                  className="bg-[#FF0055]/70"
                  style={{ width: `${(m.placed / maxTotal) * 100}%` }}
                />
              </div>

              {/* Stats line */}
              <div className="mt-1.5 flex items-center gap-2 text-[10px] text-gray-600">
                <span className="text-[#00F5FF]/70">{formatNumber(m.mined)} mined</span>
                <span className="text-gray-700">·</span>
                <span className="text-[#FF0055]/70">{formatNumber(m.placed)} placed</span>
                <span className="text-gray-700">·</span>
                <span>{m.playerCount} {m.playerCount === 1 ? "player" : "players"}</span>
                {m.sharePct >= 1 && (
                  <>
                    <span className="text-gray-700">·</span>
                    <span>{m.sharePct}%</span>
                  </>
                )}
              </div>
            </div>

            {/* Top contributor head */}
            {m.topContributor && (
              <div className="flex shrink-0 flex-col items-center gap-1">
                <PlayerHead uuid={m.topContributor.uuid} name={m.topContributor.name} size={28} />
                <span className="max-w-[60px] truncate text-[9px] text-gray-500">
                  {m.topContributor.name}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}