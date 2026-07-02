import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { withAccessToken } from "@/lib/serverAuth";
import { formatNumber } from "@/lib/format";

export default function ServerAchievements({ slug, gameMode = "SURVIVAL", accessToken }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken === false) return;
    const fetch = async () => {
      try {
        const res = await base44.functions.invoke("getServerAchievements", withAccessToken(slug, { slug, game_mode: gameMode }));
        setData(res.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug, gameMode, accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1A1A24] border-t-[#00F5FF]" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
          <Trophy className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
          Server Achievements
        </h2>
        <span className="text-xs text-gray-500">
          {data.unlockedCount} / {data.totalCount}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        {data.achievements.map((a) => (
          <div
            key={a.id}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
              a.unlocked
                ? "border-[#00F5FF]/30 bg-[#00F5FF]/5 shadow-[0_0_8px_rgba(0,245,255,0.05)]"
                : "border-[#1A1A24] bg-[#08080E]"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center text-xl ${
                a.unlocked ? "" : "opacity-30 grayscale"
              }`}
            >
              {a.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={`truncate text-xs font-bold ${a.unlocked ? "text-white" : "text-gray-500"}`}>
                  {a.name}
                </p>
                <span className={`shrink-0 text-[10px] tabular-nums ${a.unlocked ? "text-[#00F5FF]" : "text-gray-600"}`}>
                  {a.unlocked ? "✓" : `${formatNumber(a.current)}/${formatNumber(a.threshold)}`}
                </span>
              </div>
              <p className="truncate text-[10px] text-gray-600">{a.desc}</p>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#111118]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    a.unlocked
                      ? "bg-[#00F5FF]"
                      : "bg-gradient-to-r from-[#00F5FF]/40 to-[#FF0055]/40"
                  }`}
                  style={{ width: `${a.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}