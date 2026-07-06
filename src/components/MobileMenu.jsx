import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import { useT } from "@/lib/i18n";

export default function MobileMenu({ links = [], showGithub = true }) {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg border border-[#1A1A24] bg-[#0A0A0F] p-2 text-gray-400 transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF]"
        aria-label="Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-3 shadow-2xl">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-[#15151a] hover:text-white"
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#1A1A24] pt-3">
            <LanguageToggle compact />
            {showGithub && (
              <a
                href="https://github.com/404DiscNotFound"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/5 px-3 py-1.5 text-xs font-bold text-[#00F5FF]"
              >
                {t("landing.nav.download")}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}