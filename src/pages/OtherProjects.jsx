import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import GlitchLogo from "@/components/GlitchLogo";
import LanguageToggle from "@/components/LanguageToggle";
import MobileMenu from "@/components/MobileMenu";
import Background from "@/components/Background";
import { useT } from "@/lib/i18n";

const PTERIOS_IMG = "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/5f9537126_KopievonDesignohneTitel-2.png";

const NAV_LINKS = [
  { to: "/how-to-use", label: "landing.nav.howto" },
  { to: "/gallery", label: "landing.nav.gallery" },
  { to: "/about", label: "landing.nav.about" },
];

export default function OtherProjects() {
  const t = useT();

  return (
    <div className="min-h-screen bg-background text-white overflow-hidden">
      <Background />
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <GlitchLogo size="sm" />
        <div className="flex items-center gap-6">
          <Link to="/how-to-use" className="hidden text-xs text-[#888888] transition-colors hover:text-white sm:block">{t("landing.nav.howto")}</Link>
          <Link to="/gallery" className="hidden text-xs text-[#888888] transition-colors hover:text-white sm:block">{t("landing.nav.gallery")}</Link>
          <Link to="/about" className="hidden text-xs text-[#888888] transition-colors hover:text-white sm:block">{t("landing.nav.about")}</Link>
          <div className="flex items-center gap-3">
            <LanguageToggle compact />
            <a href="https://github.com/404DiscNotFound" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#5BA033]/30 bg-[#5BA033]/5 px-4 py-2 text-xs font-bold text-[#5BA033] transition-all hover:bg-[#5BA033]/10 hover:shadow-[0_0_15px_rgba(91,160,51,0.15)]">
              {t("landing.nav.download")}
            </a>
            <MobileMenu links={NAV_LINKS} />
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-[#888888] transition-colors hover:text-[#5BA033]">
          <ArrowLeft className="h-3.5 w-3.5" /> {t("common.backToHome")}
        </Link>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">{t("projects.page.title")}</h1>
        <p className="mt-3 max-w-xl text-sm text-[#888888]">{t("projects.page.desc")}</p>

        {/* Pterios Project Card */}
        <div className="mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[#3D3D3D] bg-gradient-to-br from-[#1A0B2E]/40 to-[#2E2E2E] p-6 transition-all hover:border-[#FF8A65]/20 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* App Icon */}
            <div className="shrink-0">
              <img
                src={PTERIOS_IMG}
                alt={t("projects.pterios.name")}
                className="w-full max-w-[320px] rounded-2xl border border-[#FF8A65]/20 object-contain shadow-[0_0_30px_rgba(255,138,101,0.08)]"
              />
            </div>
            {/* Text Content */}
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-[#FF8A65] to-[#F48FB1] bg-clip-text text-transparent">{t("projects.pterios.name")}</span>
                <span className="ml-2 text-white">{t("projects.pterios.subtitle")}</span>
              </h2>
              <div className="my-3 h-px bg-gradient-to-r from-[#FF8A65]/50 to-[#F48FB1]/50" />
              <p className="text-sm text-gray-400">{t("projects.pterios.desc")}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="https://pterios.404gnf.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF8A65]/30 bg-[#FF8A65]/5 px-4 py-2 text-xs font-bold text-[#FF8A65] transition-all hover:bg-[#FF8A65]/10 hover:shadow-[0_0_15px_rgba(255,138,101,0.15)]"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> {t("projects.pterios.visit")}
                </a>
                <a
                  href="https://github.com/404DiscNotFound/Pterios-iOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#3D3D3D] bg-[#2E2E2E] px-4 py-2 text-xs font-bold text-gray-400 transition-all hover:border-[#5BA033]/30 hover:text-[#5BA033]"
                >
                  <Github className="h-3.5 w-3.5" /> {t("projects.pterios.github")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}