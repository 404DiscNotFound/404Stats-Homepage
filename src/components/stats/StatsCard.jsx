import { ArrowRight } from "lucide-react";

export default function StatsCard({ icon: Icon, title, description, stats, accent }) {
  const accentColor = accent === "purple" ? "#8B4FE8" : "#5BA033";

  return (
    <div className="flex flex-col border border-[#3D3D3D] bg-[#2E2E2E]">
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-[#3D3D3D] p-4">
        <Icon className="h-6 w-6 shrink-0" style={{ color: accentColor }} />
        <div className="min-w-0">
          <h3 className="text-base font-bold tracking-wide text-white">{title}</h3>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#888888]">{description}</p>
        </div>
      </div>

      {/* Stats Box */}
      <div className="p-4">
        <div className="border border-[#3D3D3D] bg-[#1F1F1F] p-3">
          <div className="space-y-2">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#888888]">{stat.label}</span>
                <span className="font-bold" style={{ color: accentColor }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-[#3D3D3D] p-3">
        <button className="flex w-full items-center justify-between text-[11px] font-bold text-[#888888] transition-colors hover:text-white">
          <span>OPEN {title} MENU</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}