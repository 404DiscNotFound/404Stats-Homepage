import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Folder, Crown, Gem, Users, TrendingUp, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Background from "@/components/Background";
import ServerHeader from "@/components/ServerHeader";
import StatCard from "@/components/StatCard";
import TopBlocksChart from "@/components/TopBlocksChart";
import ServerDonuts from "@/components/ServerDonuts";
import ServerTrends from "@/components/ServerTrends";
import FunFacts from "@/components/FunFacts";
import GameModeFilter from "@/components/GameModeFilter";
import PlayerHead from "@/components/PlayerHead";
import PasswordPrompt from "@/components/PasswordPrompt";
import { useServerPassword } from "@/hooks/useServerPassword";
import { withAccessToken } from "@/lib/serverAuth";
import { formatNumber, formatMaterial, timeAgo } from "@/lib/format";
import { useT } from "@/lib/i18n";

const TIME_RANGES = ["day", "week", "month", "year", "all"];

export default function ProjectDetail() {
  const t = useT();
  const { slug, projectSlug } = useParams();
  const { status, verifyPassword, handlePasswordError } = useServerPassword(slug);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameMode, setGameMode] = useState("SURVIVAL");
  const [worldName, setWorldName] = useState("ALL");
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    if (status !== "ready") return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await base44.functions.invoke("getProjectData", withAccessToken(slug, {
          slug, project_slug: projectSlug, game_mode: gameMode, world_name: worldName, time_range: timeRange
        }));
        setData(res.data);
      } catch (err) {
        if (handlePasswordError(err)) return;
        setError(err.response?.data?.error || t("projects.projectNotFound"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, projectSlug, gameMode, worldName, timeRange, status]);

  if (status === "checking" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A1A24] border-t-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.3)]" />
      </div>
    );
  }

  if (status === "needsPassword") {
    return <PasswordPrompt onSubmit={verifyPassword} />;
  }

  if (error || !data) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
        <Background />
        <div className="relative z-10">
          <p className="text-6xl font-black text-white">404</p>
          <p className="mt-2 text-sm text-gray-500">{error || t("projects.projectNotFound")}</p>
          <Link to={`/server/${slug}/projects`} className="mt-6 text-sm text-[#00F5FF] hover:underline">{t("projects.backToProjects")}</Link>
        </div>
      </div>
    );
  }

  const p = data.project;

  return (
    <div className="min-h-screen bg-black text-white">
      <Background />
      <div className="relative z-10">
        <ServerHeader slug={slug} displayName={p.server_name} />

        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
          {/* Project Title */}
          <div className="mb-6">
            <Link to={`/server/${slug}/projects`} className="text-xs text-gray-500 hover:text-[#00F5FF]">{t("projects.backToProjects")}</Link>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl" style={{ filter: "drop-shadow(0 0 8px rgba(0,245,255,0.4))" }}>🏗️</span>
              <div>
                <h1 className="text-xl font-black text-white sm:text-2xl">{p.project_name}</h1>
                {p.created_by_name && (
                  <p className="text-xs text-gray-500">{t("projects.createdBy")} {p.created_by_name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <GameModeFilter value={gameMode} onChange={setGameMode} gameModes={data.gameModes} />
              {data.worldNames && data.worldNames.length > 1 && (
                <select
                  value={worldName}
                  onChange={(e) => setWorldName(e.target.value)}
                  className="rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-3 py-2 text-xs font-bold text-gray-400 transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF]"
                >
                  <option value="ALL">{t("projects.allWorlds")}</option>
                  {data.worldNames.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              )}
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] p-1">
              {TIME_RANGES.map(tr => (
                <button
                  key={tr}
                  onClick={() => setTimeRange(tr)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                    timeRange === tr
                      ? "bg-[#00F5FF]/15 text-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.15)]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {t("projects.timeRange." + tr)}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            <StatCard label={t("projects.totalBlocks")} value={formatNumber(p.total)} accent="cyan" />
            <StatCard label={t("projects.netBuildGain")} value={(p.net_build_gain >= 0 ? "+" : "") + formatNumber(p.net_build_gain)} accent="pink" />
            <StatCard label={t("projects.members")} value={p.members} accent="cyan" />
          </div>

          {/* No data state */}
          {p.total === 0 ? (
            <div className="mt-6 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-8 text-center">
              <Folder className="mx-auto h-10 w-10 text-gray-700" />
              <p className="mt-3 text-sm text-gray-500">{t("projects.noProjectData")}</p>
            </div>
          ) : (
            <>
              {/* Top Contributor + Top Block */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:mt-6">
                {p.top_contributor && (
                  <div className="rounded-xl border border-[#00F5FF]/20 bg-[#0A0A0F] p-4 sm:p-6">
                    <h2 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                      <Crown className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
                      {t("projects.topContributor")}
                    </h2>
                    <div className="flex items-center gap-3">
                      <PlayerHead uuid={data.contributors?.[0]?.uuid} size={48} />
                      <div>
                        <p className="font-bold text-white">{p.top_contributor}</p>
                        <p className="text-xs text-gray-500">{formatNumber(data.contributors?.[0]?.total || 0)} {t("common.total")}</p>
                      </div>
                    </div>
                  </div>
                )}
                {p.top_block && (
                  <div className="rounded-xl border border-[#FF0055]/20 bg-[#0A0A0F] p-4 sm:p-6">
                    <h2 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                      <Gem className="h-4 w-4 text-[#FF0055]" style={{ filter: "drop-shadow(0 0 4px rgba(255,0,85,0.5))" }} />
                      {t("projects.topBlock")}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🧱</span>
                      <div>
                        <p className="font-bold text-white">{formatMaterial(p.top_block)}</p>
                        <p className="text-xs text-gray-500">{formatNumber(data.topMaterials?.[0]?.total || 0)} {t("common.total")}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Donut Charts */}
              <div className="mt-4 sm:mt-6">
                <ServerDonuts materialCategories={data.materialCategories} worldDistribution={data.worldDistribution} mode="server" />
              </div>

              {/* Fun Facts */}
              {data.facts && data.facts.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <FunFacts facts={data.facts} />
                </div>
              )}

              {/* Top Blocks */}
              <div className="mt-4 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:mt-6 sm:p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
                  <Gem className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
                  {t("projects.topBlocks")}
                </h2>
                <TopBlocksChart materials={data.topMaterials} mode="server" />
              </div>

              {/* Contributors Leaderboard */}
              <div className="mt-4 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:mt-6 sm:p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
                  <Users className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
                  {t("projects.contributors")}
                </h2>
                <div className="space-y-2">
                  {data.contributors.map((c, i) => (
                    <div key={c.uuid} className="flex items-center gap-3 rounded-lg px-1 py-1.5 hover:bg-[#0F0F18]">
                      <span className="w-5 text-center text-xs font-bold text-gray-600">{i + 1}</span>
                      <PlayerHead uuid={c.uuid} size={28} />
                      <Link to={`/server/${slug}/player/${c.player_name}`} className="flex-1 truncate text-sm text-white hover:text-[#00F5FF]">
                        {c.player_name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs tabular-nums">
                        <span className="text-[#00F5FF]/70">{formatNumber(c.mined)}</span>
                        <span className="text-gray-700">/</span>
                        <span className="text-[#FF0055]/70">{formatNumber(c.placed)}</span>
                        <span className="ml-1 font-bold text-white">{formatNumber(c.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              {data.timeline && data.timeline.length > 0 && (
                <div className="mt-4 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:mt-6 sm:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
                      <TrendingUp className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
                      {t("projects.timeline")}
                    </h2>
                    <div className="flex gap-3 text-[10px] text-gray-600 sm:gap-4 sm:text-xs">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.5)]" />{t("common.mined")}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#FF0055] shadow-[0_0_6px_rgba(255,0,85,0.5)]" />{t("common.placed")}
                      </span>
                    </div>
                  </div>
                  <ServerTrends trends={data.timeline} />
                </div>
              )}

              {/* Achievements */}
              {data.achievements && data.achievements.length > 0 && (
                <div className="mt-4 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:mt-6 sm:p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
                    🏆 {t("projects.achievements")}
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {data.achievements.map(a => (
                      <div
                        key={a.id}
                        className={`flex items-center gap-3 rounded-lg border p-3 ${
                          a.unlocked
                            ? "border-[#00F5FF]/20 bg-[#00F5FF]/5"
                            : "border-[#1A1A24] bg-[#0A0A0F] opacity-50"
                        }`}
                      >
                        <span className="text-2xl" style={{ filter: a.unlocked ? "grayscale(0)" : "grayscale(1)" }}>{a.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white">{a.name}</p>
                          <p className="text-[10px] text-gray-500">{a.description}</p>
                          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#111118]">
                            <div
                              className={a.unlocked ? "bg-[#00F5FF]" : "bg-gray-700"}
                              style={{ width: `${a.progress}%`, boxShadow: a.unlocked ? "0 0 4px rgba(0,245,255,0.4)" : "none" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between text-xs text-gray-600">
            <Link to={`/server/${slug}/projects`} className="hover:text-[#00F5FF]">{t("projects.backToProjects")}</Link>
            {p.last_activity_at && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {t("projects.lastActivity")}: {timeAgo(p.last_activity_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}