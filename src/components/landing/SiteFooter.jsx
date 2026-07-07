import { Link } from "react-router-dom";
import { useT } from "@/lib/i18n";
import GlitchLogo from "@/components/GlitchLogo";

export default function SiteFooter() {
  const t = useT();
  return (
    <footer className="relative z-10 border-t border-[#1E1E1F] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <GlitchLogo size="sm" />
          <span className="text-xs text-gray-600">{t("landing.footer.desc")}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/about" className="text-xs text-gray-600 transition-colors hover:text-[#5BA033]">{t("landing.footer.about")}</Link>
          <Link to="/privacy" className="text-xs text-gray-600 transition-colors hover:text-[#5BA033]">{t("landing.footer.privacy")}</Link>
          <p className="text-xs text-gray-600">© 2026 404GameNotFound</p>
        </div>
      </div>
    </footer>
  );
}