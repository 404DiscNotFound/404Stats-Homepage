import { Link } from "react-router-dom";
import GlitchLogo from "./GlitchLogo";

export default function ServerHeader({ slug, displayName }) {
  return (
    <header className="flex items-center justify-between border-b border-[#1A1A24] px-4 py-3 sm:px-6 sm:py-4">
      <Link to={`/server/${slug}`} className="flex items-center gap-3">
        <GlitchLogo size="sm" />
        <div>
          <p className="text-sm font-bold text-white">{displayName || "Minecraft Server"}</p>
          <p className="text-xs text-gray-600">/server/{slug}</p>
        </div>
      </Link>
      <Link to="/" className="text-xs text-gray-600 transition-colors hover:text-white">
        404Stats
      </Link>
    </header>
  );
}