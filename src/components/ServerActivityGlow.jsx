export default function ServerActivityGlow({ trends }) {
  if (!trends || trends.length === 0) return null;

  const recentTrends = trends.slice(-30);
  const maxVal = Math.max(...recentTrends.map(t => (t.mined || 0) + (t.placed || 0)), 1);

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(0,245,255,0.04) 0%, transparent 70%)' }} />

      <div className="relative z-10 mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
          Server Activity
        </h2>
        <span className="text-[10px] text-gray-600 sm:text-xs">Last 30 days</span>
      </div>

      {/* Equalizer bars */}
      <div className="relative z-10 flex h-28 items-end gap-0.5 sm:h-36 sm:gap-1">
        {recentTrends.map((t, i) => {
          const mined = t.mined || 0;
          const placed = t.placed || 0;
          const total = mined + placed;
          const heightPct = (total / maxVal) * 100;
          const minedRatio = total > 0 ? (mined / total) * 100 : 0;
          const placedRatio = 100 - minedRatio;

          return (
            <div key={i} className="relative flex-1" style={{ height: '100%' }}>
              <div
                className="absolute bottom-0 left-0 right-0 flex flex-col overflow-hidden rounded-t-sm transition-all duration-300 hover:opacity-100"
                style={{ height: `${heightPct}%`, minHeight: '2px', opacity: 0.75 }}
              >
                <div
                  className="bg-[#FF0055]"
                  style={{ height: `${placedRatio}%`, boxShadow: '0 0 6px rgba(255,0,85,0.5)' }}
                />
                <div
                  className="bg-[#00F5FF]"
                  style={{ height: `${minedRatio}%`, boxShadow: '0 0 6px rgba(0,245,255,0.5)' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="relative z-10 mt-3 flex gap-4 text-[10px] text-gray-600 sm:text-xs">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.5)]" />Mined
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#FF0055] shadow-[0_0_6px_rgba(255,0,85,0.5)]" />Placed
        </span>
      </div>
    </div>
  );
}