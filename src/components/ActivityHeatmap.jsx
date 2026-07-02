const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function ActivityHeatmap({ activity }) {
  const tzOffset = -new Date().getTimezoneOffset() / 60;

  const grid = {};
  let maxVal = 0;
  for (const a of (activity || [])) {
    const shifted = a.hour + tzOffset;
    const localDay = (a.day + Math.floor(shifted / 24) + 7) % 7;
    const localHour = ((shifted % 24) + 24) % 24;
    const key = `${localDay}-${localHour}`;
    grid[key] = (grid[key] || 0) + a.total;
    if (grid[key] > maxVal) maxVal = grid[key];
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[480px] sm:min-w-[520px]">
        <div className="flex items-center justify-between pl-8 pr-1">
          <span className="text-[9px] text-gray-700">Local time (browser)</span>
        </div>
        <div className="flex pl-8">
          {HOURS.map(h => (
            <div key={h} className="flex-1 text-center text-[8px] text-gray-700">
              {h % 3 === 0 ? `${h}` : ''}
            </div>
          ))}
        </div>
        {DAY_ORDER.map(day => (
          <div key={day} className="flex items-center">
            <div className="w-8 text-[10px] font-bold text-gray-600">{DAYS[day]}</div>
            {HOURS.map(hour => {
              const val = grid[`${day}-${hour}`] || 0;
              const intensity = maxVal > 0 ? val / maxVal : 0;
              return (
                <div
                  key={hour}
                  className="m-px flex-1 rounded-sm transition-all hover:ring-1 hover:ring-[#00F5FF]/50"
                  style={{
                    height: '14px',
                    backgroundColor: val > 0
                      ? `rgba(0, 245, 255, ${0.1 + intensity * 0.9})`
                      : 'rgba(255,255,255,0.02)',
                    boxShadow: val > 0 && intensity > 0.7 ? `0 0 4px rgba(0,245,255,${intensity * 0.4})` : undefined
                  }}
                  title={`${DAYS[day]} ${String(hour).padStart(2,'0')}:00 — ${val} blocks`}
                />
              );
            })}
          </div>
        ))}
        <div className="mt-2 flex items-center gap-2 pl-8 text-[9px] text-gray-700">
          <span>Less</span>
          {[0.05, 0.25, 0.5, 0.75, 1].map(op => (
            <div key={op} className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: `rgba(0, 245, 255, ${0.1 + op * 0.9})` }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}