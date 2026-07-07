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

        {/* Info card replacing gallery CTA */}
        <div className="group relative flex flex-col justify-between overflow-hidden border border-[#1E1E1F] bg-[#313233] p-6 min-h-[200px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#5BA033]">{t("landing.gallery.badge")}</p>
            <h3 className="mt-3 text-xl font-black leading-tight text-white">{t("landing.gallery.title")}</h3>
            <p className="mt-2 text-sm text-[#8A8A8A]">{t("landing.gallery.desc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}