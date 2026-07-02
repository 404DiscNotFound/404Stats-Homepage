import { useMemo } from "react";
import { useT } from "@/lib/i18n";

export default function ServerActivityGlow({ trends }) {
  const t = useT();
  const waves = useMemo(() => {
    if (!trends || trends.length === 0) return null;
    const recent = trends.slice(-30);
    const maxVal = Math.max(...recent.map(t => (t.mined || 0) + (t.placed || 0)), 1);
    const W = 600;
    const H = 120;
    const stepX = W / (recent.length - 1 || 1);

    // Build smooth points for mined and total (mined+placed) lines
    const minedPts = recent.map((t, i) => ({ x: i * stepX, y: H - ((t.mined || 0) / maxVal) * H * 0.9 }));
    const totalPts = recent.map((t, i) => ({
      x: i * stepX,
      y: H - ((t.mined || 0) + (t.placed || 0)) / maxVal * H * 0.9,
    }));

    // Catmull-Rom -> bezier for smooth curves
    const smoothPath = (pts, closeBottom = false) => {
      if (pts.length < 2) {
        // Single point — draw a flat line
        if (pts.length === 1) {
          const y = pts[0].y;
          return closeBottom ? `M 0,${y} L ${W},${y} L ${W},${H} L 0,${H} Z` : `M 0,${y} L ${W},${y}`;
        }
        return "";
      }
      let d = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }
      if (closeBottom) {
        d += ` L ${pts[pts.length - 1].x},${H} L ${pts[0].x},${H} Z`;
      }
      return d;
    };

    return {
      totalPath: smoothPath(totalPts, true),
      minedPath: smoothPath(minedPts, true),
      totalLine: smoothPath(totalPts),
      minedLine: smoothPath(minedPts),
    };
  }, [trends]);

  if (!waves) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-0 top-1/2 h-32 w-1/2 -translate-y-1/2 opacity-30"
          style={{ background: "radial-gradient(ellipse at left, rgba(0,245,255,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="absolute right-0 top-1/2 h-32 w-1/2 -translate-y-1/2 opacity-30"
          style={{ background: "radial-gradient(ellipse at right, rgba(255,0,85,0.15) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
          {t("serverActivity.title")}
        </h2>
        <span className="text-[10px] text-gray-600 sm:text-xs">{t("serverActivity.last30Days")}</span>
      </div>

      {/* Flowing gradient waves */}
      <svg
        viewBox="0 0 600 120"
        preserveAspectRatio="none"
        className="relative z-10 h-28 w-full sm:h-36"
      >
        <defs>
          <linearGradient id="glow-total" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#7A5CFF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FF0055" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="glow-mined" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#00F5FF" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="glow-line-total" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="100%" stopColor="#FF0055" />
          </linearGradient>
        </defs>

        {/* Total wave (mined + placed) — filled gradient */}
        <path d={waves.totalPath} fill="url(#glow-total)" />
        {/* Mined wave — subtle cyan fill */}
        <path d={waves.minedPath} fill="url(#glow-mined)" />
        {/* Glow line on top of total */}
        <path
          d={waves.totalLine}
          fill="none"
          stroke="url(#glow-line-total)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }}
        />
        {/* Glow line on top of mined */}
        <path
          d={waves.minedLine}
          fill="none"
          stroke="#00F5FF"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 3px rgba(0,245,255,0.3))" }}
        />
      </svg>

      {/* Legend */}
      <div className="relative z-10 mt-3 flex gap-4 text-[10px] text-gray-600 sm:text-xs">
        <span className="flex items-center gap-1">
          <span
            className="h-0.5 w-4 rounded-full"
            style={{ background: "linear-gradient(to right, #00F5FF, #FF0055)" }}
          />
          {t("serverActivity.flow")}
        </span>
      </div>
    </div>
  );
}