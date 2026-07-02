import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import PlayerHead from "./PlayerHead";

const formatNumber = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return (n || 0).toLocaleString("de-DE");
};

export default function PlayerSearch({ players, slug }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const filtered = query.trim()
    ? players
        .filter(p => p.player_name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10)
    : [];

  const handleSelect = (name) => {
    navigate(`/server/${slug}/player/${encodeURIComponent(name)}`);
    setQuery("");
    setFocused(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00F5FF]/50" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Spieler suchen..."
          className="w-full rounded-lg border border-[#1A1A24] bg-[#0A0A0F] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#00F5FF]/50 focus:shadow-[0_0_15px_rgba(0,245,255,0.1)]"
        />
      </div>
      {focused && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-[#1A1A24] bg-[#0F0F14] shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          {filtered.map(p => (
            <button
              key={p.uuid}
              onMouseDown={() => handleSelect(p.player_name)}
              className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-[#1A1A24]"
            >
              <PlayerHead uuid={p.uuid} name={p.player_name} size={24} />
              <span className="flex-1 text-sm text-white">{p.player_name}</span>
              <span className="text-xs text-gray-600">{formatNumber(p.total)} Blöcke</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}