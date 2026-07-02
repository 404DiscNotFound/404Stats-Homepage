import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swords, TrendingUp, Gem } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Background from "@/components/Background";
import ServerHeader from "@/components/ServerHeader";
import StatCard from "@/components/StatCard";
import TopBlocksChart from "@/components/TopBlocksChart";
import TopPlayersList from "@/components/TopPlayersList";
import PlayerSearch from "@/components/PlayerSearch";
import ServerTrends from "@/components/ServerTrends";
import RareBlocksList from "@/components/RareBlocksList";
import { formatNumber } from "@/lib/format";

export default function ServerDashboard() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [serverRes, trendsRes] = await Promise.all([
          base44.functions.invoke("getServerData", { slug }),
          base44.functions.invoke("getServerTrends", { slug }).catch(() => ({ data: { trends: [] } }))
        ]);
        setData(serverRes.data);
        setTrends(trendsRes.data.trends);
      } catch (err) {
        setError(err.response?.data?.error || "Server not found");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A1A24] border-t-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.3)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
        <Background />
        <div className="relative z-10">
          <p className="text-6xl font-black text-white">404</p>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <Link to="/" className="mt-6 text-sm text-[#00F5FF] hover:underline">← Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Background />
      <div className="relative z-10">
        <ServerHeader slug={slug} displayName={data?.server?.display_name} />

        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
          {/* Hero Stats */}
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            <StatCard label="Blocks Mined" value={formatNumber(data.totals.mined)} accent="cyan" />
            <StatCard label="Blocks Placed" value={formatNumber(data.totals.placed)} accent="pink" />
            <StatCard label="Total" value={formatNumber(data.totals.combined)} sublabel={`${data.totalPlayers} players`} accent="cyan" />
          </div>

          {/* Search + Compare */}
          <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row">
            <div className="flex-1">
              <PlayerSearch players={data.allPlayers} slug={slug} />
            </div>
            <Link
              to={`/server/${slug}/compare`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/5 px-4 py-2.5 text-sm font-bold text-[#00F5FF] transition-all hover:bg-[#00F5FF]/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.15)]"
            >
              <Swords className="h-4 w-4" /> Compare
            </Link>
          </div>

          {/* Server Trends */}
          <div className="mt-4 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:mt-6 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
                <TrendingUp className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
                Server Trend
              </h2>
              <div className="flex gap-3 text-[10px] text-gray-600 sm:gap-4 sm:text-xs">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.5)]" />Mined
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#FF0055] shadow-[0_0_6px_rgba(255,0,85,0.5)]" />Placed
                </span>
              </div>
            </div>
            <ServerTrends trends={trends} />
          </div>

          {/* Top Blocks */}
          <div className="mt-4 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:mt-6 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
              <Gem className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
              Top 25 Blocks
            </h2>
            <TopBlocksChart materials={data.topMaterials} />
          </div>

          {/* Leaderboards */}
          <div className="mt-4 grid gap-4 lg:grid-cols-2 sm:mt-6">
            <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
                <span className="text-[#00F5FF]" style={{ textShadow: "0 0 8px rgba(0,245,255,0.5)" }}>⛏</span>
                Top 25 Miners
              </h2>
              <TopPlayersList players={data.topMiners} slug={slug} metric="mined" accent="cyan" />
            </div>
            <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
                <span className="text-[#FF0055]" style={{ textShadow: "0 0 8px rgba(255,0,85,0.5)" }}>🧱</span>
                Top 25 Builders
              </h2>
              <TopPlayersList players={data.topBuilders} slug={slug} metric="placed" accent="pink" />
            </div>
          </div>

          {/* Rare Blocks */}
          {data.rareBlocks && data.rareBlocks.length > 0 && (
            <div className="mt-4 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:mt-6 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
                <span>💎</span> Rare Blocks
              </h2>
              <RareBlocksList blocks={data.rareBlocks} />
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 flex gap-6 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.5)]" />Mined
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FF0055] shadow-[0_0_6px_rgba(255,0,85,0.5)]" />Placed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}