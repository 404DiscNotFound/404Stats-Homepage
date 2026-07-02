import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ServerHeader from "@/components/ServerHeader";
import StatCard from "@/components/StatCard";
import TopBlocksChart from "@/components/TopBlocksChart";

const formatNumber = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return (n || 0).toLocaleString("de-DE");
};

export default function PlayerProfile() {
  const { slug, playerName } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await base44.functions.invoke("getPlayerData", { slug, playerName });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Spieler nicht gefunden");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, playerName]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A1A24] border-t-[#00F5FF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <ServerHeader slug={slug} />
        <div className="flex flex-col items-center pt-20 text-center">
          <p className="text-5xl font-black text-white">404</p>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <Link to={`/server/${slug}`} className="mt-6 text-sm text-[#00F5FF] hover:underline">
            ← Zurück zum Server
          </Link>
        </div>
      </div>
    );
  }

  const p = data.player;

  return (
    <div className="min-h-screen bg-black">
      <ServerHeader slug={slug} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link
          to={`/server/${slug}`}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück zum Server
        </Link>

        {/* Player Header */}
        <div className="flex items-center gap-4">
          <img
            src={`https://crafatar.com/avatars/${p.uuid}?size=100&overlay`}
            alt={p.player_name}
            className="h-14 w-14 rounded-lg sm:h-16 sm:w-16"
          />
          <div>
            <h1 className="text-xl font-black text-white sm:text-2xl">{p.player_name}</h1>
            <p className="text-sm text-gray-500">
              Rang <span className="font-bold text-[#00F5FF]">#{p.rank}</span> von {p.totalPlayers} Spielern
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
          <StatCard label="Blöcke abgebaut" value={formatNumber(p.mined)} accent="cyan" />
          <StatCard label="Blöcke gesetzt" value={formatNumber(p.placed)} accent="pink" />
          <StatCard label="Gesamt" value={formatNumber(p.total)} accent="cyan" />
        </div>

        {/* Top Blocks */}
        <div className="mt-8 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Top Blöcke</h2>
            <div className="flex gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#00F5FF]"></span>Abgebaut
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#FF0055]"></span>Gesetzt
              </span>
            </div>
          </div>
          <TopBlocksChart materials={data.topMaterials} />
        </div>
      </div>
    </div>
  );
}