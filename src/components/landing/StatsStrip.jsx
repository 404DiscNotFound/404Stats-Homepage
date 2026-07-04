import { useT } from "@/lib/i18n";

export default function StatsStrip() {
  const t = useT();
  const items = [
    { value: t("landing.stats.local"), desc: t("landing.stats.localDesc") },
    { value: t("landing.stats.free"), desc: t("landing.stats.freeDesc") },
    { value: t("landing.stats.zeroCloud"), desc: t("landing.stats.zeroCloudDesc") },
  ];
  return (
    <div className="relative z-10 mx-auto max-w-4xl px-6 pb-16">
      <div className="grid grid-cols-3 gap-4 rounded-2xl border border-[#1A1A24] bg-[#0A0A0F] p-6 md:gap-8 md:p-8">
        {items.map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-xl font-black text-white md:text-3xl" style={{ textShadow: i === 0 ? "0 0 20px rgba(0,245,255,0.2)" : i === 2 ? "0 0 20px rgba(255,0,85,0.2)" : undefined }}>{s.value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-gray-600 md:text-xs">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}