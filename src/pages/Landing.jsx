import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlitchLogo from "@/components/GlitchLogo";
import LanguageToggle from "@/components/LanguageToggle";
import { useT } from "@/lib/i18n";
import { base44 } from "@/api/base44Client";
import { formatNumber } from "@/lib/format";
import { BarChart3, Users, Search, Swords, Trophy, Clock, Download, ArrowRight, ChevronRight, Globe, Gem, TrendingUp, Boxes, CalendarRange } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import ImageCarousel from "@/components/ImageCarousel";

export default function Landing() {
  const t = useT();
  const [totalBlocks, setTotalBlocks] = useState(null);

  useEffect(() => {
    const CACHE_KEY = "globalStats_cache";
    const CACHE_TTL = 3 * 60 * 60 * 1000;

    const load = async () => {
      // Try cache first (reuse the global stats cache)
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.cachedAt < CACHE_TTL) {
            setTotalBlocks(parsed.data.totals.combined);
            return;
          }
        }
      } catch { /* ignore */ }

      // Fetch fresh — don't require unlock, the function is public
      try {
        const res = await base44.functions.invoke("getGlobalStats", {});
        setTotalBlocks(res.data.totals.combined);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: res.data, cachedAt: Date.now() }));
      } catch { /* silent fail — keep null */ }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background grid + glow (static gradients — no blur for mobile perf) */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ contain: 'strict' }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)' }} />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,0,85,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <GlitchLogo size="sm" />
        <div className="flex items-center gap-6">
          <a href="#features" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("landing.nav.features")}</a>
          <a href="#how" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("landing.nav.howItWorks")}</a>
          <div className="flex items-center gap-3">
            <LanguageToggle compact />
            <Link to="/global-stats" className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-4 py-2 text-xs font-bold text-gray-400 transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF]">
              <Globe className="h-3.5 w-3.5" /> {t("landing.nav.globalStats")}
            </Link>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/5 px-4 py-2 text-xs font-bold text-[#00F5FF] transition-all hover:bg-[#00F5FF]/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.15)]">
              <Download className="h-3.5 w-3.5" /> {t("landing.nav.plugin")} <span className="text-[#00F5FF]/50">{t("landing.nav.soon")}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-20 pb-24 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#1A1A24] bg-[#0A0A0F] px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
          <span className="text-[11px] font-medium text-gray-500">{t("landing.hero.badge")}</span>
        </div>

        <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
          {t("landing.hero.title1")}
          <br />
          <span className="bg-gradient-to-r from-[#00F5FF] to-[#FF0055] bg-clip-text text-transparent">{t("landing.hero.title2")}</span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-gray-500 md:text-lg">
          {t("landing.hero.desc")}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button className="group inline-flex items-center gap-2 rounded-lg bg-[#00F5FF] px-6 py-3 text-sm font-black text-black transition-all hover:shadow-[0_0_25px_rgba(0,245,255,0.4)]">
            <Download className="h-4 w-4" /> {t("landing.hero.getPlugin")}
            <span className="ml-1 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold">SOON</span>
          </button>
          <a href="#how" className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-6 py-3 text-sm font-bold text-gray-400 transition-all hover:border-[#2A2A3A] hover:text-white">
            {t("landing.hero.howItWorks")} <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-6">
          <ShareButtons url={typeof window !== "undefined" ? window.location.origin : ""} title="404Stats — Track every block. See every stat." />
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-16">
        <div className="grid grid-cols-3 gap-4 rounded-2xl border border-[#1A1A24] bg-[#0A0A0F] p-6 md:gap-8 md:p-8">
          {[
            { value: totalBlocks != null ? formatNumber(totalBlocks) : "…", label: t("landing.stats.blocksTracked") },
            { value: "24/7", label: t("landing.stats.liveData") },
            { value: "$0", label: t("landing.stats.setupCost") },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-black text-white md:text-4xl" style={{ textShadow: i === 0 ? "0 0 20px rgba(0,245,255,0.2)" : undefined }}>{s.value}</p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-gray-600 md:text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Screenshot Carousel */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-16">
        <ImageCarousel />
      </div>

      {/* Features */}
      <div id="features" className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">{t("landing.features.title")}</h2>
          <p className="mt-2 text-sm text-gray-500">{t("landing.features.desc")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={BarChart3} title={t("landing.features.liveDashboard")} desc={t("landing.features.liveDashboardDesc")} accent="cyan" />
          <Feature icon={Users} title={t("landing.features.leaderboards")} desc={t("landing.features.leaderboardsDesc")} accent="pink" />
          <Feature icon={Search} title={t("landing.features.playerProfiles")} desc={t("landing.features.playerProfilesDesc")} accent="cyan" />
          <Feature icon={Swords} title={t("landing.features.playerCompare")} desc={t("landing.features.playerCompareDesc")} accent="pink" />
          <Feature icon={Trophy} title={t("landing.features.achievements")} desc={t("landing.features.achievementsDesc")} accent="cyan" />
          <Feature icon={Clock} title={t("landing.features.heatmap")} desc={t("landing.features.heatmapDesc")} accent="pink" />
          <Feature icon={Boxes} title={t("landing.features.blockIndex")} desc={t("landing.features.blockIndexDesc")} accent="cyan" />
          <Feature icon={TrendingUp} title={t("landing.features.serverTrends")} desc={t("landing.features.serverTrendsDesc")} accent="pink" />
          <Feature icon={Gem} title={t("landing.features.rareBlocks")} desc={t("landing.features.rareBlocksDesc")} accent="cyan" />
          <Feature icon={CalendarRange} title={t("landing.features.timeRange")} desc={t("landing.features.timeRangeDesc")} accent="pink" />
          <Feature icon={Globe} title={t("landing.features.globalStats")} desc={t("landing.features.globalStatsDesc")} accent="cyan" />
          <Feature icon={Download} title={t("landing.features.zeroSetup")} desc={t("landing.features.zeroSetupDesc")} accent="pink" />
        </div>
      </div>

      {/* How it works */}
      <div id="how" className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">{t("landing.how.title")}</h2>
          <p className="mt-2 text-sm text-gray-500">{t("landing.how.desc")}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Step number="01" title={t("landing.how.step1Title")} desc={t("landing.how.step1Desc")} />
          <Step number="02" title={t("landing.how.step2Title")} desc={t("landing.how.step2Desc")} />
          <Step number="03" title={t("landing.how.step3Title")} desc={t("landing.how.step3Desc")} />
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20">
        <div className="relative overflow-hidden rounded-2xl border border-[#1A1A24] bg-[#0A0A0F] p-10 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[200px] w-[400px] -translate-x-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)' }} />
          <h2 className="relative text-3xl font-black tracking-tight md:text-4xl">{t("landing.cta.title")}</h2>
          <p className="relative mt-3 text-sm text-gray-500">{t("landing.cta.desc")}</p>
          <button className="relative mt-8 inline-flex items-center gap-2 rounded-lg bg-[#00F5FF] px-6 py-3 text-sm font-black text-black transition-all hover:shadow-[0_0_25px_rgba(0,245,255,0.4)]">
            <Download className="h-4 w-4" /> {t("landing.cta.button")}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1A1A24] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <GlitchLogo size="sm" />
            <span className="text-xs text-gray-600">{t("landing.footer.desc")}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-xs text-gray-600 transition-colors hover:text-[#00F5FF]">{t("landing.footer.terms")}</Link>
            <Link to="/privacy" className="text-xs text-gray-600 transition-colors hover:text-[#00F5FF]">{t("landing.footer.privacy")}</Link>
            <p className="text-xs text-gray-600">© 2026 404GameNotFound</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="group relative rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-6 transition-all hover:border-[#00F5FF]/30 hover:shadow-[0_0_20px_rgba(0,245,255,0.06)]">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-black text-[#1A1A24] transition-colors group-hover:text-[#00F5FF]/30">{number}</span>
        <ChevronRight className="h-4 w-4 text-gray-700" />
      </div>
      <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">{desc}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, desc, accent = "cyan" }) {
  const color = accent === "cyan" ? "#00F5FF" : "#FF0055";
  return (
    <div className="group rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-6 transition-all hover:border-[#2A2A3A]">
      <div className="inline-flex rounded-lg border border-[#1A1A24] p-2.5" style={{ boxShadow: `0 0 15px ${color}10` }}>
        <Icon className="h-5 w-5" style={{ color, filter: `drop-shadow(0 0 4px ${color}80)` }} />
      </div>
      <h3 className="mt-4 text-sm font-bold text-white">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">{desc}</p>
    </div>
  );
}