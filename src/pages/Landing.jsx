import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlitchLogo from "@/components/GlitchLogo";
import { base44 } from "@/api/base44Client";
import { formatNumber } from "@/lib/format";
import { BarChart3, Users, Search, Swords, Trophy, Clock, Download, ArrowRight, ChevronRight, Globe, Gem, TrendingUp, Boxes, CalendarRange } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import ImageCarousel from "@/components/ImageCarousel";

export default function Landing() {
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
          <a href="#features" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">Features</a>
          <a href="#how" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">How it works</a>
          <div className="flex items-center gap-3">
            <Link to="/global-stats" className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-4 py-2 text-xs font-bold text-gray-400 transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF]">
              <Globe className="h-3.5 w-3.5" /> Global Stats
            </Link>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/5 px-4 py-2 text-xs font-bold text-[#00F5FF] transition-all hover:bg-[#00F5FF]/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.15)]">
              <Download className="h-3.5 w-3.5" /> Plugin <span className="text-[#00F5FF]/50">Soon</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-20 pb-24 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#1A1A24] bg-[#0A0A0F] px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
          <span className="text-[11px] font-medium text-gray-500">Real-time Minecraft block analytics</span>
        </div>

        <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
          Track every block.
          <br />
          <span className="bg-gradient-to-r from-[#00F5FF] to-[#FF0055] bg-clip-text text-transparent">See every stat.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-gray-500 md:text-lg">
          The analytics platform for Minecraft servers. Live leaderboards, player profiles, achievements and more — all in one place.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button className="group inline-flex items-center gap-2 rounded-lg bg-[#00F5FF] px-6 py-3 text-sm font-black text-black transition-all hover:shadow-[0_0_25px_rgba(0,245,255,0.4)]">
            <Download className="h-4 w-4" /> Get the Plugin
            <span className="ml-1 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold">SOON</span>
          </button>
          <a href="#how" className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-6 py-3 text-sm font-bold text-gray-400 transition-all hover:border-[#2A2A3A] hover:text-white">
            See how it works <ArrowRight className="h-4 w-4" />
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
            { value: totalBlocks != null ? formatNumber(totalBlocks) : "…", label: "Blocks tracked" },
            { value: "24/7", label: "Live data" },
            { value: "$0", label: "Setup cost" },
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
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">Everything you need</h2>
          <p className="mt-2 text-sm text-gray-500">Powerful analytics built for Minecraft communities</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={BarChart3} title="Live Dashboard" desc="Real-time server stats — blocks mined, placed, combined totals, and player count." accent="cyan" />
          <Feature icon={Users} title="Leaderboards" desc="Top 25 miners and builders ranked side by side with player heads and split stats." accent="pink" />
          <Feature icon={Search} title="Player Profiles" desc="Detailed profiles with rank, top blocks, achievements, rare blocks, and activity heatmap." accent="cyan" />
          <Feature icon={Swords} title="Player Compare" desc="Deep side-by-side comparison — win tallies, ratios, diversity, heatmaps, and achievement progress." accent="pink" />
          <Feature icon={Trophy} title="Achievements" desc="20+ unlockable milestones with exact unlock dates — from first block to 1M blocks." accent="cyan" />
          <Feature icon={Clock} title="Activity Heatmap" desc="See when players are most active — by day and hour, converted to their local timezone." accent="pink" />
          <Feature icon={Boxes} title="Block Index" desc="Searchable, sortable block catalog with Top 10 Hall of Fame and per-block contributor breakdown." accent="cyan" />
          <Feature icon={TrendingUp} title="Server Trends" desc="30-day mined vs. placed trend chart to track your server's activity over time." accent="pink" />
          <Feature icon={Gem} title="Rare Blocks" desc="Track diamond, emerald, ancient debris, and other rare block interactions per player." accent="cyan" />
          <Feature icon={CalendarRange} title="Time Range Filter" desc="Filter player stats by day, week, month, year, or all-time to spot trends and spikes." accent="pink" />
          <Feature icon={Globe} title="Global Stats" desc="Anonymized cross-server statistics aggregating data from all connected servers worldwide." accent="cyan" />
          <Feature icon={Download} title="Zero Setup" desc="No account, no login. Drop the plugin in, restart, and your stats are live instantly." accent="pink" />
        </div>
      </div>

      {/* How it works */}
      <div id="how" className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">Up in 3 steps</h2>
          <p className="mt-2 text-sm text-gray-500">No account needed. No login. Just plug and play.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Step number="01" title="Install Plugin" desc="Drop the 404Stats plugin into your server's plugins folder and restart." />
          <Step number="02" title="Auto-Sync" desc="The plugin automatically sends block activity to 404Stats — no config needed." />
          <Step number="03" title="View Stats" desc="Open your server URL from the plugin log and explore live analytics." />
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20">
        <div className="relative overflow-hidden rounded-2xl border border-[#1A1A24] bg-[#0A0A0F] p-10 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[200px] w-[400px] -translate-x-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)' }} />
          <h2 className="relative text-3xl font-black tracking-tight md:text-4xl">Ready to level up?</h2>
          <p className="relative mt-3 text-sm text-gray-500">The plugin is coming soon. Be the first to know.</p>
          <button className="relative mt-8 inline-flex items-center gap-2 rounded-lg bg-[#00F5FF] px-6 py-3 text-sm font-black text-black transition-all hover:shadow-[0_0_25px_rgba(0,245,255,0.4)]">
            <Download className="h-4 w-4" /> Get Notified
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1A1A24] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <GlitchLogo size="sm" />
            <span className="text-xs text-gray-600">Block analytics for Minecraft servers</span>
          </div>
          <p className="text-xs text-gray-600">© 2026 404GameNotFound</p>
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