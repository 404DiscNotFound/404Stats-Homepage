import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/lib/i18n";

const DURATION = 6000;

const SLIDE_IMAGES = [
  "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/714e4cd0f_Bildschirmfoto2026-07-05um202359.png",
  "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/9eee8075f_Bildschirmfoto2026-07-05um202414.png",
  "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/b3f8bb1d6_Bildschirmfoto2026-07-05um202518.png",
  "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/48853899c_Bildschirmfoto2026-07-05um202558.png",
];

export default function ImageCarousel() {
  const t = useT();
  const SLIDES = [
    { title: t("landing.carousel.slide1"), subtitle: t("landing.carousel.subtitle1") },
    { title: t("landing.carousel.slide2"), subtitle: t("landing.carousel.subtitle2") },
    { title: t("landing.carousel.slide3"), subtitle: t("landing.carousel.subtitle3") },
    { title: t("landing.carousel.slide4"), subtitle: t("landing.carousel.subtitle4") },
  ];
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState({});
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const pausedRef = useRef(false);

  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    setProgress(0);
    startRef.current = null;

    const tick = (ts) => {
      if (pausedRef.current) {
        startRef.current = ts - (progress * DURATION);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const pct = Math.min(elapsed / DURATION, 1);
      setProgress(pct);
      if (pct >= 1) {
        setCurrent((c) => (c + 1) % SLIDES.length);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const handleMouseEnter = () => { pausedRef.current = true; };
  const handleMouseLeave = () => { pausedRef.current = false; };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-[#1A1A24] bg-[#0A0A0F]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[16/10] w-full">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            {!loaded[i] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 border-2 border-[#1A1A24] border-t-[#00F5FF] rounded-full animate-spin" />
              </div>
            )}
            <img
              src={SLIDE_IMAGES[i]}
              alt={slide.title}
              loading={i === 0 ? "eager" : "lazy"}
              onLoad={() => setLoaded((p) => ({ ...p, [i]: true }))}
              className="h-full w-full object-cover object-top"
              style={{ opacity: loaded[i] ? 1 : 0 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
          </div>
        ))}

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <p className="text-sm font-bold text-white md:text-base">{SLIDES[current].title}</p>
          <p className="mt-0.5 text-xs text-gray-400">{SLIDES[current].subtitle}</p>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-lg border border-[#1A1A24] bg-[#0A0A0F]/80 p-1.5 text-gray-400 opacity-0 backdrop-blur transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF] group-hover:opacity-100"
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-lg border border-[#1A1A24] bg-[#0A0A0F]/80 p-1.5 text-gray-400 opacity-0 backdrop-blur transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF] group-hover:opacity-100"
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex gap-1.5 p-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="flex-1"
            aria-label={`Slide ${i + 1}`}
          >
            <div className="h-0.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#00F5FF]"
                style={{
                  width: i < current ? "100%" : i === current ? `${progress * 100}%` : "0%",
                  boxShadow: i === current ? "0 0 6px rgba(0,245,255,0.6)" : undefined,
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}