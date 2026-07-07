import { BarChart3, Globe, Zap, Shield, Settings, Download, Terminal, Type } from "lucide-react";
import WikiCodeBlock from "@/components/wiki/WikiCodeBlock";
import { WikiInfoCard, WikiArticleHeader } from "@/components/wiki/WikiParts";
import PlaceholderAPISection from "@/components/howto/PlaceholderAPISection";
import { useT } from "@/lib/i18n";

export function InstallArticle() {
  const t = useT();
  return (
    <article>
      <WikiArticleHeader icon={Download} accent="#5BA033" title={t("howto.install.title")} desc={t("howto.install.desc")} />
      <div className="space-y-4">
        <WikiInfoCard title={t("howto.install.step1Title")}>{t("howto.install.step1Desc")}</WikiInfoCard>
        <WikiInfoCard title={t("howto.install.step2Title")}>{t("howto.install.step2Desc")}</WikiInfoCard>
        <WikiInfoCard title={t("howto.install.step3Title")}>{t("howto.install.step3Desc")}</WikiInfoCard>
        <div className="rounded-lg border border-[#8B4FE8]/20 bg-[#8B4FE8]/5 p-4">
          <p className="text-xs text-[#8B4FE8]">{t("howto.install.requirements")}</p>
        </div>
      </div>
    </article>
  );
}

