import { useRef, useState } from "react";
import { formatNumber } from "@/lib/format";
import { useT } from "@/lib/i18n";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function ActivityHeatmap({ activity }) {
  const t = useT();
  const DAYS = t("heatmap.days").split(',');
  const tzOffset = -new Date().getTimezoneOffset() / 60;
  const tooltipRef = useRef(null);
  const [active, setActive] = useState(null);

  const grid = {};
  let maxVal = 0;
  for (const a of (activity || [])) {
    const shifted = a.hour + tzOffset;
    const localDay = (a.day + Math.floor(shifted / 24) + 7) % 7;
    const localHour = ((shifted % 24) + 24) % 24;
    const key = `${localDay}-${localHour}`;
    if (!grid[key]) grid[key] = { mined: 0, placed: 0, total: 0 };
    const mined = a.mined || 0;
    const placed = a.placed || 0;
    grid[key].mined += mined;
    grid[key].placed += placed;
    grid[key].total += a.total || (mined + placed);
    if (grid[key].total > maxVal) maxVal = grid[key].total;
  }

  const positionTooltip = (clientX, clientY) => {
    if (!tooltipRef.current) return;
    const tw = 150;
    const th = 64;
    const x = Math.min(clientX + 14, window.innerWidth - tw - 8);
    const y = clientY - th - 10 < 8 ? clientY + 16 : clientY - th - 10;
    tooltipRef.current.style.left = `${x}px`;
    tooltipRef.current.style.top = `${y}px`;
  };

  const cellData = (day, hour) => grid[`${day}-${hour}`] || { mined: 0, placed: 0, total: 0 };

  const handleMouseMove = (e, day, hour) => {
    positionTooltip(e.clientX, e.clientY);
    if (!active || active.day !== day || active.hour !== hour) {
      setActive({ day, hour, ...cellData(day, hour) });
    }
  };

  const handleClick = (e, day, hour) => {
    if (active && active.day === day && active.hour === hour) {
      setActive(null);
      return;
    }
    positionTooltip(e.clientX, e.clientY);
    setActive({ day, hour, ...cellData(day, hour) });
  };

  return (
    <>
      <div
        className="overflow-x-auto"
        onMouseLeave={() => setActive(null)}
      >
        <div className="min-w-[480px] sm:min-w-[520px]">
          <div className="flex items-center justify-between pl-8 pr-1">
            <span className="text-[9px] text-gray-700">{t("heatmap.localTime")}</span>
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
                const cell = cellData(day, hour);
                const intensity = maxVal > 0 ? cell.total / maxVal : 0;
                const isActive = active && active.day === day && active.hour === hour;
                return (
                  <div
                    key={hour}
                    className={`m-px flex-1 rounded-sm transition-all ${isActive ? 'ring-1 ring-[#00F5FF]' : 'hover:ring-1 hover:ring-[#00F5FF]/40'}`}
                    style={{
                      height: '14px',
                      backgroundColor: cell.total > 0
                        ? `rgba(0, 245, 255, ${0.1 + intensity * 0.9})`
                        : 'rgba(255,255,255,0.02)',
                      boxShadow: cell.total > 0 && intensity > 0.7 ? `0 0 4px rgba(0,245,255,${intensity * 0.4})` : undefined
                    }}
                    onMouseMove={(e) => handleMouseMove(e, day, hour)}
                    onClick={(e) => handleClick(e, day, hour)}
                  />
                );
              })}
            </div>
          ))}
          <div className="mt-2 flex items-center gap-2 pl-8 text-[9px] text-gray-700">
            <span>{t("heatmap.less")}</span>
            {[0.05, 0.25, 0.5, 0.75, 1].map(op => (
              <div key={op} className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: `rgba(0, 245, 255, ${0.1 + op * 0.9})` }} />
            ))}
            <span>{t("heatmap.more")}</span>
          </div>
        </div>
      </div>

      {/* Floating tooltip — always mounted, positioned via ref */}
      <div
        ref={tooltipRef}
        className="fixed z-50 pointer-events-none rounded-lg border border-[#00F5FF]/30 bg-[#0A0A0F] px-3 py-2 shadow-[0_0_15px_rgba(0,245,255,0.1)]"
        style={{ display: active ? 'block' : 'none', minWidth: '140px' }}
      >
        {active && (
          <div className="whitespace-nowrap">
            <p className="text-[10px] font-bold text-white">{DAYS[active.day]} {String(active.hour).padStart(2, '0')}:00</p>
            <div className="mt-1 flex items-center gap-2 text-[10px]">
              <span className="text-[#00F5FF]">⛏ {formatNumber(active.mined)}</span>
              <span className="text-[#FF0055]">🧱 {formatNumber(active.placed)}</span>
            </div>
            <p className="mt-0.5 text-[10px] font-black text-white">{formatNumber(active.total)} {t("common.total").toLowerCase()}</p>
          </div>
        )}
      </div>
    </>
  );
}