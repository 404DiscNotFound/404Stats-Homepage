import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, X, ExternalLink } from "lucide-react";
import GlitchLogo from "@/components/GlitchLogo";
import LanguageToggle from "@/components/LanguageToggle";
import Background from "@/components/Background";
import { useT } from "@/lib/i18n";

const WEB_PANEL_IMAGES = [
  {
    src: "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/714e4cd0f_Bildschirmfoto2026-07-05um202359.png",
    titleKey: "gallery.web.1.title",
    descKey: "gallery.web.1.desc",
  },
  {
    src: "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/9eee8075f_Bildschirmfoto2026-07-05um202414.png",
    titleKey: "gallery.web.2.title",
    descKey: "gallery.web.2.desc",
  },
  {
    src: "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/b3f8bb1d6_Bildschirmfoto2026-07-05um202518.png",
    titleKey: "gallery.web.3.title",
    descKey: "gallery.web.3.desc",
  },
  {
    src: "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/48853899c_Bildschirmfoto2026-07-05um202558.png",
    titleKey: "gallery.web.4.title",
    descKey: "gallery.web.4.desc",
  },
];

const INGAME_IMAGES = [
  {
    src: "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/9027bf659_DesignohneTitel-3.png",
    titleKey: "gallery.ingame.1.title",
    descKey: "gallery.ingame.1.desc",
  },
  {
    src: "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/3bb74cf1e_DesignohneTitel-4.png",
    titleKey: "gallery.ingame.2.title",
    descKey: "gallery.ingame.2.desc",
  },
  {
    src: "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/fe82da716_DesignohneTitel-5.png",
    titleKey: "gallery.ingame.3.title",
    descKey: "gallery.ingame.3.desc",
  },
];

function GalleryCard({ img, onOpen }) {
  const t = useT();
  return (
    <button
      onClick={() => onOpen(img.src, t(img.titleKey))}
      className="group relative overflow-hidden rounded-xl border border-[#1A1A24] bg-[#0A0A0F] text-left transition-all hover:border-[#00F5FF]/30 hover:shadow-[0_0_25px_rgba(0,245,255,0.08)]"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-[#15151a]">
        <img
          src={img.src}
          alt={t(img.titleKey)}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-4">
        <p className="text-sm font-bold text-white">{t(img.titleKey)}</p>
        <p className="mt-1 text-xs text-gray-500">{t(img.descKey)}</p>
      </div>
    </button>
  );
}

function Lightbox({ src, title, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-lg border border-[#1A1A24] bg-[#0A0A0F]/80 p-2 text-gray-400 backdrop-blur transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF]"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
        {title && <p className="mb-3 text-center text-sm font-bold text-white">{title}</p>}
        <img src={src} alt={title || ""} className="max-h-[80vh] w-auto rounded-xl border border-[#1A1A24]" />
      </div>
    </div>
  );
}

export default function Gallery() {
  const t = useT();
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Background />
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <GlitchLogo size="sm" />
        <div className="flex items-center gap-6">
          <Link to="/" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("gallery.back")}</Link>
          <div className="flex items-center gap-3">
            <LanguageToggle compact />
            <a href="https://github.com/404DiscNotFound" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/5 px-4 py-2 text-xs font-bold text-[#00F5FF] transition-all hover:bg-[#00F5FF]/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.15)]">
              {t("landing.nav.download")}
            </a>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-[#00F5FF]">
          <ArrowLeft className="h-3.5 w-3.5" /> {t("gallery.back")}
        </Link>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          {t("gallery.title")}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-gray-500">{t("gallery.desc")}</p>

        {/* Web Panel Section */}
        <div className="mt-12">
          <h2 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00F5FF]">
            <span className="h-px w-6 bg-[#00F5FF]/40" /> {t("gallery.web.title")}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {WEB_PANEL_IMAGES.map((img) => (
              <GalleryCard key={img.src} img={img} onOpen={(src, title) => setLightbox({ src, title })} />
            ))}
          </div>
        </div>

        {/* In-Game Section */}
        <div className="mt-14">
          <h2 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF0055]">
            <span className="h-px w-6 bg-[#FF0055]/40" /> {t("gallery.ingame.title")}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INGAME_IMAGES.map((img) => (
              <GalleryCard key={img.src} img={img} onOpen={(src, title) => setLightbox({ src, title })} />
            ))}
          </div>
        </div>
      </div>

      {lightbox && (
        <Lightbox src={lightbox.src} title={lightbox.title} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}