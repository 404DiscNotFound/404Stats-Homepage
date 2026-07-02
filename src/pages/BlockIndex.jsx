import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Background from "@/components/Background";
import ServerHeader from "@/components/ServerHeader";
import BlockIcon from "@/components/BlockIcon";
import TopBlocksCard from "@/components/TopBlocksCard";
import BlockPlayersTooltip from "@/components/BlockPlayersTooltip";
import GameModeFilter from "@/components/GameModeFilter";
import PasswordPrompt from "@/components/PasswordPrompt";
import { useServerPassword } from "@/hooks/useServerPassword";
import { withAccessToken } from "@/lib/serverAuth";
import { formatNumber, formatMaterial } from "@/lib/format";

const SORT_TABS = [
  { key: "total", label: "Gesamt", accent: "text-white" },
  { key: "mined", label: "Abgebaut", accent: "text-[#00F5FF]" },
  { key: "placed", label: "Gebaut", accent: "text-[#FF0055]" },
];

export default function BlockIndex() {
  const { slug } = useParams();
  const { status, verifyPassword, handlePasswordError } = useServerPassword(slug);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("total");
  const [gameMode, setGameMode] = useState("SURVIVAL");
  const tooltipRef = useRef(null);
  const [hoverBlock, setHoverBlock] = useState(null);

  const positionTooltip = (clientX, clientY) => {
    if (!tooltipRef.current) return;
    const tw = 240;
    const th = 170;
    const x = Math.min(clientX + 14, window.innerWidth - tw - 8);
    const y = clientY - th - 10 < 8 ? clientY + 16 : clientY - th - 10;
    tooltipRef.current.style.left = `${x}px`;
    tooltipRef.current.style.top = `${y}px`;
  };

  const handleBlockHover = (e, m) => {
    positionTooltip(e.clientX, e.clientY);
    if (!hoverBlock || hoverBlock.material !== m.material) {
      setHoverBlock(m);
    }
  };

  useEffect(() => {
    if (status !== "ready") return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await base44.functions.invoke("getBlockIndex", withAccessToken(slug, { slug, game_mode: gameMode }));
        setData(res.data);
      } catch (err) {
        if (handlePasswordError(err)) return;
        setError(err.response?.data?.error || "Server nicht gefunden");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, gameMode, status]);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A1A24] border-t-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.3)]" />
      </div>
    );
  }

  if (status === "needsPassword") {
    return <PasswordPrompt onSubmit={verifyPassword} />;
  }

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

  const materials = (data?.materials || [])
    .filter(m => m.material.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b[sort] || 0) - (a[sort] || 0));

  const maxValue = Math.max(...materials.map(m => m[sort] || 0), 1);

  return (
    <div className="min-h-screen bg-black text-white">
      <Background />
      <div className="relative z-10">
        <ServerHeader slug={slug} displayName={data?.server?.display_name} />

        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div>
              <h1 className="text-lg font-black text-white sm:text-2xl">Block Index</h1>
              <p className="text-xs text-gray-600 sm:text-sm">
                {data?.totalMaterials || 0} unique blocks · {formatNumber(data?.totals?.combined || 0)} total actions
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
          {data?.materials && data.materials.length > 0 && !search && (
            <div className="mb-4 sm:mb-6">
              <TopBlocksCard materials={data.materials} />
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
                placeholder="Blöcke durchsuchen..."
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

          {/* Block List */}
          {materials.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-gray-600">
                {search ? "Keine Blöcke gefunden." : "Noch keine Blockdaten vorhanden."}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5" onMouseLeave={() => setHoverBlock(null)}>
              {materials.map((m, i) => {
                const val = m[sort] || 0;
                const minedPct = sort === "total" ? (m.mined / maxValue) * 100 : 0;
                const placedPct = sort === "total" ? (m.placed / maxValue) * 100 : 0;
                const singlePct = sort !== "total" ? (val / maxValue) * 100 : 0;

                return (
                  <div
                    key={i}
                    className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#0F0F18] sm:gap-3 sm:px-3 sm:py-2"
                    onMouseMove={(e) => handleBlockHover(e, m)}
                  >
                    <span className="w-5 shrink-0 text-right text-[10px] font-bold text-gray-700 sm:w-8 sm:text-xs">
                      {i + 1}
                    </span>
                    <BlockIcon material={m.material} size={20} className="sm:!w-6 sm:!h-6" />
                    <div className="w-20 shrink-0 sm:w-40">
                      <div className="truncate text-xs text-gray-300 group-hover:text-white sm:text-sm">
                        {formatMaterial(m.material)}
                      </div>
                      <div className="text-[9px] text-gray-600 sm:text-[10px]">
                        {m.playerPct != null ? `${m.playerPct}% of players` : ""}
                      </div>
                    </div>
                    <div className="flex h-5 min-w-[40px] flex-1 overflow-hidden rounded bg-[#111118] sm:h-6">
                      {sort === "total" ? (
                        <>
                          <div
                            className="bg-[#00F5FF]/70 transition-all duration-500"
                            style={{ width: `${minedPct}%`, boxShadow: "0 0 6px rgba(0,245,255,0.3)" }}
                          />
                          <div
                            className="bg-[#FF0055]/70 transition-all duration-500"
                            style={{ width: `${placedPct}%`, boxShadow: "0 0 6px rgba(255,0,85,0.3)" }}
                          />
                        </>
                      ) : (
                        <div
                          className={`transition-all duration-500 ${
                            sort === "mined" ? "bg-[#00F5FF]/70" : "bg-[#FF0055]/70"
                          }`}
                          style={{
                            width: `${singlePct}%`,
                            boxShadow: sort === "mined"
                              ? "0 0 6px rgba(0,245,255,0.3)"
                              : "0 0 6px rgba(255,0,85,0.3)"
                          }}
                        />
                      )}
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 text-xs tabular-nums sm:gap-2 sm:text-sm">
                      {sort === "total" ? (
                        <>
                          <span className="text-[#00F5FF]/70">{formatNumber(m.mined)}</span>
                          <span className="text-gray-700">/</span>
                          <span className="text-[#FF0055]/70">{formatNumber(m.placed)}</span>
                          <span className="ml-0.5 font-bold text-white sm:ml-1">{formatNumber(m.total)}</span>
                        </>
                      ) : (
                        <span className={`font-bold ${sort === "mined" ? "text-[#00F5FF]" : "text-[#FF0055]"}`}>
                          {formatNumber(val)}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
            )}

            <BlockPlayersTooltip tooltipRef={tooltipRef} active={hoverBlock} metric={sort} />
            </div>
            </div>
            </div>
            );
            }