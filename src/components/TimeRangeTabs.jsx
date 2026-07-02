const RANGES = [
  { value: "day", label: "Tag" },
  { value: "week", label: "Woche" },
  { value: "month", label: "Monat" },
  { value: "year", label: "Jahr" },
  { value: "all", label: "Gesamt" },
];

export default function TimeRangeTabs({ active, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-[#1A1A24] bg-[#0A0A0F] p-0.5">
      {RANGES.map(r => {
        const isActive = active === r.value;
        return (
          <button
            key={r.value}
            onClick={() => onChange(r.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all sm:px-4 ${
              isActive
                ? "bg-[#00F5FF] text-black shadow-[0_0_12px_rgba(0,245,255,0.4)]"
                : "text-gray-500 hover:text-white"
            }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}