import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useT } from "@/lib/i18n";

const DURATION = 5000;

export default function ImageCarousel() {
  const t = useT();
  const SLIDES = [
    { title: t("landing.carousel.slide1") },
    { title: t("landing.carousel.slide2") },
    { title: t("landing.carousel.slide3") },
    { title: t("landing.carousel.slide4") },
  ];
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
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
      className="relative overflow-hidden rounded-2xl border border-[#1A1A24] bg-[#0A0A0F]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[4/3] w-full">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: i === current ? "radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)" : undefined }} />
            <ImageIcon className="h-10 w-10 text-gray-700" />
            <p className="mt-3 text-sm font-bold text-gray-400">{slide.title}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-gray-700">{t("landing.carousel.soon")}</p>
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-lg border border-[#1A1A24] bg-[#0A0A0F]/80 p-1.5 text-gray-400 backdrop-blur transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF]"
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-lg border border-[#1A1A24] bg-[#0A0A0F]/80 p-1.5 text-gray-400 backdrop-blur transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF]"
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex gap-1.5 p-3">
        {SLIDES.map((slide, i) => (
          <div key={i} className="flex-1">
            <div className="h-0.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#00F5FF]"
                style={{
                  width: i < current ? "100%" : i === current ? `${progress * 100}%` : "0%",
                  boxShadow: i === current ? "0 0 6px rgba(0,245,255,0.6)" : undefined,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}