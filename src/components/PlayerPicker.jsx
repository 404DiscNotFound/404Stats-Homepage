import { useState } from "react";
import { Check } from "lucide-react";
import PlayerHead from "@/components/PlayerHead";
import { formatNumber } from "@/lib/format";

export default function PlayerPicker({ label, players, value, onSelect, accent }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = query.trim()
    ? players.filter(p => p.player_name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];
  const showDropdown = focused && query.trim().length > 0 && results.length > 0;

  const handleSelect = (p) => {
    onSelect(p.player_name);
    setQuery("");
    setFocused(false);
  };

  const handleClear = () => {
    onSelect("");
    setQuery("");
  };

  return (
    <div className="relative">
      <label className="mb-1 block text-xs uppercase tracking-wider text-gray-600">{label}</label>
      {value ? (
        <div
          className="flex w-full items-center gap-3 rounded-lg border bg-[#0A0A0F] px-3 py-2.5"
          style={{ borderColor: `${accent}50`, boxShadow: `0 0 10px ${accent}20` }}
        >
          <PlayerHead uuid={players.find(p => p.player_name === value)?.uuid} name={value} size={28} />
          <span className="flex-1 text-sm font-bold text-white">{value}</span>
          <button
            onClick={handleClear}
            className="rounded-md px-2 py-1 text-xs text-gray-500 transition-colors hover:text-white"
          >
            ✕
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Player name..."
          className="w-full rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#00F5FF]/50"
          style={{ boxShadow: query ? `0 0 10px ${accent}20` : undefined }}
        />
      )}
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-[#1A1A24] bg-[#0F0F14] shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          {results.map(p => (
            <button
              key={p.uuid}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(p); }}
              className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-[#1A1A24]"
            >
              <PlayerHead uuid={p.uuid} name={p.player_name} size={24} />
              <span className="flex-1 text-sm text-white">{p.player_name}</span>
              <span className="text-xs text-gray-600">{formatNumber(p.total)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}