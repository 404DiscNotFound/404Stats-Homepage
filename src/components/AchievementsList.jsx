function formatUnlockDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const dateStrFormatted = d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStrFormatted = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  return `${dateStrFormatted} · ${timeStrFormatted}`;
}

export default function AchievementsList({ achievements }) {
  if (!achievements || achievements.length === 0) return null;
  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">{unlocked} / {achievements.length} freigeschaltet</span>
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#1A1A24]">
          <div className="h-full rounded-full bg-[#00F5FF] transition-all" style={{ width: `${(unlocked / achievements.length) * 100}%`, boxShadow: "0 0 6px rgba(0,245,255,0.5)" }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {achievements.map(a => {
          const dateText = a.unlocked ? formatUnlockDate(a.unlocked_date) : null;
          return (
            <div
              key={a.id}
              className={`rounded-lg border p-3 transition-all ${
                a.unlocked
                  ? 'border-[#00F5FF]/30 bg-[#00F5FF]/5 shadow-[0_0_10px_rgba(0,245,255,0.08)]'
                  : 'border-[#1A1A24] bg-[#0A0A0F] opacity-40'
              }`}
            >
              <div className={`text-2xl ${a.unlocked ? '' : 'grayscale'}`}>{a.icon}</div>
              <p className={`mt-1 text-xs font-bold ${a.unlocked ? 'text-white' : 'text-gray-600'}`}>{a.name}</p>
              <p className="text-[10px] leading-tight text-gray-600">{a.desc}</p>
              {dateText && (
                <p className="mt-1 text-[9px] leading-tight text-[#00F5FF]/50">{dateText}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}