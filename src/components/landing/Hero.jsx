import { Download, MessageCircle } from "lucide-react";
import { useT } from "@/lib/i18n";
import ShareButtons from "@/components/ShareButtons";

export default function Hero() {
  const t = useT();
  return (
    <div className="relative z-10 flex flex-col items-center px-6 pt-16 pb-12 text-center">
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#1A1A24] bg-[#0A0A0F] px-4 py-1.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
        <span className="text-[11px] font-medium text-gray-500">{t("landing.hero.badge")}</span>
      </div>
      <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
        {t("landing.hero.title1")}<br />
        <span className="bg-gradient-to-r from-[#00F5FF] to-[#FF0055] bg-clip-text text-transparent">{t("landing.hero.title2")}</span>
      </h1>
      <p className="mt-6 max-w-xl text-base text-gray-500 md:text-lg">{t("landing.hero.desc")}</p>
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <a href="https://github.com/404DiscNotFound" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[#00F5FF] px-6 py-3 text-sm font-black text-black transition-all hover:shadow-[0_0_25px_rgba(0,245,255,0.4)]">
          <Download className="h-4 w-4" /> {t("landing.hero.getPlugin")}
        </a>
        <a href="https://discord.gg/gsQEWZScuX" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-6 py-3 text-sm font-bold text-gray-400 transition-all hover:border-[#2A2A3A] hover:text-white">
          <MessageCircle className="h-4 w-4" /> {t("landing.hero.discord")}
        </a>
      </div>
      <div className="mt-8">
        <ShareButtons url={typeof window !== "undefined" ? window.location.origin : ""} title="404Stats — Every block. Every stat." />
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <img src="https://img.shields.io/bstats/servers/32369?style=for-the-badge&label=Servers&color=00F5FF&labelColor=0A0A0F" alt="Servers" className="h-6 rounded" />
        <img src="https://img.shields.io/bstats/players/32369?style=for-the-badge&label=Players&color=FF0055&labelColor=0A0A0F" alt="Players" className="h-6 rounded" />
      </div>
    </div>
  );
}