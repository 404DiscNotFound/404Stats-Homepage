export default function StatCard({ label, value, sublabel, accent = "cyan" }) {
  const accentColor = accent === "cyan" ? "text-[#00F5FF]" : "text-[#FF0055]";
  return (
    <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-5 transition-colors hover:border-[#2A2A3A]">
      <p className="text-xs uppercase tracking-widest text-gray-600">{label}</p>
      <p className={`mt-2 text-3xl font-black tabular-nums md:text-4xl ${accentColor}`}>{value}</p>
      {sublabel && <p className="mt-1 text-sm text-gray-600">{sublabel}</p>}
    </div>
  );
}