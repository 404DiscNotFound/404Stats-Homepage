const MODES = [
  { key: "SURVIVAL", label: "Survival" },
  { key: "CREATIVE", label: "Creative" },
  { key: "ALL", label: "All" },
];

export default function GameModeFilter({ value, onChange, gameModes }) {
  const availableModes = gameModes && gameModes.length > 0
    ? MODES.filter(m => m.key === "ALL" || gameModes.some(gm => gm.game_mode === m.key))
    : MODES;

  return (
    <div className="flex items-center gap-1 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] p-1">
      {availableModes.map(mode => (
        <button
          key={mode.key}
          onClick={() => onChange(mode.key)}
          className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
            value === mode.key
              ? "bg-[#00F5FF]/15 text-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.15)]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}