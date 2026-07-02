import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swords } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ServerHeader from "@/components/ServerHeader";
import StatCard from "@/components/StatCard";
import TopBlocksChart from "@/components/TopBlocksChart";
import TopPlayersList from "@/components/TopPlayersList";
import PlayerSearch from "@/components/PlayerSearch";
import ServerTrends from "@/components/ServerTrends";
import RareBlocksList from "@/components/RareBlocksList";

const formatNumber = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return (n || 0).toLocaleString("de-DE");
};

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
        setError(err.response?.data?.error || "Server nicht gefunden");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A1A24] border-t-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.3)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
        <p className="text-5xl font-black text-white">404</p>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
        <Link to="/" className="mt-6 text-sm text-[#00F5FF] hover:underline">← Zur Startseite</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <ServerHeader slug={slug} displayName={data?.server?.display_name} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Hero Stats */}
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          <StatCard label="Blöcke abgebaut" value={formatNumber(data.totals.mined)} accent="cyan" />
          <StatCard label="Blöcke gesetzt" value={formatNumber(data.totals.placed)} accent="pink" />
          <StatCard label="Gesamt" value={formatNumber(data.totals.combined)} sublabel={`${data.totalPlayers} Spieler`} accent="cyan" />
        </div>

        {/* Search + Compare */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <PlayerSearch players={data.allPlayers} slug={slug} />
          </div>
          <Link
            to={`/server/${slug}/compare`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/5 px-4 py-2.5 text-sm font-bold text-[#00F5FF] transition-all hover:bg-[#00F5FF]/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.15)]"
          >
            <Swords className="h-4 w-4" /> Vergleichen
          </Link>
        </div>

        {/* Server Trends */}
        <div className="mt-6 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-white">📈 Server Trend (30 Tage)</h2>
            <div className="flex gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.5)]"></span>Abgebaut
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#FF0055] shadow-[0_0_6px_rgba(255,0,85,0.5)]"></span>Gesetzt
              </span>
            </div>
          </div>
          <ServerTrends trends={trends} />
        </div>

        {/* Top Blocks */}
        <div className="mt-6 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-5 sm:p-6">
          <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-white">⚡ Top 25 Blöcke</h2>
          <TopBlocksChart materials={data.topMaterials} />
        </div>

        {/* Two player leaderboards */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
              <span className="text-[#00F5FF]" style={{ textShadow: "0 0 8px rgba(0,245,255,0.5)" }}>⛏</span>
              Top 25 Abgebaut
            </h2>
            <TopPlayersList players={data.topMiners} slug={slug} metric="mined" accent="cyan" />
          </div>
          <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
              <span className="text-[#FF0055]" style={{ textShadow: "0 0 8px rgba(255,0,85,0.5)" }}>🧱</span>
              Top 25 Gesetzt
            </h2>
            <TopPlayersList players={data.topBuilders} slug={slug} metric="placed" accent="pink" />
          </div>
        </div>

        {/* Rare Blocks */}
        {data.rareBlocks && data.rareBlocks.length > 0 && (
          <div className="mt-6 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-5 sm:p-6">
            <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-white">💎 Seltene Blöcke</h2>
            <RareBlocksList blocks={data.rareBlocks} />
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex gap-6 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.5)]"></span>Abgebaut
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF0055] shadow-[0_0_6px_rgba(255,0,85,0.5)]"></span>Gesetzt
          </span>
        </div>
      </div>
    </div>
  );
}