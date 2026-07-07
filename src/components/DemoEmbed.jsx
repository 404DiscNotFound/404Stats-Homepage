import { useState } from "react";
import { ExternalLink, Monitor } from "lucide-react";
import { useT } from "@/lib/i18n";

const DEMO_URL = "https://demo.mcstats.404gnf.de/";

export default function DemoEmbed({ height = "560px", showHeader = true }) {
  const t = useT();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#1E1E1F] bg-[#313233]">
      {showHeader && (
        <div className="flex items-center justify-between border-b border-[#1E1E1F] bg-[#3A3A3B] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-[#5BA033]" />
            <span className="text-xs font-bold text-white">{t("demo.label")}</span>
            <span className="hidden text-xs text-gray-600 sm:inline">demo.mcstats.404gnf.de</span>
          </div>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-[#5BA033]"
          >
            {t("demo.openFull")} <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
      <div className="relative w-full" style={{ height }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#313233]">
            <div className="w-8 h-8 border-4 border-[#1E1E1F] border-t-[#5BA033] rounded-full animate-spin" />
          </div>
        )}
        <iframe
          src={DEMO_URL}
          title="404Stats Live Demo"
          className="h-full w-full border-0"
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      </div>
    </div>
  );
}