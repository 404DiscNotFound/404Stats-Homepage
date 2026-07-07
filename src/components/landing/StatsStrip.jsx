import { useT } from "@/lib/i18n";

export default function StatsStrip() {
  const t = useT();
  const items = [
    { value: t("landing.stats.modules"), desc: t("landing.stats.modulesDesc") },
    { value: t("landing.stats.local"), desc: t("landing.stats.localDesc") },
    { value: t("landing.stats.mobile"), desc: t("landing.stats.mobileDesc") },
  ];
  return (
    <div className="relative z-10 mx-auto max-w-4xl px-6 pb-16">
      <div className="grid grid-cols-3 gap-4 rounded-2xl border border-[#1E1E1F] bg-[#313233] p-6 md:gap-8 md:p-8">
        {items.map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-xl font-black text-white md:text-3xl" style={{ textShadow: i === 0 ? "0 0 20px rgba(91,160,51,0.2)" : i === 2 ? "0 0 20px rgba(139,79,232,0.2)" : undefined }}>{s.value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-[#5A5A5A] md:text-xs">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}