export default function StatCard({ label, value, sublabel, accent = "cyan" }) {
  const glow = accent === "cyan" ? "shadow-[0_0_20px_rgba(0,245,255,0.15)]" : "shadow-[0_0_20px_rgba(255,0,85,0.15)]";
  const accentText = accent === "cyan" ? "text-[#00F5FF]" : "text-[#FF0055]";
  const accentBorder = accent === "cyan" ? "hover:border-[#00F5FF]/40" : "hover:border-[#FF0055]/40";
  const accentGlow = accent === "cyan" ? "text-[#00F5FF]" : "text-[#FF0055]";

  return (
    <div className={`rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-5 transition-all hover:border-[#2A2A3A] ${accentBorder} ${glow}`}>
      <p className="text-xs uppercase tracking-widest text-gray-600">{label}</p>
      <p className={`mt-2 text-3xl font-black tabular-nums md:text-4xl ${accentText} ${accentGlow}`}
        style={{ textShadow: accent === "cyan" ? "0 0 12px rgba(0,245,255,0.4)" : "0 0 12px rgba(255,0,85,0.4)" }}
      >
        {value}
      </p>
      {sublabel && <p className="mt-1 text-sm text-gray-600">{sublabel}</p>}
    </div>
  );
}