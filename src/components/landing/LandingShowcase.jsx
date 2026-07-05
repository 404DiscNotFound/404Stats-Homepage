import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/lib/i18n";

const SERVER_OVERVIEW_IMG = "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/714e4cd0f_Bildschirmfoto2026-07-05um202359.png";

export default function LandingShowcase() {
  const t = useT();
  return (
    <div className="relative z-10 mx-auto max-w-5xl px-6 pb-16">
      <div className="grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Static server overview image */}
        <div className="relative overflow-hidden rounded-2xl border border-[#1A1A24] bg-[#0A0A0F]">
          <div className="aspect-[16/10] w-full">
            <img
              src={SERVER_OVERVIEW_IMG}
              alt={t("landing.carousel.slide1")}
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-sm font-bold text-white">{t("landing.carousel.slide1")}</p>
            <p className="mt-0.5 text-xs text-gray-400">{t("landing.carousel.subtitle1")}</p>
          </div>
        </div>

        {/* Gallery CTA card */}
        <Link
          to="/gallery"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1A1A24] bg-gradient-to-br from-[#0F0F14] to-[#0A0A0F] p-6 transition-all hover:border-[#00F5FF]/30 hover:shadow-[0_0_30px_rgba(0,245,255,0.06)] min-h-[200px]"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)" }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00F5FF]">{t("landing.gallery.badge")}</p>
            <h3 className="mt-3 text-xl font-black leading-tight text-white">{t("landing.gallery.title")}</h3>
            <p className="mt-2 text-sm text-gray-500">{t("landing.gallery.desc")}</p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#00F5FF] transition-transform group-hover:translate-x-1">
            {t("landing.gallery.cta")} <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}