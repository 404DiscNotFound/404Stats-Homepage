import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/lib/i18n";
import DemoEmbed from "@/components/DemoEmbed";

export default function LandingShowcase() {
  const t = useT();
  return (
    <div className="relative z-10 mx-auto max-w-5xl px-6 pb-16">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Live demo iframe */}
        <DemoEmbed height="420px" />

        {/* Gallery CTA card */}
        <Link
          to="/gallery"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1E1E1F] bg-[#313233] p-6 transition-all hover:border-[#5BA033]/30 hover:shadow-[0_0_30px_rgba(91,160,51,0.06)] min-h-[200px]"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(91,160,51,0.08) 0%, transparent 70%)" }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#5BA033]">{t("landing.gallery.badge")}</p>
            <h3 className="mt-3 text-xl font-black leading-tight text-white">{t("landing.gallery.title")}</h3>
            <p className="mt-2 text-sm text-[#8A8A8A]">{t("landing.gallery.desc")}</p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#5BA033] transition-transform group-hover:translate-x-1">
            {t("landing.gallery.cta")} <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}