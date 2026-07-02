import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Swords, Trophy, Gem, Layers, TrendingUp, Activity, Zap, Percent } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Background from "@/components/Background";
import ServerHeader from "@/components/ServerHeader";
import PlayerHead from "@/components/PlayerHead";
import TopBlocksChart from "@/components/TopBlocksChart";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import BlockIcon from "@/components/BlockIcon";
import CompareStatBar from "@/components/CompareStatBar";
import GameModeFilter from "@/components/GameModeFilter";
import PlayerPicker from "@/components/PlayerPicker";
import PasswordPrompt from "@/components/PasswordPrompt";
import { useServerPassword } from "@/hooks/useServerPassword";
import { withAccessToken } from "@/lib/serverAuth";
import { formatNumber, formatMaterial } from "@/lib/format";

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ACCENTS = ["#00F5FF", "#FF0055"];

export default function ComparePlayers() {
  const { slug } = useParams();
  const { status, verifyPassword, handlePasswordError } = useServerPassword(slug);
  const [allPlayers, setAllPlayers] = useState([]);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [serverTotals, setServerTotals] = useState(null);
  const [serverGameModes, setServerGameModes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameMode, setGameMode] = useState("SURVIVAL");

  useEffect(() => {
    if (status !== "ready") return;
    const fetchPlayers = async () => {
      try {
        const res = await base44.functions.invoke("getServerData", withAccessToken(slug, { slug, game_mode: gameMode }));
        setAllPlayers(res.data.allPlayers);
        setServerTotals(res.data.totals);
        setServerGameModes(res.data.gameModes);
      } catch (err) {
        if (handlePasswordError(err)) return;
      }
    };
    fetchPlayers();
  }, [slug, gameMode, status]);

  useEffect(() => {
    if (status !== "ready" || !p1 || !p2) {
      setData1(null);
      setData2(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const fetchBoth = async () => {
      try {
        const [r1, r2] = await Promise.all([
          base44.functions.invoke("getPlayerData", withAccessToken(slug, { slug, playerName: p1, range: "all", game_mode: gameMode })),
          base44.functions.invoke("getPlayerData", withAccessToken(slug, { slug, playerName: p2, range: "all", game_mode: gameMode }))
        ]);
        setData1(r1.data);
        setData2(r2.data);
      } catch (err) {
        if (handlePasswordError(err)) return;
        setData1(null);
        setData2(null);
        setError(err.response?.data?.error || "Failed to load player data");
      } finally {
        setLoading(false);
      }
    };
    fetchBoth();
  }, [slug, p1, p2, gameMode, status]);

  const heatmapStats = (heatmap) => {
    if (!heatmap || heatmap.length === 0) return { peakHour: null, peakDay: null, activeHours: 0, peakVal: 0 };
    let peakHour = 0, peakDay = 0, peakVal = 0, activeHours = 0;
    for (const a of heatmap) {
      if (a.total > peakVal) { peakVal = a.total; peakHour = a.hour; peakDay = a.day; }
      if (a.total > 0) activeHours++;
    }
    return { peakHour, peakDay, activeHours, peakVal };
  };

  const countWins = (stats) => {
    let p1Score = 0, p2Score = 0;
    for (const s of stats) {
      if (s.p1Val > s.p2Val) p1Score++;
      else if (s.p2Val > s.p1Val) p2Score++;
    }
    return { p1Score, p2Score };
  };

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

  return (
    <div className="min-h-screen bg-black text-white">
      <Background />
      <div className="relative z-10">
        <ServerHeader slug={slug} />
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
          <Link to={`/server/${slug}`} className="mb-5 flex items-center gap-2 text-sm text-gray-500 hover:text-white sm:mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to server
          </Link>

          <div className="mb-5 flex items-center justify-between sm:mb-6">
            <h1 className="flex items-center gap-2 text-lg font-black text-white">
              <Swords className="h-5 w-5 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 6px rgba(0,245,255,0.5))" }} />
              Compare Players
            </h1>
            <GameModeFilter value={gameMode} onChange={setGameMode} gameModes={serverGameModes} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <PlayerPicker label="Player 1" players={allPlayers} value={p1} onSelect={setP1} accent="#00F5FF" />
            <PlayerPicker label="Player 2" players={allPlayers} value={p2} onSelect={setP2} accent="#FF0055" />
          </div>

          {loading && (
            <div className="mt-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A1A24] border-t-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.3)]" />
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-[#FF0055]/30 bg-[#FF0055]/5 p-4 text-center">
              <p className="text-sm text-[#FF0055]">{error}</p>
            </div>
          )}

          {!loading && !error && data1 && data2 && (() => {
            const h1 = heatmapStats(data1.heatmap);
            const h2 = heatmapStats(data2.heatmap);
            const a1 = (data1.achievements || []).filter(a => a.unlocked);
            const a2 = (data2.achievements || []).filter(a => a.unlocked);
            const achTotal = (data1.achievements || []).length || 20;

            const allStats = [
              { label: 'Mined', p1Val: data1.player.mined, p2Val: data2.player.mined },
              { label: 'Placed', p1Val: data1.player.placed, p2Val: data2.player.placed },
              { label: 'Total', p1Val: data1.player.total, p2Val: data2.player.total },
              { label: 'Unique Blocks', p1Val: (data1.topMaterials || []).length, p2Val: (data2.topMaterials || []).length },
              { label: 'Rare Blocks', p1Val: (data1.rareBlocks || []).length, p2Val: (data2.rareBlocks || []).length },
              { label: 'Achievements', p1Val: a1.length, p2Val: a2.length },
              { label: 'Active Hours', p1Val: h1.activeHours, p2Val: h2.activeHours },
              { label: 'Peak Activity', p1Val: h1.peakVal, p2Val: h2.peakVal },
            ];
            const { p1Score, p2Score } = countWins(allStats);
            const tieCount = allStats.length - p1Score - p2Score;

            return (
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                {/* Player Cards + Win Tally */}
                <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[data1, data2].map((d, i) => (
                      <div key={i} className="flex flex-col items-center text-center">
                        <PlayerHead uuid={d.player.uuid} name={d.player.player_name} size={56} className="sm:!w-16 sm:!h-16" />
                        <p className="mt-2 text-sm font-bold text-white">{d.player.player_name}</p>
                        <p className="text-xs text-gray-500">Rank #{d.player.rank} / {d.player.totalPlayers}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-6 border-t border-[#1A1A24] pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#00F5FF]" style={{ textShadow: "0 0 10px rgba(0,245,255,0.3)" }}>{p1Score}</p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-600">Wins</p>
                    </div>
                    <span className="text-xs font-black text-gray-700">{tieCount > 0 ? `${tieCount} ties` : 'VS'}</span>
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#FF0055]" style={{ textShadow: "0 0 10px rgba(255,0,85,0.3)" }}>{p2Score}</p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-600">Wins</p>
                    </div>
                  </div>

                  {p1Score !== p2Score && (
                    <p className="mt-3 text-center text-xs font-bold text-gray-400">
                      🏆 <span style={{ color: p1Score > p2Score ? "#00F5FF" : "#FF0055" }}>{p1Score > p2Score ? data1.player.player_name : data2.player.player_name}</span> leads {Math.max(p1Score, p2Score)}–{Math.min(p1Score, p2Score)}
                    </p>
                  )}
                  {p1Score === p2Score && p1Score > 0 && (
                    <p className="mt-3 text-center text-xs font-bold text-gray-500">🤝 It's a dead heat!</p>
                  )}
                </div>

                {/* Core Stats */}
                <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                    <TrendingUp className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
                    Core Stats
                  </h2>
                  <div className="space-y-4">
                    <CompareStatBar label="Mined" p1Val={data1.player.mined} p2Val={data2.player.mined} />
                    <CompareStatBar label="Placed" p1Val={data1.player.placed} p2Val={data2.player.placed} />
                    <CompareStatBar label="Total" p1Val={data1.player.total} p2Val={data2.player.total} />
                  </div>
                </div>

                {/* Ratios & Percentages */}
                <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                    <Percent className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
                    Ratios & Breakdown
                  </h2>
                  <div className="space-y-4">
                    <CompareStatBar
                      label="Mining Focus %"
                      p1Val={data1.player.total > 0 ? Math.round((data1.player.mined / data1.player.total) * 100) : 0}
                      p2Val={data2.player.total > 0 ? Math.round((data2.player.mined / data2.player.total) * 100) : 0}
                      suffix="%"
                    />
                    <CompareStatBar
                      label="Building Focus %"
                      p1Val={data1.player.total > 0 ? Math.round((data1.player.placed / data1.player.total) * 100) : 0}
                      p2Val={data2.player.total > 0 ? Math.round((data2.player.placed / data2.player.total) * 100) : 0}
                      suffix="%"
                    />
                    {serverTotals && (
                      <CompareStatBar
                        label="Server Share %"
                        p1Val={serverTotals.combined > 0 ? +((data1.player.total / serverTotals.combined) * 100).toFixed(2) : 0}
                        p2Val={serverTotals.combined > 0 ? +((data2.player.total / serverTotals.combined) * 100).toFixed(2) : 0}
                        suffix="%"
                      />
                    )}
                    <CompareStatBar
                      label="Mined : Placed Ratio"
                      p1Val={data1.player.placed > 0 ? +(data1.player.mined / data1.player.placed).toFixed(2) : data1.player.mined}
                      p2Val={data2.player.placed > 0 ? +(data2.player.mined / data2.player.placed).toFixed(2) : data2.player.mined}
                      suffix="x"
                    />
                  </div>
                </div>

                {/* Diversity & Achievements */}
                <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                    <Layers className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
                    Diversity & Achievements
                  </h2>
                  <div className="space-y-4">
                    <CompareStatBar label="Unique Block Types" p1Val={(data1.topMaterials || []).length} p2Val={(data2.topMaterials || []).length} />
                    <CompareStatBar label="Rare Blocks Found" p1Val={(data1.rareBlocks || []).length} p2Val={(data2.rareBlocks || []).length} />
                    <CompareStatBar label="Achievements Unlocked" p1Val={a1.length} p2Val={a2.length} suffix={`/${achTotal}`} />
                    <CompareStatBar
                      label="Achievement Progress %"
                      p1Val={Math.round((a1.length / achTotal) * 100)}
                      p2Val={Math.round((a2.length / achTotal) * 100)}
                      suffix="%"
                    />
                  </div>
                </div>

                {/* Favorite Block */}
                <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                    <Zap className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
                    Favorite Block
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[data1, data2].map((d, i) => {
                      const fav = (d.topMaterials || [])[0];
                      return (
                        <div key={i} className="flex flex-col items-center gap-2 text-center">
                          {fav ? (
                            <>
                              <BlockIcon material={fav.material} size={40} />
                              <p className="text-xs font-bold text-white">{formatMaterial(fav.material)}</p>
                              <p className="text-[10px] text-gray-500">{formatNumber(fav.total)} blocks</p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-600">No data</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Blocks Side by Side */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {[data1, data2].map((d, i) => (
                    <div key={i} className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4">
                      <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-white">⛏ Top Blocks</h3>
                      <TopBlocksChart materials={d.topMaterials} />
                    </div>
                  ))}
                </div>

                {/* Rare Blocks Side by Side */}
                {((data1.rareBlocks && data1.rareBlocks.length > 0) || (data2.rareBlocks && data2.rareBlocks.length > 0)) && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[data1, data2].map((d, i) => (
                      <div key={i} className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4">
                        <h3 className="mb-3 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white">
                          <Gem className="h-3.5 w-3.5" style={{ color: ACCENTS[i] }} /> Rare Blocks
                        </h3>
                        {(d.rareBlocks || []).length === 0 ? (
                          <p className="py-4 text-center text-xs text-gray-600">No rare blocks yet</p>
                        ) : (
                          <div className="space-y-1.5">
                            {(d.rareBlocks || []).map((rb, j) => (
                              <div key={j} className="flex items-center gap-2 rounded-lg px-1 py-1">
                                <BlockIcon material={rb.material} size={20} />
                                <span className="flex-1 truncate text-xs text-gray-300">{formatMaterial(rb.material)}</span>
                                <span className="text-xs tabular-nums text-white">{formatNumber(rb.total)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Activity Heatmap Comparison */}
                <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                    <Activity className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
                    Activity Patterns
                  </h2>
                  <div className="space-y-6">
                    {[data1, data2].map((d, i) => {
                      const h = i === 0 ? h1 : h2;
                      return (
                        <div key={i}>
                          <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                            <span className="font-bold" style={{ color: ACCENTS[i] }}>{d.player.player_name}</span>
                            {h.peakVal > 0 && (
                              <span className="text-gray-500">
                                Peak: <span className="text-gray-300">{DAYS[h.peakDay]} {String(h.peakHour).padStart(2, '0')}:00</span> ({formatNumber(h.peakVal)})
                              </span>
                            )}
                            <span className="text-gray-500">Active: <span className="text-gray-300">{h.activeHours}h</span></span>
                          </div>
                          <ActivityHeatmap activity={d.heatmap} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Achievements Side by Side */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {[data1, data2].map((d, i) => {
                    const unlocked = (d.achievements || []).filter(a => a.unlocked);
                    const pct = Math.round((unlocked.length / achTotal) * 100);
                    return (
                      <div key={i} className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white">
                            <Trophy className="h-3.5 w-3.5" style={{ color: ACCENTS[i] }} /> Achievements
                          </h3>
                          <span className="text-xs font-black" style={{ color: ACCENTS[i] }}>{unlocked.length}/{achTotal}</span>
                        </div>
                        <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#111118]">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: ACCENTS[i],
                              boxShadow: `0 0 8px ${ACCENTS[i]}80`
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
                          {(d.achievements || []).map((ach, j) => (
                            <div
                              key={j}
                              className={`flex flex-col items-center rounded-lg border p-1.5 text-center transition-all ${ach.unlocked ? 'border-[#2A2A3A] bg-[#0F0F18]' : 'border-[#1A1A24] opacity-30'}`}
                              title={`${ach.name} — ${ach.desc}`}
                            >
                              <span className="text-lg leading-none">{ach.icon}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {!loading && !error && (!data1 || !data2) && (
            <div className="mt-6 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-6 text-center sm:mt-8 sm:p-8">
              <p className="text-sm text-gray-600">Select two players to compare their stats.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}