export function CommandsArticle() {
  const t = useT();
  const cmds = [
    { cmd: "/404stats me", desc: t("howto.commands.meDesc") },
    { cmd: "/404stats panel", desc: t("howto.commands.panelDesc") },
    { cmd: "/404stats project add <name>", desc: t("howto.commands.projectDesc") },
    { cmd: "/404stats reload", desc: t("howto.commands.reloadDesc") },
    { cmd: "/bossbar", desc: t("howto.commands.bossbarDesc") },
  ];
  return (
    <article>
      <WikiArticleHeader icon={Terminal} accent="#5BA033" title={t("howto.commands.title")} desc={t("howto.commands.desc")} />
      <div className="space-y-3">
        {cmds.map((c) => (
          <div key={c.cmd} className="flex flex-col gap-1 rounded-lg border border-[#3D3D3D] bg-[#383838] p-4 sm:flex-row sm:items-center sm:justify-between">
            <code className="text-sm font-mono text-[#5BA033]">{c.cmd}</code>
            <span className="text-xs text-[#888888]">{c.desc}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export function PermissionsArticle() {
  const t = useT();
  const perms = [
    { perm: "404stats.use", desc: t("howto.permissions.use") },
    { perm: "404stats.bossbar", desc: t("howto.permissions.bossbar") },
    { perm: "404stats.project", desc: t("howto.permissions.project") },
    { perm: "404stats.panel", desc: t("howto.permissions.panel") },
    { perm: "404stats.admin", desc: t("howto.permissions.admin") },
    { perm: "404stats.reload", desc: t("howto.permissions.reload") },
  ];
  return (
    <article>
      <WikiArticleHeader icon={Shield} accent="#8B4FE8" title={t("howto.permissions.title")} desc={t("howto.permissions.desc")} />
      <div className="space-y-3">
        {perms.map((p) => (
          <div key={p.perm} className="flex flex-col gap-1 rounded-lg border border-[#3D3D3D] bg-[#383838] p-4 sm:flex-row sm:items-center sm:justify-between">
            <code className="text-sm font-mono text-[#8B4FE8]">{p.perm}</code>
            <span className="text-xs text-[#888888]">{p.desc}</span>
          </div>
        ))}
        <div className="rounded-lg border border-[#3D3D3D] bg-[#2E2E2E] p-4">
          <p className="text-xs text-[#888888]">{t("howto.permissions.note")}</p>
        </div>
      </div>
    </article>
  );
}

export function ConfigArticle() {
  const t = useT();
  return (
    <article>
      <WikiArticleHeader icon={Settings} accent="#5BA033" title={t("howto.config.title")} desc={t("howto.config.desc")} />
      <div className="space-y-4">
        <WikiCodeBlock label={t("howto.config.fileLabel")} code={`# 404Stats Configuration
# Located at: plugins/404Stats/config.yml

# Web Panel
web-panel:
  enabled: true
  port: 8088
  password-protection: false
  password: "your-password-here"

# Tracking Modules
modules:
  blocks: true
  npc-combat: true
  movement: true
  production: true
  interactions: true
  worlds: true

# BossBar
bossbar:
  default-mode: blocks  # blocks | npc-combat | movement
  auto-show: false

# Game Mode Filter
game-mode-filter:
  allow-survival: true
  allow-creative: true
  allow-adventure: true
  allow-spectator: false

# Database (H2 — local only)
database:
  type: h2
  file: stats

# bStats (anonymous metrics)
bstats: true`} />
        <WikiInfoCard title={t("howto.config.modulesTitle")}>{t("howto.config.modulesDesc")}</WikiInfoCard>
      </div>
    </article>
  );
}

export function WebPanelArticle() {
  const t = useT();
  return (
    <article>
      <WikiArticleHeader icon={Globe} accent="#5BA033" title={t("howto.webpanel.title")} desc={t("howto.webpanel.desc")} />
      <div className="space-y-4">
        <WikiInfoCard title={t("howto.webpanel.accessTitle")}>{t("howto.webpanel.accessDesc")}</WikiInfoCard>
        <WikiCodeBlock code={`http://localhost:8088/server/local
http://YOUR-SERVER-IP:8088/server/local`} />
        <WikiInfoCard title={t("howto.webpanel.passwordTitle")}>{t("howto.webpanel.passwordDesc")}</WikiInfoCard>
        <div className="grid gap-3 sm:grid-cols-2">
          {["blocks", "npc-combat", "movement", "production", "interactions", "worlds"].map((m) => (
            <div key={m} className="flex items-center gap-2 rounded-lg border border-[#3D3D3D] bg-[#383838] p-3">
              <BarChart3 className="h-4 w-4 text-[#5BA033]" />
              <span className="text-xs text-gray-400">{t(`howto.modules.${m}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ProjectModeArticle() {
  const t = useT();
  return (
    <article>
      <WikiArticleHeader icon={Zap} accent="#8B4FE8" title={t("howto.projectmode.title")} desc={t("howto.projectmode.desc")} />
      <div className="space-y-4">
        <WikiInfoCard title={t("howto.projectmode.createTitle")}>{t("howto.projectmode.createDesc")}</WikiInfoCard>
        <WikiCodeBlock code={`/404stats project add "Spawn Build"
/404stats project add "Community Farm"
/404stats project list
/404stats project leave`} />
        <WikiInfoCard title={t("howto.projectmode.featuresTitle")}>{t("howto.projectmode.featuresDesc")}</WikiInfoCard>
      </div>
    </article>
  );
}

export function BossBarArticle() {
  const t = useT();
  return (
    <article>
      <WikiArticleHeader icon={BarChart3} accent="#5BA033" title={t("howto.bossbar.title")} desc={t("howto.bossbar.desc")} />
      <div className="space-y-4">
        <WikiInfoCard title={t("howto.bossbar.modesTitle")}>
          <ul className="space-y-1.5">
            <li>• <span className="text-white">{t("howto.modules.blocks")}</span> — {t("howto.bossbar.blocksMode")}</li>
            <li>• <span className="text-white">{t("howto.modules.npcCombat")}</span> — {t("howto.bossbar.npcMode")}</li>
            <li>• <span className="text-white">{t("howto.modules.movement")}</span> — {t("howto.bossbar.movementMode")}</li>
          </ul>
        </WikiInfoCard>
        <WikiCodeBlock label={t("howto.bossbar.toggleLabel")} code={`/bossbar         # Toggle on/off
/bossbar blocks   # Switch to blocks mode
/bossbar combat   # Switch to NPC combat mode
/bossbar movement # Switch to movement mode`} />
      </div>
    </article>
  );
}

export function PlaceholderAPIArticle() {
  const t = useT();
  return (
    <article>
      <WikiArticleHeader icon={Type} accent="#8B4FE8" title={t("howto.placeholderapi.title")} desc={t("howto.placeholderapi.desc")} />
      <PlaceholderAPISection embedded />
    </article>
  );
}