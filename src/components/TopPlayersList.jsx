import { Link } from "react-router-dom";

const formatNumber = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return (n || 0).toLocaleString("de-DE");
};

export default function TopPlayersList({ players, slug }) {
  if (!players || players.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-600">Noch keine Spieler-Daten verfügbar.</p>;
  }

  return (
    <div className="space-y-0.5">
      {players.map((p, i) => (
        <Link
          key={p.uuid}
          to={`/server/${slug}/player/${encodeURIComponent(p.player_name)}`}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#111118]"
        >
          <span className="w-6 shrink-0 text-center text-xs font-bold text-gray-600">#{i + 1}</span>
          <img
            src={`https://crafatar.com/avatars/${p.uuid}?size=48&overlay`}
            alt={p.player_name}
            className="h-7 w-7 shrink-0 rounded sm:h-8 sm:w-8"
          />
          <span className="flex-1 truncate text-sm font-medium text-white">{p.player_name}</span>
          <span className="shrink-0 text-sm font-bold tabular-nums text-white">{formatNumber(p.total)}</span>
        </Link>
      ))}
    </div>
  );
}