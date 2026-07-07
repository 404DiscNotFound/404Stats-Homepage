import { Link } from "react-router-dom";
import GlitchLogo from "@/components/GlitchLogo";
import LanguageToggle from "@/components/LanguageToggle";
import MobileMenu from "@/components/MobileMenu";
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
    <div className="min-h-screen bg-background text-white overflow-hidden">
      <Background />
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <GlitchLogo size="sm" />
        <div className="flex items-center gap-6">
          <Link to="/how-to-use" className="hidden text-xs text-[#8A8A8A] transition-colors hover:text-white sm:block">{t("landing.nav.howto")}</Link>
          <Link to="/gallery" className="hidden text-xs text-[#8A8A8A] transition-colors hover:text-white sm:block">{t("landing.nav.gallery")}</Link>
          <Link to="/about" className="hidden text-xs text-[#8A8A8A] transition-colors hover:text-white sm:block">{t("landing.nav.about")}</Link>
          <Link to="/projects" className="hidden text-xs text-[#8A8A8A] transition-colors hover:text-white sm:block">{t("landing.nav.projects")}</Link>
          <div className="flex items-center gap-3">
            <LanguageToggle compact />
            <a href="https://github.com/404DiscNotFound" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#5BA033]/30 bg-[#5BA033]/5 px-4 py-2 text-xs font-bold text-[#5BA033] transition-all hover:bg-[#5BA033]/10 hover:shadow-[0_0_15px_rgba(91,160,51,0.15)]">
              {t("landing.nav.download")}
            </a>
            <MobileMenu links={[
              { to: "/how-to-use", label: "landing.nav.howto" },
              { to: "/gallery", label: "landing.nav.gallery" },
              { to: "/about", label: "landing.nav.about" },
              { to: "/projects", label: "landing.nav.projects" },
            ]} />
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