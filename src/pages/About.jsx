import { Link } from "react-router-dom";
import { Globe, Github, MessageCircle, BarChart3, ArrowLeft, ShieldCheck } from "lucide-react";
import Background from "@/components/Background";
import GlitchLogo from "@/components/GlitchLogo";
import LanguageToggle from "@/components/LanguageToggle";
import { useT } from "@/lib/i18n";

const LINKS = [
  { icon: Globe, label: "mcstats.404gnf.de", href: "https://mcstats.404gnf.de" },
  { icon: Github, label: "GitHub", href: "https://github.com/404DiscNotFound" },
  { icon: MessageCircle, label: "Discord", href: "https://discord.gg/gsQEWZScuX" },
  { icon: BarChart3, label: "bStats", href: "https://bstats.org/plugin/bukkit/404Stats/32369" },
];

export default function About() {
  const t = useT();
  return (
    <div className="relative min-h-screen bg-black text-white">
      <Background />
      <header className="sticky top-0 z-10 border-b border-[#1A1A24] bg-black/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-[#00F5FF]">
            <ArrowLeft className="h-3.5 w-3.5" /> {t("common.backToHome")}
          </Link>
          <LanguageToggle compact />
        </div>
      </header>
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16">
        <div className="mb-8 flex flex-col items-center text-center">
          <GlitchLogo size="2xl" />
          <h1 className="mt-6 text-3xl font-black tracking-tight md:text-4xl">{t("about.title")}</h1>
          <p className="mt-2 text-sm text-[#00F5FF]">{t("about.creator")}</p>
          <p className="mt-1 text-xs text-gray-600">{t("about.community")} · {t("about.communityDesc")}</p>
        </div>
        <p className="text-center text-sm leading-relaxed text-gray-400">{t("about.desc")}</p>
        <div className="mt-12">
          <h2 className="mb-4 text-center text-xs uppercase tracking-widest text-gray-600">{t("about.links")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {LINKS.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] p-4 transition-all hover:border-[#00F5FF]/30">
                <Icon className="h-4 w-4 text-[#00F5FF]" />
                <span className="text-xs font-bold text-gray-400">{label}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#00F5FF]" />
            <h2 className="text-sm font-bold text-white">{t("about.privacy")}</h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">{t("about.privacyDesc")}</p>
        </div>
      </div>
    </div>
  );
}