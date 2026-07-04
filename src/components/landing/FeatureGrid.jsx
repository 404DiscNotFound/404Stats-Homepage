import { Boxes, LayoutDashboard, FolderKanban, BarChart3, Code2, ShieldCheck, Gamepad2, Trophy, Share2 } from "lucide-react";
import { useT } from "@/lib/i18n";

const FEATURES = [
  { icon: Boxes, key: "blockTracking", accent: "cyan" },
  { icon: LayoutDashboard, key: "webPanel", accent: "pink" },
  { icon: FolderKanban, key: "projectMode", accent: "cyan" },
  { icon: BarChart3, key: "bossbar", accent: "pink" },
  { icon: Code2, key: "placeholder", accent: "cyan" },
  { icon: ShieldCheck, key: "privacy", accent: "pink" },
  { icon: Gamepad2, key: "gameModes", accent: "cyan" },
  { icon: Trophy, key: "achievements", accent: "pink" },
  { icon: Share2, key: "share", accent: "cyan" },
];

export default function FeatureGrid() {
  const t = useT();
  return (
    <div id="features" className="relative z-10 mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black tracking-tight md:text-4xl">{t("landing.features.title")}</h2>
        <p className="mt-2 text-sm text-gray-500">{t("landing.features.desc")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, key, accent }) => {
          const color = accent === "cyan" ? "#00F5FF" : "#FF0055";
          return (
            <div key={key} className="group rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-6 transition-all hover:border-[#2A2A3A]">
              <div className="inline-flex rounded-lg border border-[#1A1A24] p-2.5" style={{ boxShadow: `0 0 15px ${color}10` }}>
                <Icon className="h-5 w-5" style={{ color, filter: `drop-shadow(0 0 4px ${color}80)` }} />
              </div>
              <h3 className="mt-4 text-sm font-bold text-white">{t(`landing.features.${key}`)}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{t(`landing.features.${key}Desc`)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}