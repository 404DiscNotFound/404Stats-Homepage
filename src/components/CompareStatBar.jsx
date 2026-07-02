import { formatNumber } from "@/lib/format";

export default function CompareStatBar({ label, p1Val, p2Val, fmt = formatNumber, suffix = "" }) {
  const p1Wins = p1Val > p2Val;
  const p2Wins = p2Val > p1Val;
  const max = Math.max(p1Val, p2Val, 1);
  const p1Pct = (p1Val / max) * 100;
  const p2Pct = (p2Val / max) * 100;

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className={`tabular-nums ${p1Wins ? 'font-black text-[#00F5FF]' : 'text-gray-500'}`}>
          {fmt(p1Val)}{suffix}
        </span>
        <span className="uppercase tracking-wider text-gray-600">{label}</span>
        <span className={`tabular-nums ${p2Wins ? 'font-black text-[#FF0055]' : 'text-gray-500'}`}>
          {fmt(p2Val)}{suffix}
        </span>
      </div>
      <div className="mt-1.5 flex h-3 gap-0.5">
        <div className="flex justify-end overflow-hidden rounded-l bg-[#111118]" style={{ flex: 1 }}>
          <div
            className="h-full rounded-l bg-[#00F5FF] transition-all duration-500"
            style={{ width: `${p1Pct}%`, boxShadow: p1Wins ? "0 0 8px rgba(0,245,255,0.5)" : undefined }}
          />
        </div>
        <div className="overflow-hidden rounded-r bg-[#111118]" style={{ flex: 1 }}>
          <div
            className="h-full rounded-r bg-[#FF0055] transition-all duration-500"
            style={{ width: `${p2Pct}%`, boxShadow: p2Wins ? "0 0 8px rgba(255,0,85,0.5)" : undefined }}
          />
        </div>
      </div>
    </div>
  );
}