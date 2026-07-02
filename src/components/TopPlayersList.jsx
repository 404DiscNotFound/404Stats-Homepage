import { Link } from "react-router-dom";
import PlayerHead from "./PlayerHead";

const formatNumber = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return (n || 0).toLocaleString("de-DE");
};

export default function TopPlayersList({ players, slug, metric = "total", accent = "cyan" }) {
  if (!players || players.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-600">Noch keine Spieler-Daten verfügbar.</p>;
  }

  const accentColor = accent === "cyan" ? "#00F5FF" : "#FF0055";
  const label = metric === "mined" ? "Abgebaut" : metric === "placed" ? "Gesetzt" : "Gesamt";

  return (
    <div className="space-y-0.5">
      {players.map((p, i) => {
        const value = metric === "mined" ? p.mined : metric === "placed" ? p.placed : p.total;
        return (
          <Link
            key={p.uuid}
            to={`/server/${slug}/player/${encodeURIComponent(p.player_name)}`}
            className="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#0F0F18]"
          >
            <span
              className="w-6 shrink-0 text-center text-xs font-black tabular-nums"
              style={{ color: i < 3 ? accentColor : undefined, textShadow: i < 3 ? `0 0 8px ${accentColor}80` : undefined }}
            >
              {i + 1}
            </span>
            <PlayerHead uuid={p.uuid} name={p.player_name} size={28} className="sm:!w-8 sm:!h-8" />
            <span className="flex-1 truncate text-sm font-medium text-gray-200 group-hover:text-white">{p.player_name}</span>
            <span className="shrink-0 text-sm font-bold tabular-nums" style={{ color: accentColor }}>{formatNumber(value)}</span>
          </Link>
        );
      })}
    </div>
  );
}