import { Link } from "react-router-dom";
import GlitchLogo from "@/components/GlitchLogo";
import LanguageToggle from "@/components/LanguageToggle";
import Background from "@/components/Background";
import { useT } from "@/lib/i18n";
import Hero from "@/components/landing/Hero";
import StatsStrip from "@/components/landing/StatsStrip";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import CommunityCTA from "@/components/landing/CommunityCTA";
import SiteFooter from "@/components/landing/SiteFooter";
import LandingShowcase from "@/components/landing/LandingShowcase";

export default function Landing() {
  const t = useT();
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Background />
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <GlitchLogo size="sm" />
        <div className="flex items-center gap-6">
          <Link to="/gallery" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("landing.nav.gallery")}</Link>
          <Link to="/about" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("landing.nav.about")}</Link>
          <div className="flex items-center gap-3">
            <LanguageToggle compact />
            <a href="https://github.com/404DiscNotFound" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/5 px-4 py-2 text-xs font-bold text-[#00F5FF] transition-all hover:bg-[#00F5FF]/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.15)]">
              {t("landing.nav.download")}
            </a>
          </div>
        </div>
      </nav>
      <Hero />
      <StatsStrip />
      <LandingShowcase />
      <FeatureGrid />
      <HowItWorks />
      <CommunityCTA />
      <SiteFooter />
    </div>
  );
}