import { useRef, useState } from "react";
import BlockIcon from "./BlockIcon";
import { formatNumber, formatMaterial } from "@/lib/format";

export default function TopBlocksChart({ materials }) {
  const tooltipRef = useRef(null);
  const [active, setActive] = useState(null);

  if (!materials || materials.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-600">No block data yet.</p>;
  }
  const maxTotal = Math.max(...materials.map(m => m.total), 1);

  const positionTooltip = (clientX, clientY) => {
    if (!tooltipRef.current) return;
    const tw = 180;
    const th = 100;
    const x = Math.min(clientX + 14, window.innerWidth - tw - 8);
    const y = clientY - th - 10 < 8 ? clientY + 16 : clientY - th - 10;
    tooltipRef.current.style.left = `${x}px`;
    tooltipRef.current.style.top = `${y}px`;
  };

  const handleMouseMove = (e, m) => {
    positionTooltip(e.clientX, e.clientY);
    if (!active || active.material !== m.material) {
      setActive(m);
    }
  };

  return (
    <>
      <div className="space-y-2" onMouseLeave={() => setActive(null)}>
        {materials.map((m, i) => (
          <div
            key={i}
            className="group flex items-center gap-2 rounded-lg px-1 py-0.5 transition-colors hover:bg-[#0F0F18] sm:gap-3"
            onMouseMove={(e) => handleMouseMove(e, m)}
          >
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

      {/* Floating tooltip — player share vs server */}
      <div
        ref={tooltipRef}
        className="pointer-events-none fixed z-50 rounded-lg border border-[#00F5FF]/30 bg-[#0A0A0F] px-3 py-2 shadow-[0_0_15px_rgba(0,245,255,0.1)]"
        style={{ display: active ? "block" : "none", minWidth: "170px" }}
      >
        {active && (
          <div className="whitespace-nowrap">
            <p className="text-[10px] font-bold text-white">{formatMaterial(active.material)}</p>
            <div className="mt-1 space-y-0.5 text-[10px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Your share</span>
                <span className="font-black text-[#00F5FF]">{active.sharePct}%</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">You</span>
                <span className="text-white">{formatNumber(active.total)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Server total</span>
                <span className="text-gray-400">{formatNumber(active.serverTotal)}</span>
              </div>
            </div>
            {/* Share bar */}
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#111118]">
              <div
                className="bg-gradient-to-r from-[#00F5FF] to-[#FF0055]"
                style={{ width: `${active.sharePct}%`, boxShadow: "0 0 6px rgba(0,245,255,0.4)" }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}