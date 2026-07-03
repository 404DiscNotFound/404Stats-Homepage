import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Folder, Users, Boxes, TrendingUp, Crown, Gem } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Background from "@/components/Background";
import ServerHeader from "@/components/ServerHeader";
import StatCard from "@/components/StatCard";
import PasswordPrompt from "@/components/PasswordPrompt";
import { useServerPassword } from "@/hooks/useServerPassword";
import { withAccessToken } from "@/lib/serverAuth";
import { formatNumber, formatMaterial, timeAgo } from "@/lib/format";
import { useT } from "@/lib/i18n";

export default function Projects() {
  const t = useT();
  const { slug } = useParams();
  const { status, verifyPassword, handlePasswordError } = useServerPassword(slug);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status !== "ready") return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await base44.functions.invoke("getProjectList", withAccessToken(slug, { slug }));
        setData(res.data);
      } catch (err) {
        if (handlePasswordError(err)) return;
        setError(err.response?.data?.error || t("common.serverNotFound"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, status]);

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

  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
        <Background />
        <div className="relative z-10">
          <p className="text-6xl font-black text-white">404</p>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <Link to={`/server/${slug}`} className="mt-6 text-sm text-[#00F5FF] hover:underline">{t("common.backToServer")}</Link>
        </div>
      </div>
    );
  }

  const projects = data?.projects || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Background />
      <div className="relative z-10">
        <ServerHeader slug={slug} displayName={data?.server?.display_name} />

        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
          <div className="mb-6 flex items-center gap-3">
            <Folder className="h-6 w-6 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 6px rgba(0,245,255,0.5))" }} />
            <div>
              <h1 className="text-xl font-black text-white sm:text-2xl">{t("projects.title")}</h1>
              <p className="text-xs text-gray-500 sm:text-sm">{t("projects.subtitle")}</p>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-8 text-center">
              <Folder className="mx-auto h-10 w-10 text-gray-700" />
              <p className="mt-3 text-sm text-gray-500">{t("projects.empty")}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Link
                  key={i}
                  to={`/server/${slug}/project/${p.project_slug}`}
                  className="group rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-5 transition-all hover:border-[#00F5FF]/30 hover:shadow-[0_0_20px_rgba(0,245,255,0.1)]"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg" style={{ filter: "drop-shadow(0 0 6px rgba(0,245,255,0.3))" }}>🏗️</span>
                      <h2 className="text-sm font-black text-white group-hover:text-[#00F5FF]">{p.project_name}</h2>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] uppercase text-gray-600">{t("projects.totalBlocks")}</p>
                      <p className="text-sm font-bold text-white">{formatNumber(p.total)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-600">{t("projects.mined")}</p>
                      <p className="text-sm font-bold text-[#00F5FF]/70">{formatNumber(p.mined)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-600">{t("projects.placed")}</p>
                      <p className="text-sm font-bold text-[#FF0055]/70">{formatNumber(p.placed)}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-[#1A1A24] pt-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-gray-500"><Users className="h-3 w-3" /> {t("projects.members")}</span>
                      <span className="font-bold text-white">{p.members}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-gray-500"><TrendingUp className="h-3 w-3" /> {t("projects.netBuildGain")}</span>
                      <span className="font-bold text-[#00F5FF]">{p.net_build_gain >= 0 ? "+" : ""}{formatNumber(p.net_build_gain)}</span>
                    </div>
                    {p.top_contributor && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-gray-500"><Crown className="h-3 w-3" /> {t("projects.topContributor")}</span>
                        <span className="truncate font-bold text-white">{p.top_contributor}</span>
                      </div>
                    )}
                    {p.top_block && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-gray-500"><Gem className="h-3 w-3" /> {t("projects.topBlock")}</span>
                        <span className="truncate font-bold text-white">{formatMaterial(p.top_block)}</span>
                      </div>
                    )}
                    {p.last_activity_at && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{t("projects.lastActivity")}</span>
                        <span className="text-gray-400">{timeAgo(p.last_activity_at)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6">
            <Link to={`/server/${slug}`} className="text-sm text-[#00F5FF] hover:underline">{t("common.backToServer")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}