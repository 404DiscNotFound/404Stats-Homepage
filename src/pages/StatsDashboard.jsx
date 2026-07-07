import { Boxes, Swords, Footprints, Hammer, Hand, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import GlitchLogo from "@/components/GlitchLogo";
import Background from "@/components/Background";
import LanguageToggle from "@/components/LanguageToggle";
import MobileMenu from "@/components/MobileMenu";
import StatsCard from "@/components/stats/StatsCard";
import { useT } from "@/lib/i18n";

const NAV_LINKS = [
  { to: "/gallery", label: "landing.nav.gallery" },
  { to: "/about", label: "landing.nav.about" },
  { to: "/projects", label: "landing.nav.projects" },
];

const CARDS = [
  {
    icon: Boxes,
    title: "BLOCKS",
    description: "MINED, PLACED, PLAYERS AND BLOCK INDEX",
    accent: "green",
    stats: [
      { label: "SUNY", value: "0 mined / 0 placed" },
      { label: "CREA", value: "98 mined / 1 placed" },
      { label: "ILL", value: "98 mined / 1 placed" },
    ],
  },
  {
    icon: Swords,
    title: "NPC COMBAT",
    description: "KILLS, DEATHS, MOBS, WORLDS AND WEAPONS",
    accent: "green",
    stats: [
      { label: "KILLS", value: "6" },
      { label: "DEATHS", value: "0" },
    ],
  },
  {
    icon: Footprints,
    title: "MOVEMENT",
    description: "WALK, FLY, RIDE AND JUMP STATISTICS",
    accent: "green",
    stats: [
      { label: "WALK", value: "0.94 KM" },
      { label: "FLY", value: "2.76 KM" },
      { label: "JUMPS", value: "617" },
    ],
  },
  {
    icon: Hammer,
    title: "PRODUCTION",
    description: "CRAFTING, SMELTING, SMITHING, STONECUTTING",
    accent: "purple",
    stats: [
      { label: "MADE", value: "16" },
      { label: "ACTIONS", value: "7" },
      { label: "ITEMS", value: "5" },
    ],
  },
  {
    icon: Hand,
    title: "INTERACTIONS",
    description: "CHESTS, DOORS, BELLS, ANIMALS, BUCKETS",
    accent: "purple",
    stats: [
      { label: "ACTIONS", value: "85" },
      { label: "TYPES", value: "2" },
      { label: "PLAYERS", value: "1" },
    ],
  },
  {
    icon: Globe,
    title: "WORLDS",
    description: "DIMENSIONS AND WORLD ACTIVITY OVERVIEW",
    accent: "green",
    stats: [
      { label: "OVER", value: "1" },
      { label: "NETHER", value: "1" },
      { label: "END", value: "1" },
    ],
  },
];

export default function StatsDashboard() {
  const t = useT();

  return (
    <div className="min-h-screen bg-black text-white">
      <Background />

      {/* Nav */}
      <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/"><GlitchLogo size="sm" /></Link>
        <div className="flex items-center gap-6">
          <Link to="/gallery" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("landing.nav.gallery")}</Link>
          <Link to="/about" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("landing.nav.about")}</Link>
          <Link to="/projects" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("landing.nav.projects")}</Link>
          <div className="flex items-center gap-3">
            <LanguageToggle compact />
            <MobileMenu links={NAV_LINKS} />
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 border border-[#3D3D3D] bg-[#2E2E2E] p-6 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-[#3D3D3D] bg-[#5BA033]">
            <span className="text-2xl font-black text-white" style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.4)" }}>P</span>
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-[#888888]">MULTIPLAYER STATISTICS</p>
            <h1 className="text-2xl font-black tracking-wide text-white">PELL_TEST</h1>
            <p className="mt-1 text-xs text-[#888888]">Select a stats menu for this local Minecraft server.</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="border border-[#5BA033]/30 bg-[#5BA033]/10 px-3 py-1 text-xs font-bold text-[#5BA033]">98 blocks</span>
            <span className="border border-[#5BA033]/30 bg-[#5BA033]/10 px-3 py-1 text-xs font-bold text-[#5BA033]">6 kills</span>
            <span className="border border-[#3D3D3D] bg-black px-3 py-1 text-xs font-bold text-white">6 modules active</span>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {CARDS.map((card) => (
            <StatsCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}