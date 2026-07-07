import { Download, MessageCircle, AlertTriangle } from "lucide-react";
import { useT } from "@/lib/i18n";

export default function Hero() {
  const t = useT();
  return (
    <div className="relative z-10 flex flex-col items-center px-6 pt-12 pb-12 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#8B4FE8]/30 bg-[#8B4FE8]/5 px-4 py-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-[#8B4FE8]" />
        <span className="text-[11px] font-medium text-[#8B4FE8]">{t("landing.alpha.warning")} · 0.1a</span>
      </div>
      <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
        {t("landing.hero.title1")}<br />
        <span className="bg-gradient-to-r from-[#5BA033] to-[#8B4FE8] bg-clip-text text-transparent">{t("landing.hero.title2")}</span>
      </h1>
      <p className="mt-6 max-w-xl text-base text-[#888888] md:text-lg">{t("landing.hero.desc")}</p>
      <p className="mt-3 max-w-md text-xs text-[#5A5A5A]">{t("landing.alpha.desc")}</p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <a href="https://github.com/404DiscNotFound" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#5BA033]/30 bg-[#5BA033]/5 px-6 py-3 text-sm font-bold text-[#5BA033] transition-all hover:bg-[#5BA033]/10 hover:shadow-[0_0_25px_rgba(91,160,51,0.15)]">
          <Download className="h-4 w-4" /> {t("landing.hero.getPlugin")}
        </a>
        <a href="https://discord.gg/gsQEWZScuX" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#3D3D3D] bg-[#2E2E2E] px-6 py-3 text-sm font-bold text-gray-400 transition-all hover:border-[#48494A] hover:text-white">
          <MessageCircle className="h-4 w-4" /> {t("landing.hero.discord")}
        </a>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <img src="https://img.shields.io/bstats/servers/32369?style=for-the-badge&label=Servers&color=5BA033&labelColor=313233" alt="Servers" className="h-6 rounded" />
        <img src="https://img.shields.io/bstats/players/32369?style=for-the-badge&label=Players&color=8B4FE8&labelColor=313233" alt="Players" className="h-6 rounded" />
      </div>
    </div>
  );
}