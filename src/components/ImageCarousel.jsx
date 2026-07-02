import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { title: "Live Dashboard", subtitle: "Real-time stats at a glance" },
  { title: "Player Compare", subtitle: "Side-by-side deep stats" },
  { title: "Activity Heatmap", subtitle: "See when players are active" },
];

export default function ImageCarousel() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#1A1A24] bg-[#0A0A0F]">
      {/* Slides */}
      <div className="relative aspect-[4/3] w-full">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            {/* Placeholder gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background: i === 0
                  ? 'radial-gradient(circle at 30% 40%, rgba(0,245,255,0.12) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(0,245,255,0.06) 0%, transparent 50%)'
                  : i === 1
                  ? 'radial-gradient(circle at 50% 50%, rgba(255,0,85,0.10) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(0,245,255,0.06) 0%, transparent 50%)'
                  : 'radial-gradient(circle at 60% 30%, rgba(0,245,255,0.08) 0%, transparent 60%), radial-gradient(circle at 40% 80%, rgba(255,0,85,0.08) 0%, transparent 50%)'
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="relative z-10 px-6 text-center">
              <span className="text-[10px] uppercase tracking-widest text-gray-600">Screenshot</span>
              <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">{slide.title}</h3>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Nav arrows */}
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

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? "w-5 bg-[#00F5FF]" : "w-1.5 bg-gray-700"}`}
            style={i === current ? { boxShadow: "0 0 6px rgba(0,245,255,0.5)" } : undefined}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}