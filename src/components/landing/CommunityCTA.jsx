import { Heart, MessageCircle, Github, Globe, Download } from "lucide-react";
import { useT } from "@/lib/i18n";

const LINKS = [
  { icon: Globe, label: "Website", href: "https://mcstats.404gnf.de" },
  { icon: Github, label: "GitHub", href: "https://github.com/404DiscNotFound" },
  { icon: MessageCircle, label: "Discord", href: "https://discord.gg/gsQEWZScuX" },
];

export default function CommunityCTA() {
  const t = useT();
  return (
    <>
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center">
        <Heart className="mx-auto h-8 w-8 text-[#8B4FE8]" style={{ filter: "drop-shadow(0 0 6px rgba(139,79,232,0.5))" }} />
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{t("landing.community.title")}</h2>
        <p className="mt-3 max-w-lg mx-auto text-sm text-gray-500">{t("landing.community.desc")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {LINKS.map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#1E1E1F] bg-[#313233] px-4 py-2 text-xs font-bold text-gray-400 transition-all hover:border-[#5BA033]/30 hover:text-[#5BA033]">
              <Icon className="h-3.5 w-3.5" /> {label}
            </a>
          ))}
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-12">
        <div className="relative overflow-hidden rounded-2xl border border-[#1E1E1F] bg-[#313233] p-10 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[200px] w-[400px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(91,160,51,0.08) 0%, transparent 70%)" }} />
          <h2 className="relative text-3xl font-black tracking-tight md:text-4xl">{t("landing.cta.title")}</h2>
          <p className="relative mt-3 text-sm text-gray-500">{t("landing.cta.desc")}</p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <span className="inline-flex items-center gap-2 rounded-lg border border-[#5BA033]/20 bg-[#5BA033]/5 px-6 py-3 text-sm font-bold text-[#5BA033]/60">
              <Download className="h-4 w-4" /> {t("landing.cta.download")}
            </span>
            <a href="https://discord.gg/gsQEWZScuX" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#1E1E1F] bg-[#313233] px-6 py-3 text-sm font-bold text-gray-400 transition-all hover:border-[#48494A] hover:text-white">
              <MessageCircle className="h-4 w-4" /> {t("landing.cta.discord")}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}