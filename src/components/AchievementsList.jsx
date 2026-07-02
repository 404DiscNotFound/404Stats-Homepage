import { useT, useLang } from "@/lib/i18n";


function formatUnlockDate(dateStr, lang) {
  if (!dateStr) return null;
  let normalized = dateStr;
  if (typeof dateStr === 'string' && dateStr.includes('T') && !dateStr.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(dateStr)) {
    normalized = dateStr + 'Z';
  }
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return null;
  const locale = lang === 'de' ? 'de-DE' : 'en-US';
  const dateStrFormatted = d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStrFormatted = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  return `${dateStrFormatted} · ${timeStrFormatted}`;
}

export default function AchievementsList({ achievements }) {
  const t = useT();
  const { lang } = useLang();
  if (!achievements || achievements.length === 0) return null;
  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">{unlocked} / {achievements.length} {t("achievements.unlocked")}</span>
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#1A1A24]">
          <div className="h-full rounded-full bg-[#00F5FF] transition-all" style={{ width: `${(unlocked / achievements.length) * 100}%`, boxShadow: "0 0 6px rgba(0,245,255,0.5)" }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {achievements.map(a => {
          const dateText = a.unlocked ? formatUnlockDate(a.unlocked_date, lang) : null;
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