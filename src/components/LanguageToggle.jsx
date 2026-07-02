import { useLang } from "@/lib/i18n";

export default function LanguageToggle({ compact = false }) {
  const { lang, setLang } = useLang();

  const base = "rounded-md px-2 py-1 text-xs font-bold transition-all";
  const active = "bg-[#00F5FF]/15 text-[#00F5FF]";
  const inactive = "text-gray-500 hover:text-white";

  if (compact) {
    return (
      <div className="inline-flex rounded-md border border-[#1A1A24] bg-[#0A0A0F] p-0.5">
        <button
          onClick={() => setLang("en")}
          className={`${base} ${lang === "en" ? active : inactive}`}
        >
          EN
        </button>
        <button
          onClick={() => setLang("de")}
          className={`${base} ${lang === "de" ? active : inactive}`}
        >
          DE
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex rounded-lg border border-[#1A1A24] bg-[#0A0A0F] p-1">
      <button
        onClick={() => setLang("en")}
        className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${lang === "en" ? "bg-[#00F5FF]/15 text-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.15)]" : "text-gray-500 hover:text-white"}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("de")}
        className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${lang === "de" ? "bg-[#00F5FF]/15 text-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.15)]" : "text-gray-500 hover:text-white"}`}
      >
        DE
      </button>
    </div>
  );
}