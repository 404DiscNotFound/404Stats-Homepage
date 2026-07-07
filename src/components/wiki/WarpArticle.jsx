import { ExternalLink, Navigation, Check } from "lucide-react";
import { WikiArticleHeader } from "@/components/wiki/WikiParts";
import { useT } from "@/lib/i18n";

const WARP_ICON = "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/f5fe24a0e_KopievonKopievonDesignohneTitel.png";
const WARP_URL = "https://mcwarp.404gnf.de";

export default function WarpArticle() {
  const t = useT();
  return (
    <article>
      <WikiArticleHeader icon={Navigation} accent="#8B4FE8" title="404Warp" desc={t("warp.tagline")} />

      {/* Hero with app icon */}
      <div className="mb-6 overflow-hidden rounded-xl border border-[#8B4FE8]/20 bg-black">
        <div className="relative flex flex-col items-center gap-4 px-6 py-10">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 50% 40%, rgba(0,242,255,0.15) 0%, transparent 50%), radial-gradient(circle at 50% 60%, rgba(255,0,122,0.15) 0%, transparent 50%)" }} />
          <img src={WARP_ICON} alt="404Warp" className="relative h-24 w-24 rounded-2xl object-contain" />
          <div className="relative text-center">
            <p className="text-lg font-bold text-white">{t("warp.hero.line1")}</p>
            <p className="mt-1 text-lg font-bold">
              <span className="bg-gradient-to-r from-[#5BA033] to-[#8B4FE8] bg-clip-text text-transparent">{t("warp.hero.line2a")}</span>{" "}
              <span className="text-[#8B4FE8]">{t("warp.hero.line2b")}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-gray-400">{t("warp.desc.paragraph1")}</p>
        <p className="text-sm leading-relaxed text-gray-400">{t("warp.desc.paragraph2")}</p>

        {/* Features */}
        <div className="grid gap-3 sm:grid-cols-2">
          {["feature1", "feature2", "feature3", "feature4"].map((f) => (
            <div key={f} className="flex items-start gap-2 rounded-lg border border-[#1A1A24] bg-[#0F0F14] p-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5BA033]" />
              <span className="text-xs text-gray-400">{t(`warp.${f}`)}</span>
            </div>
          ))}
        </div>

        {/* Link */}
        <a
          href={WARP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[#8B4FE8]/30 bg-[#8B4FE8]/5 px-5 py-3 text-sm font-bold text-[#8B4FE8] transition-all hover:bg-[#8B4FE8]/10"
        >
          <Navigation className="h-4 w-4" />
          {t("warp.visit")}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}