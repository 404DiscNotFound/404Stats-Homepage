import { Boxes, Crosshair, Footprints, Hammer, Hand, Globe, BarChart3, Code2, FolderKanban, ShieldCheck, Gamepad2, LayoutDashboard } from "lucide-react";
import { useT } from "@/lib/i18n";

const FEATURES = [
  { icon: Boxes, key: "blocks", accent: "cyan" },
  { icon: Crosshair, key: "npcCombat", accent: "pink" },
  { icon: Footprints, key: "movement", accent: "cyan" },
  { icon: Hammer, key: "production", accent: "pink" },
  { icon: Hand, key: "interactions", accent: "cyan" },
  { icon: Globe, key: "worlds", accent: "pink" },
  { icon: BarChart3, key: "bossbar", accent: "cyan" },
  { icon: Code2, key: "placeholder", accent: "pink" },
  { icon: FolderKanban, key: "projectMode", accent: "cyan" },
  { icon: Gamepad2, key: "gameModes", accent: "pink" },
  { icon: ShieldCheck, key: "privacy", accent: "cyan" },
  { icon: LayoutDashboard, key: "adminPanel", accent: "pink" },
];

export default function FeatureGrid() {
  const t = useT();
  return (
    <div id="features" className="relative z-10 mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black tracking-tight md:text-4xl">{t("landing.features.title")}</h2>
        <p className="mt-2 text-sm text-[#888888]">{t("landing.features.desc")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, key, accent }) => {
          const color = accent === "cyan" ? "#5BA033" : "#8B4FE8";
          return (
            <div key={key} className="group rounded-xl border border-[#3D3D3D] bg-[#2E2E2E] p-6 transition-all hover:border-[#454545]">
              <div className="inline-flex rounded-lg border border-[#3D3D3D] p-2.5" style={{ boxShadow: `0 0 15px ${color}10` }}>
                <Icon className="h-5 w-5" style={{ color, filter: `drop-shadow(0 0 4px ${color}80)` }} />
              </div>
              <h3 className="mt-4 text-sm font-bold text-white">{t(`landing.features.${key}`)}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#888888]">{t(`landing.features.${key}Desc`)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}