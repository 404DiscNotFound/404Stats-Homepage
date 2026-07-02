import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Globe, Lock, RefreshCw, Server, Users, Pickaxe, Gem, Boxes, Trophy, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Background from "@/components/Background";
import GlitchLogo from "@/components/GlitchLogo";
import BlockIcon from "@/components/BlockIcon";
import { formatNumber, formatMaterial } from "@/lib/format";
import { useT } from "@/lib/i18n";

const SECRET = "Pelle";
const CACHE_KEY = "globalStats_cache";
const CACHE_TTL = 3 * 60 * 60 * 1000; // 3 hours

export default function GlobalStats() {
  const t = useT();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem("globalStats_unlocked") === "1");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cacheAge, setCacheAge] = useState(null);

  const fetchData = useCallback(async (force = false) => {
    // Check cache first (unless forced)
    if (!force) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const age = Date.now() - parsed.cachedAt;
          if (age < CACHE_TTL) {
            setData(parsed.data);
            setCacheAge(age);
            setLoading(false);
            return;
          }
        }
      } catch { /* ignore */ }
    }

    setLoading(true);
    try {
      const res = await base44.functions.invoke("getGlobalStats", {});
      const payload = { data: res.data, cachedAt: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      setData(res.data);
      setCacheAge(0);
    } catch (err) {
      setError(err.response?.data?.error || t("global.failedLoad"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load cached data on unlock
  useEffect(() => {
    if (unlocked) fetchData();
  }, [unlocked, fetchData]);

  // Secret gate
  if (!unlocked) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
        <Background />
        <div className="relative z-10 w-full max-w-sm">
          <div className="mb-6 flex justify-center">
            <GlitchLogo size="sm" />
          </div>
          <div className="mb-4 inline-flex rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4">
            <Lock className="h-8 w-8 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 8px rgba(0,245,255,0.4))" }} />
          </div>
          <h1 className="text-2xl font-black text-white">{t("global.restrictedArea")}</h1>
          <p className="mt-1 text-xs text-gray-500">{t("global.accessCodeRequired")}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() === SECRET) {
                sessionStorage.setItem("globalStats_unlocked", "1");
                setUnlocked(true);
                setError("");
              } else {
                setError(t("global.wrongCode"));
              }
            }}
            className="mt-6 space-y-3"
          >
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("global.enterAccessCode")}
              autoFocus
              className="w-full rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-4 py-3 text-center text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#00F5FF]/40 focus:shadow-[0_0_15px_rgba(0,245,255,0.1)]"
            />
            {error && <p className="text-xs text-[#FF0055]">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#00F5FF] px-4 py-3 text-sm font-black text-black transition-all hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]"
            >
              {t("global.unlock")}
            </button>
          </form>
          <Link to="/" className="mt-6 inline-block text-xs text-gray-600 hover:text-white">
            {t("common.backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A1A24] border-t-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.3)]" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
        <Background />
        <div className="relative z-10">
          <p className="text-6xl font-black text-white">500</p>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button onClick={() => fetchData(true)} className="mt-6 text-sm text-[#00F5FF] hover:underline">{t("global.tryAgain")}</button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totals = data.totals;
  const f = data.funStats;
  const cacheMinutes = cacheAge != null ? Math.floor(cacheAge / 60000) : null;
  const cacheText = cacheMinutes != null
    ? cacheMinutes < 1 ? t("global.justNow") : `${cacheMinutes}${t("global.mAgo")}`
    : "";

  return (
    <div className="min-h-screen bg-black text-white">
      <Background />
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-[#1A1A24] bg-black/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3.5">
            <Link to="/" className="flex items-center gap-2.5">
              <GlitchLogo size="sm" />
              <div>
                <p className="text-sm font-bold text-white">{t("global.title")}</p>
                <p className="hidden text-xs text-gray-600 sm:block">{t("global.subtitle")}</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {cacheText && (
                <span className="hidden text-xs text-gray-600 sm:inline">{t("global.updated")} {cacheText}</span>
              )}
              <button
                onClick={() => fetchData(true)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-3 py-2 text-xs font-bold text-gray-400 transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF] disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">{t("global.refresh")}</span>
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-3 py-2 text-xs font-bold text-gray-400 transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF]"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("global.home")}</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
          {/* Hero stat grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <BigStat icon={Server} label={t("global.servers")} value={formatNumber(totals.servers)} accent="cyan" />
            <BigStat icon={Users} label={t("global.players")} value={formatNumber(totals.players)} accent="pink" />
            <BigStat icon={Pickaxe} label={t("global.blocksMined")} value={formatNumber(totals.mined)} accent="cyan" />
            <BigStat icon={Boxes} label={t("global.blocksPlaced")} value={formatNumber(totals.placed)} accent="pink" />
          </div>

          {/* Combined total banner */}
          <div className="mt-3 overflow-hidden rounded-xl border border-[#1A1A24] bg-gradient-to-r from-[#0A0A0F] via-[#0F0A12] to-[#0A0A0F] p-5 sm:mt-4 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-600">{t("global.totalInteractions")}</p>
                <p className="mt-1 text-3xl font-black text-white sm:text-5xl" style={{ textShadow: "0 0 30px rgba(0,245,255,0.15)" }}>
                  {formatNumber(totals.combined)}
                </p>
              </div>
              <Zap className="h-10 w-10 text-[#00F5FF] sm:h-14 sm:w-14" style={{ filter: "drop-shadow(0 0 12px rgba(0,245,255,0.4))" }} />
            </div>
          </div>

          {/* Fun stats */}
          <div className="mt-4 sm:mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
              <Trophy className="h-4 w-4 text-[#FF0055]" style={{ filter: "drop-shadow(0 0 4px rgba(255,0,85,0.5))" }} />
              {t("global.funStats")}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <FunCard icon="⛏" label={t("global.avgPerPlayer")} value={formatNumber(f.avgBlocksPerPlayer)} sub={t("global.acrossAllServers")} />
              <FunCard icon="📊" label={t("global.avgPerServer")} value={formatNumber(f.avgBlocksPerServer)} sub={t("global.serverAverage")} />
              <FunCard icon="🎨" label={t("global.uniqueBlockTypes")} value={formatNumber(totals.uniqueMaterials)} sub={t("global.materialsTracked")} />
              <FunCard icon="💎" label={t("global.diamondsMined")} value={formatNumber(f.diamondsMined)} sub={t("global.oreBlocksTotal")} accent="cyan" />
              <FunCard icon="💚" label={t("global.emeraldsMined")} value={formatNumber(f.emeraldsMined)} sub={t("global.oreBlocksTotal")} />
              <FunCard icon="🟡" label={t("global.goldMined")} value={formatNumber(f.goldMined)} sub={t("global.oreBlocksTotal")} />
              {f.ancientDebrisMined > 0 && (
                <FunCard icon="🔥" label={t("global.ancientDebris")} value={formatNumber(f.ancientDebrisMined)} sub={t("global.netheriteReady")} accent="pink" />
              )}
              {f.mostMinedBlock && (
                <FunCard icon="📉" label={t("global.mostMinedBlock")} value={formatMaterial(f.mostMinedBlock.material)} sub={`${formatNumber(f.mostMinedBlock.count)} ${t("global.times")}`} />
              )}
              {f.mostPlacedBlock && (
                <FunCard icon="📈" label={t("global.mostPlacedBlock")} value={formatMaterial(f.mostPlacedBlock.material)} sub={`${formatNumber(f.mostPlacedBlock.count)} ${t("global.times")}`} />
              )}
            </div>
          </div>

          {/* Top 10 Blocks */}
          <div className="mt-4 sm:mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
              <Gem className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
              {t("global.top10Blocks")}
            </h2>
            <div className="space-y-1.5">
              {data.topBlocks.map((m, i) => {
                const maxTotal = data.topBlocks[0]?.total || 1;
                const minedPct = (m.mined / maxTotal) * 100;
                const placedPct = (m.placed / maxTotal) * 100;
                return (
                  <div key={i} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#0F0F18] sm:gap-3 sm:px-3 sm:py-2">
                    <span className="w-5 shrink-0 text-right text-[10px] font-bold text-gray-700 sm:w-8 sm:text-xs">{i + 1}</span>
                    <BlockIcon material={m.material} size={20} className="sm:!w-6 sm:!h-6" />
                    <span className="w-20 shrink-0 truncate text-xs text-gray-300 group-hover:text-white sm:w-40 sm:text-sm">
                      {formatMaterial(m.material)}
                    </span>
                    <div className="flex h-5 min-w-[40px] flex-1 overflow-hidden rounded bg-[#111118] sm:h-6">
                      <div className="bg-[#00F5FF]/70 transition-all duration-500" style={{ width: `${minedPct}%`, boxShadow: "0 0 6px rgba(0,245,255,0.3)" }} />
                      <div className="bg-[#FF0055]/70 transition-all duration-500" style={{ width: `${placedPct}%`, boxShadow: "0 0 6px rgba(255,0,85,0.3)" }} />
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 text-xs tabular-nums sm:gap-2 sm:text-sm">
                      <span className="text-[#00F5FF]/70">{formatNumber(m.mined)}</span>
                      <span className="text-gray-700">/</span>
                      <span className="text-[#FF0055]/70">{formatNumber(m.placed)}</span>
                      <span className="ml-0.5 font-bold text-white sm:ml-1">{formatNumber(m.total)}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-[#1A1A24] pt-4 text-xs text-gray-600">
            <span>{t("global.autoRefresh")}</span>
            {cacheText && <span>{t("global.lastUpdate")} {cacheText}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function BigStat({ icon: Icon, label, value, accent = "cyan" }) {
  const color = accent === "cyan" ? "#00F5FF" : "#FF0055";
  return (
    <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 transition-all hover:border-[#2A2A3A]">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color, filter: `drop-shadow(0 0 4px ${color}80)` }} />
        <p className="text-[10px] uppercase tracking-widest text-gray-600 sm:text-xs">{label}</p>
      </div>
      <p className="mt-2 text-xl font-black text-white sm:text-3xl" style={{ textShadow: `0 0 20px ${color}15` }}>
        {value}
      </p>
    </div>
  );
}

function FunCard({ icon, label, value, sub, accent = "default" }) {
  const textColor = accent === "cyan" ? "text-[#00F5FF]" : accent === "pink" ? "text-[#FF0055]" : "text-white";
  return (
    <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 transition-all hover:border-[#2A2A3A]">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-gray-600">{label}</p>
          <p className={`mt-1 truncate text-lg font-black ${textColor} sm:text-xl`}>{value}</p>
          {sub && <p className="mt-0.5 text-[10px] text-gray-600">{sub}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}