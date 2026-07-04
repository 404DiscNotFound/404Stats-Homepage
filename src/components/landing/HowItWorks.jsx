import { Package, RotateCw, Compass, ChevronRight, Terminal } from "lucide-react";
import { useT } from "@/lib/i18n";

const STEPS = [
  { icon: Package, num: "01", key: "step1" },
  { icon: RotateCw, num: "02", key: "step2" },
  { icon: Compass, num: "03", key: "step3" },
];

const COMMANDS = ["me", "bossbar", "project", "panel"];

export default function HowItWorks() {
  const t = useT();
  return (
    <div id="how" className="relative z-10 mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black tracking-tight md:text-4xl">{t("landing.how.title")}</h2>
        <p className="mt-2 text-sm text-gray-500">{t("landing.how.desc")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, num, key }) => (
          <div key={key} className="group rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-6 transition-all hover:border-[#00F5FF]/30 hover:shadow-[0_0_20px_rgba(0,245,255,0.06)]">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-[#00F5FF]/40" />
              <span className="text-2xl font-black text-[#1A1A24] transition-colors group-hover:text-[#00F5FF]/30">{num}</span>
              <ChevronRight className="h-4 w-4 text-gray-700" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-white">{t(`landing.how.${key}Title`)}</h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{t(`landing.how.${key}Desc`)}</p>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <div className="mb-6 text-center">
          <h3 className="flex items-center justify-center gap-2 text-xl font-bold text-white">
            <Terminal className="h-4 w-4 text-[#00F5FF]" /> {t("landing.commands.title")}
          </h3>
          <p className="mt-1 text-xs text-gray-500">{t("landing.commands.desc")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {COMMANDS.map((key) => (
            <div key={key} className="flex items-center gap-4 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] p-4">
              <code className="shrink-0 rounded bg-[#00F5FF]/10 px-2 py-1 text-xs font-bold text-[#00F5FF]">{t(`landing.commands.${key}`)}</code>
              <span className="text-xs text-gray-500">{t(`landing.commands.${key}Desc`)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}