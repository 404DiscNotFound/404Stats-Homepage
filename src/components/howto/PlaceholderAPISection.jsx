import { Type, Settings, User, Users, Trophy, Code2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useT } from "@/lib/i18n";

function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative">
      {label && <p className="mb-1.5 text-xs font-medium text-[#8A8A8A]">{label}</p>}
      <div className="group relative overflow-hidden rounded-lg border border-[#1E1E1F] bg-[#313233]">
        <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-[#5BA033]"><code>{code}</code></pre>
        <button
          onClick={copy}
          className="absolute right-2 top-2 rounded border border-[#1E1E1F] bg-[#313233]/80 p-1.5 text-[#8A8A8A] opacity-0 backdrop-blur transition-all hover:text-[#5BA033] group-hover:opacity-100"
          aria-label="Copy"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#5BA033]" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-lg border border-[#1E1E1F] bg-[#3A3A3B] p-5">
      <p className="mb-2 text-sm font-bold text-white">{title}</p>
      <div className="text-sm text-gray-400 leading-relaxed">{children}</div>
    </div>
  );
}

function SubSection({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-[#1E1E1F] bg-[#313233] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#8B4FE8]" />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function PlaceholderAPISection({ embedded = false }) {
  const t = useT();
  return (
    <div id="placeholderapi" className={embedded ? "" : "border-t border-[#1E1E1F]"}>
      <section className={embedded ? "" : "relative z-10 mx-auto max-w-3xl px-6 py-10"}>
        {!embedded && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1E1E1F] bg-[#3A3A3B]" style={{ color: "#8B4FE8" }}>
              <Type className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{t("howto.placeholderapi.title")}</h2>
              <p className="text-xs text-[#8A8A8A]">{t("howto.placeholderapi.desc")}</p>
            </div>
          </div>
        )}

        <div className={embedded ? "space-y-4" : "mt-6 space-y-4"}>
          <InfoCard title={t("howto.placeholderapi.requirementTitle")}>
            {t("howto.placeholderapi.requirementDesc")}
          </InfoCard>

          {/* System & Project */}
          <SubSection icon={Settings} title="System & Project">
            <CodeBlock code={`%404stats_storage_mode%       # 404Stats storage mode: LOCAL H2 (...)
%404stats_webserver%          # enabled or disabled
%404stats_bossbar_enabled%    # true or false
%404stats_project_name%        # Current project name
%404stats_project_slug%        # Current project slug
%404stats_project_enabled%    # true or false`} />
          </SubSection>

          {/* Own Stats — Basic */}
          <SubSection icon={User} title="Own Stats — Basic (current Game Mode)">
            <CodeBlock code={`%404stats_mined%        # 1234
%404stats_placed%       # 567
%404stats_total%        # 1801
%404stats_rank%         # 3
%404stats_name%         # PlayerName
%404stats_uuid%         # abc-def-...
%404stats_line%         # #3 PlayerName · 1,801 total · 1,234 mined / 567 placed
%404stats_formatted%    # (alias for line)`} />
          </SubSection>

          {/* Own Stats — Mode Suffix */}
          <SubSection icon={User} title="Own Stats — With Mode Suffix">
            <p className="text-xs text-[#8A8A8A]">Append <code className="text-[#5BA033]">_all</code>, <code className="text-[#5BA033]">_survival</code>, or <code className="text-[#5BA033]">_creative</code>:</p>
            <CodeBlock code={`%404stats_mined_all%
%404stats_mined_survival%
%404stats_mined_creative%
%404stats_placed_all%
%404stats_total_all%
%404stats_rank_all%
%404stats_rank_survival%
%404stats_line_all%
%404stats_line_survival%
%404stats_line_creative%`} />
          </SubSection>

          {/* Formatted lines + mode */}
          <SubSection icon={User} title="Own Stats — Formatted Line + Mode">
            <CodeBlock code={`%404stats_rank_line_all%        # #1 PlayerName · 9,999 total · 8,000 mined / 1,999 placed
%404stats_rank_all_line%        # (same output)
%404stats_mined_line%           # #3 PlayerName · 1,234 mined · 1,801 total
%404stats_placed_line%          # #3 PlayerName · 567 placed · 1,801 total
%404stats_rank_line%            # #3 PlayerName · 1,801 total`} />
          </SubSection>

          {/* Other Player — Summary */}
          <SubSection icon={Users} title="Other Player — Full Summary">
            <p className="text-xs text-[#8A8A8A]">Use <code className="text-[#5BA033]">player_&lt;Name&gt;</code> for a complete summary line:</p>
            <CodeBlock code={`%404stats_player_Talonachris%              # #1 Talonachris · 9,999 total · 8,000 mined / 1,999 placed
%404stats_player_Talonachris_all%          # (All mode)
%404stats_player_Talonachris_survival%     # (Survival mode)
%404stats_player_Talonachris_creative%     # (Creative mode)`} />
          </SubSection>

          {/* Other Player — Single Stat */}
          <SubSection icon={Users} title="Other Player — Single Stat">
            <p className="text-xs text-[#8A8A8A]">Use <code className="text-[#5BA033]">&lt;stat&gt;_player_&lt;Name&gt;</code> for a single value:</p>
            <CodeBlock code={`%404stats_mined_player_Talonachris%       # 8000
%404stats_placed_player_Talonachris%      # 1999
%404stats_total_player_Talonachris%       # 9999
%404stats_rank_player_Talonachris%        # 1
%404stats_name_player_Talonachris%        # Talonachris
%404stats_uuid_player_Talonachris%        # abc-def-...`} />
            <p className="text-xs text-[#8A8A8A]">With mode:</p>
            <CodeBlock code={`%404stats_total_player_Talonachris_all%
%404stats_mined_player_Talonachris_creative%
%404stats_rank_player_Talonachris_survival%`} />
            <p className="text-xs text-[#8A8A8A]">Formatted lines:</p>
            <CodeBlock code={`%404stats_line_player_Talonachris%                      # #1 Talonachris · 9,999 total · 8,000 mined / 1,999 placed
%404stats_rank_line_player_Talonachris_survival%         # #1 Talonachris · 500 total`} />
          </SubSection>

          {/* Leaderboards — Standard */}
          <SubSection icon={Trophy} title="Leaderboards — Standard">
            <p className="text-xs text-[#8A8A8A]">Default: total sort, survival, formatted line:</p>
            <CodeBlock code={`%404stats_top_1%          # same as top_1_line
%404stats_top_1_line%      # #1 Talonachris · 9,999 total · 8,000 mined / 1,999 placed
%404stats_top_1_name%      # Talonachris
%404stats_top_1_uuid%      # abc-def-...
%404stats_top_1_rank%      # 1
%404stats_top_1_total%     # 9999
%404stats_top_1_mined%     # 8000
%404stats_top_1_placed%    # 1999`} />
          </SubSection>

          {/* Leaderboards — Sort Order */}
          <SubSection icon={Trophy} title="Leaderboards — With Sort Order">
            <p className="text-xs text-[#8A8A8A]">Sort by <code className="text-[#5BA033]">mined</code>, <code className="text-[#5BA033]">placed</code>, or <code className="text-[#5BA033]">total</code>:</p>
            <CodeBlock code={`%404stats_top_mined_1_line%
%404stats_top_placed_1_line%
%404stats_top_total_1_line%
%404stats_top_mined_1_total%`} />
          </SubSection>

          {/* Leaderboards — Mode */}
          <SubSection icon={Trophy} title="Leaderboards — With Mode">
            <CodeBlock code={`%404stats_top_1_line_all%
%404stats_top_1_line_survival%
%404stats_top_1_line_creative%
%404stats_top_1_rank_all%
%404stats_top_1_total_creative%`} />
            <p className="text-xs text-[#8A8A8A]">Mode before or after sort:</p>
            <CodeBlock code={`%404stats_top_all_1_line%
%404stats_top_survival_1_line%
%404stats_top_creative_1_line%`} />
          </SubSection>

          {/* Leaderboards — Sort + Mode Combined */}
          <SubSection icon={Trophy} title="Leaderboards — Sort + Mode Combined">
            <CodeBlock code={`%404stats_top_mined_1_line_survival%
%404stats_top_mined_survival_1_line%
%404stats_top_total_1_line_all%
%404stats_top_placed_creative_1_line%`} />
          </SubSection>

          {/* Leaderboards — Any Rank */}
          <SubSection icon={Trophy} title="Leaderboards — Any Rank">
            <CodeBlock code={`%404stats_top_1_*%     ...   %404stats_top_10_*%     ...   %404stats_top_100_*%`} />
            <InfoCard title="Missing ranks (rank > player count)">
              <code className="text-[#5BA033]">#5 No player · 0 total · 0 mined / 0 placed</code>
              <br />
              <code className="text-[#5BA033]">#5 No player · 0 mined · 0 total · 0 placed</code> <span className="text-[#8A8A8A]">(when sorted by mined)</span>
            </InfoCard>
          </SubSection>

          {/* Syntax Rules */}
          <SubSection icon={Code2} title="Syntax Rules">
            <p className="text-xs text-[#8A8A8A]">Suffix order is flexible — the parser recognizes each part regardless of position:</p>
            <CodeBlock code={`%404stats_[stat|top]_[mode?]_[order?]_[player_NAME?]_[rank?]_[line|formatted?]_[mode?]%`} />
            <div className="space-y-1.5 text-xs text-gray-400">
              <p>• <code className="text-[#5BA033]">_all</code>, <code className="text-[#5BA033]">_survival</code>, <code className="text-[#5BA033]">_creative</code> → Game Mode (any position)</p>
              <p>• <code className="text-[#5BA033]">_mined</code>, <code className="text-[#5BA033]">_placed</code>, <code className="text-[#5BA033]">_total</code> → Sort order (leaderboards) or stat selection (own stats)</p>
              <p>• <code className="text-[#5BA033]">_player_NAME</code> → Target player (name or UUID, any position, only one <code className="text-[#5BA033]">_player_</code> allowed)</p>
              <p>• <code className="text-[#5BA033]">_line</code>, <code className="text-[#5BA033]">_formatted</code> → Formatted line instead of raw number</p>
              <p>• <code className="text-[#5BA033]">_1</code> to <code className="text-[#5BA033]">_999</code> → Rank (leaderboards)</p>
            </div>
          </SubSection>
        </div>
      </section>
    </div>
  );
}