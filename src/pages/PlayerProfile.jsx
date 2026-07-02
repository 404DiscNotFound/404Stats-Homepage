import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Background from "@/components/Background";
import ServerHeader from "@/components/ServerHeader";
import StatCard from "@/components/StatCard";
import TopBlocksChart from "@/components/TopBlocksChart";
import PlayerHead from "@/components/PlayerHead";
import TimeRangeTabs from "@/components/TimeRangeTabs";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import AchievementsList from "@/components/AchievementsList";
import RareBlocksList from "@/components/RareBlocksList";
import { formatNumber } from "@/lib/format";

export default function PlayerProfile() {
  const { slug, playerName } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await base44.functions.invoke("getPlayerData", { slug, playerName, range });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Player not found");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, playerName, range]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A1A24] border-t-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.3)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-black">
        <Background />
        <div className="relative z-10">
          <ServerHeader slug={slug} />
          <div className="flex flex-col items-center pt-20 text-center">
            <p className="text-5xl font-black text-white">404</p>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <Link to={`/server/${slug}`} className="mt-6 text-sm text-[#00F5FF] hover:underline">← Back to server</Link>
          </div>
        </div>
      </div>
    );
  }

  const p = data.player;

  return (
    <div className="min-h-screen bg-black text-white">
      <Background />
      <div className="relative z-10">
        <ServerHeader slug={slug} />

        <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-8">
          <Link to={`/server/${slug}`} className="mb-5 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white sm:mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to server
          </Link>

          {/* Player Header + Time Range */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <PlayerHead uuid={p.uuid} name={p.player_name} size={56} className="sm:!w-16 sm:!h-16" />
              <div>
                <h1 className="text-xl font-black text-white sm:text-2xl" style={{ textShadow: "0 0 15px rgba(0,245,255,0.2)" }}>
                  {p.player_name}
                </h1>
                <p className="text-sm text-gray-500">
                  Rank <span className="font-bold text-[#00F5FF]" style={{ textShadow: "0 0 8px rgba(0,245,255,0.4)" }}>#{p.rank}</span> of {p.totalPlayers} players
                </p>
              </div>
            </div>
            <TimeRangeTabs active={range} onChange={setRange} />
          </div>

          {/* Stats */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
            <StatCard label="Blocks Mined" value={formatNumber(p.mined)} accent="cyan" />
            <StatCard label="Blocks Placed" value={formatNumber(p.placed)} accent="pink" />
            <StatCard label="Total" value={formatNumber(p.total)} accent="cyan" />
          </div>

          {/* Top Blocks */}
          <div className="mt-4 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:mt-6 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-white sm:text-sm">⚡ Top Blocks</h2>
              <div className="flex gap-3 text-[10px] text-gray-600 sm:gap-4 sm:text-xs">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.5)]" />Mined
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#FF0055] shadow-[0_0_6px_rgba(255,0,85,0.5)]" />Placed
                </span>
              </div>
            </div>
            <TopBlocksChart materials={data.topMaterials} />
          </div>

          {/* Achievements */}
          <div className="mt-4 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:mt-6 sm:p-6">
            <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-white sm:text-sm">🏆 Achievements</h2>
            <AchievementsList achievements={data.achievements} />
          </div>

          {/* Activity Heatmap */}
          <div className="mt-4 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:mt-6 sm:p-6">
            <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-white sm:text-sm">🕐 Activity Heatmap</h2>
            <ActivityHeatmap activity={data.heatmap} />
          </div>

          {/* Rare Blocks */}
          {data.rareBlocks && data.rareBlocks.length > 0 && (
            <div className="mt-4 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:mt-6 sm:p-6">
              <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-white sm:text-sm">💎 Rare Blocks</h2>
              <RareBlocksList blocks={data.rareBlocks} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}