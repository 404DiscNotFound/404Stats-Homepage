import { Sparkles } from "lucide-react";

export default function FunFacts({ facts }) {
  if (!facts || facts.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white sm:text-sm">
        <Sparkles className="h-4 w-4 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }} />
        Fun Facts
      </h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {facts.map((fact, i) => (
          <div key={i} className="flex items-start gap-2.5 rounded-lg border border-[#1A1A24] bg-[#0F0F18] px-3 py-2.5">
            <span className="shrink-0 text-base">{fact.icon}</span>
            <p className="text-xs leading-relaxed text-gray-400">{fact.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}