import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import GlitchLogo from "./GlitchLogo";
import ShareButtons from "./ShareButtons";
import LanguageToggle from "./LanguageToggle";

export default function ServerHeader({ slug, displayName }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1A1A24] bg-black/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3.5">
        <Link to={`/server/${slug}`} className="flex items-center gap-2.5 sm:gap-3">
          <GlitchLogo size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{displayName || "Minecraft Server"}</p>
            <p className="hidden text-xs text-gray-600 sm:block">/server/{slug}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle compact />
          <ShareButtons
            compact
            url={typeof window !== "undefined" ? `${window.location.origin}/server/${slug}` : ""}
            title={`${displayName || "Minecraft Server"} on 404Stats`}
          />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-3 py-2 text-xs font-bold text-gray-400 transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF]"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">404Stats</span>
          </Link>
        </div>
      </div>
    </header>
  );
}