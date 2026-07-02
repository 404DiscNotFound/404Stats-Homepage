import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowLeft, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Background from "@/components/Background";
import ServerHeader from "@/components/ServerHeader";
import PlayerHead from "@/components/PlayerHead";
import TopPlayersCard from "@/components/TopPlayersCard";
import GameModeFilter from "@/components/GameModeFilter";
import { formatNumber } from "@/lib/format";

const SORT_TABS = [
  { key: "total", label: "Total" },
  { key: "mined", label: "Mined" },
  { key: "placed", label: "Placed" },
  { key: "name", label: "Name" },
];

const PER_PAGE = 50;

export default function PlayerIndex() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("total");
  const [page, setPage] = useState(1);
  const [gameMode, setGameMode] = useState("SURVIVAL");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await base44.functions.invoke("getPlayerIndex", { slug, game_mode: gameMode });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Server nicht gefunden");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, gameMode]);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  const allPlayers = data?.players || [];

  const players = useMemo(() => {
    return [...allPlayers]
      .filter(p => p.player_name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sort === "name") return a.player_name.localeCompare(b.player_name);
        return (b[sort] || 0) - (a[sort] || 0);
      });
  }, [allPlayers, search, sort]);

  const totalPages = Math.ceil(players.length / PER_PAGE);
  const paginated = useMemo(
    () => players.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [players, page]
  );

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
          <Link to="/" className="mt-6 text-sm text-[#00F5FF] hover:underline">← Zurück zur Startseite</Link>
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
          {/* Header */}
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div>
              <h1 className="text-lg font-black text-white sm:text-2xl">Player Index</h1>
              <p className="text-xs text-gray-600 sm:text-sm">
                {data?.totalPlayers || 0} players · {formatNumber(data?.totals?.combined || 0)} total actions
              </p>
            </div>
            <Link
              to={`/server/${slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-3 py-2 text-xs font-bold text-gray-400 transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>

          {/* Game Mode Filter */}
          <div className="mb-4 flex justify-end sm:mb-6">
            <GameModeFilter value={gameMode} onChange={setGameMode} gameModes={data?.gameModes} />
          </div>

          {/* Top 10 Hall of Fame */}
          {allPlayers.length > 0 && !search && (
            <div className="mb-4 sm:mb-6">
              <TopPlayersCard players={allPlayers} />
            </div>
          )}

          {/* Search + Sort */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search players..."
                className="w-full rounded-lg border border-[#1A1A24] bg-[#0A0A0F] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#00F5FF]/40"
              />
            </div>
            <div className="flex gap-2">
              {SORT_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setSort(tab.key)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold transition-all ${
                    sort === tab.key
                      ? "border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF]"
                      : "border-[#1A1A24] bg-[#0A0A0F] text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Player Cards Grid */}
          {players.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="mx-auto mb-3 h-8 w-8 text-gray-700" />
              <p className="text-sm text-gray-600">
                {search ? "Keine Spieler gefunden." : "Noch keine Spielerdaten vorhanden."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
                {paginated.map((p, i) => {
                  const rankNum = (page - 1) * PER_PAGE + i + 1;
                  return (
                    <Link
                      key={p.uuid}
                      to={`/server/${slug}/player/${p.player_name}`}
                      className="group flex items-center gap-3 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] p-3 transition-all hover:border-[#00F5FF]/30 hover:bg-[#0F0F18]"
                    >
                      <span className="w-5 shrink-0 text-right text-[10px] font-bold text-gray-700">
                        {rankNum}
                      </span>
                      <PlayerHead uuid={p.uuid} name={p.player_name} size={32} className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-gray-300 group-hover:text-white sm:text-sm">
                          {p.player_name}
                        </p>
                        <div className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-[#111118]">
                          <div
                            className="bg-[#00F5FF]/70"
                            style={{ width: `${(p.mined / Math.max(p.total, 1)) * 100}%` }}
                          />
                          <div
                            className="bg-[#FF0055]/70"
                            style={{ width: `${(p.placed / Math.max(p.total, 1)) * 100}%` }}
                          />
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-gray-600">
                          <span className="text-[#00F5FF]/70">{formatNumber(p.mined)}</span>
                          <span className="text-gray-700">/</span>
                          <span className="text-[#FF0055]/70">{formatNumber(p.placed)}</span>
                          <span className="text-gray-700">·</span>
                          <span>{p.blockVariety} blocks</span>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-black text-white">
                        {formatNumber(p.total)}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-3 py-2 text-xs font-bold text-gray-400 transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF] disabled:opacity-30 disabled:hover:border-[#1A1A24] disabled:hover:text-gray-400"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Prev
                  </button>
                  <span className="text-xs text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-3 py-2 text-xs font-bold text-gray-400 transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF] disabled:opacity-30 disabled:hover:border-[#1A1A24] disabled:hover:text-gray-400"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}