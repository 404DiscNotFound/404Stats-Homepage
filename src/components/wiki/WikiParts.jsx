export function WikiInfoCard({ title, children }) {
  return (
    <div className="rounded-lg border border-[#1E1E1F] bg-[#3A3A3B] p-5">
      {title && <p className="mb-2 text-sm font-bold text-white">{title}</p>}
      <div className="text-sm text-gray-400 leading-relaxed">{children}</div>
    </div>
  );
}

export function WikiArticleHeader({ icon: Icon, accent, title, desc }) {
  return (
    <div className="mb-6 flex items-center gap-3 border-b border-[#1E1E1F] pb-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#1E1E1F] bg-[#3A3A3B]" style={{ color: accent }}>
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <div className="min-w-0">
        <h1 className="text-xl font-black text-white">{title}</h1>
        {desc && <p className="text-xs text-[#8A8A8A]">{desc}</p>}
      </div>
    </div>
  );
}