import { Link } from "react-router-dom";
import PlayerHead from "./PlayerHead";
import { formatNumber } from "@/lib/format";
import { useT } from "@/lib/i18n";

export default function TopPlayersList({ players, slug, metric = "total", accent = "cyan" }) {
  const t = useT();
  if (!players || players.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-600">{t("topPlayers.noData")}</p>;
  }

  const accentColor = accent === "cyan" ? "#00F5FF" : "#FF0055";

  return (
    <div className="space-y-0.5">
      {players.map((p, i) => (
        <Link
          key={p.uuid}
          to={`/server/${slug}/player/${encodeURIComponent(p.player_name)}`}
          className="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#0F0F18]"
        >
          <span
            className="w-5 shrink-0 text-center text-xs font-black tabular-nums"
            style={{ color: i < 3 ? accentColor : undefined, textShadow: i < 3 ? `0 0 8px ${accentColor}80` : undefined }}
          >
            {i + 1}
          </span>
          <PlayerHead uuid={p.uuid} name={p.player_name} size={28} className="sm:!w-8 sm:!h-8" />
          <span className="flex-1 truncate text-sm font-medium text-gray-200 group-hover:text-white">{p.player_name}</span>
          <span className="flex shrink-0 items-center gap-2 text-xs tabular-nums">
            <span className="text-[#00F5FF]/70">{formatNumber(p.mined)}</span>
            <span className="text-gray-700">/</span>
            <span className="text-[#FF0055]/70">{formatNumber(p.placed)}</span>
            <span className="ml-1 font-bold text-white">{formatNumber(p.total)}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}