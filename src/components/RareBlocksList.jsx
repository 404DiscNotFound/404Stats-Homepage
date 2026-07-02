import BlockIcon from "./BlockIcon";
import { formatNumber, formatMaterial } from "@/lib/format";

export default function RareBlocksList({ blocks }) {
  if (!blocks || blocks.length === 0) {
    return <p className="py-4 text-center text-sm text-gray-600">No rare blocks found yet.</p>;
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