import { Link } from "react-router-dom";
import {
  Download, RotateCw, Compass, Terminal, Shield, Settings,
  BarChart3, Globe, Zap, Code2, Key, Copy, Check
} from "lucide-react";
import { useState } from "react";
import GlitchLogo from "@/components/GlitchLogo";
import PlaceholderAPISection from "@/components/howto/PlaceholderAPISection";
import LanguageToggle from "@/components/LanguageToggle";
import Background from "@/components/Background";
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
      {label && <p className="mb-1.5 text-xs font-medium text-gray-500">{label}</p>}
      <div className="group relative overflow-hidden rounded-lg border border-[#1A1A24] bg-[#0A0A0F]">
        <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-[#00F5FF]"><code>{code}</code></pre>
        <button
          onClick={copy}
          className="absolute right-2 top-2 rounded border border-[#1A1A24] bg-[#0A0A0F]/80 p-1.5 text-gray-500 opacity-0 backdrop-blur transition-all hover:text-[#00F5FF] group-hover:opacity-100"
          aria-label="Copy"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#00F5FF]" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

function Section({ icon: Icon, accentColor, title, desc, children }) {
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1A1A24] bg-[#0F0F14]" style={{ color: accentColor }}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{title}</h2>
          {desc && <p className="text-xs text-gray-500">{desc}</p>}
        </div>
      </div>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-lg border border-[#1A1A24] bg-[#0F0F14] p-5">
      <p className="mb-2 text-sm font-bold text-white">{title}</p>
      <div className="text-sm text-gray-400 leading-relaxed">{children}</div>
    </div>
  );
}

export default function HowToUse() {
  const t = useT();
  return (
    <div className="min-h-screen bg-black text-white">
      <Background />
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <GlitchLogo size="sm" />
        <div className="flex items-center gap-6">
          <Link to="/gallery" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("landing.nav.gallery")}</Link>
          <Link to="/about" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("landing.nav.about")}</Link>
          <div className="flex items-center gap-3">
            <LanguageToggle compact />
            <a href="https://github.com/404DiscNotFound" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/5 px-4 py-2 text-xs font-bold text-[#00F5FF] transition-all hover:bg-[#00F5FF]/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.15)]">
              {t("landing.nav.download")}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 px-6 pt-8 pb-4 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/5 px-4 py-1.5">
          <Code2 className="h-3.5 w-3.5 text-[#00F5FF]" />
          <span className="text-[11px] font-medium text-[#00F5FF]">{t("howto.badge")}</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">{t("howto.title")}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500">{t("howto.desc")}</p>
      </div>

      {/* Quick Nav */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-6">
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: "install", label: t("howto.nav.install") },
            { id: "commands", label: t("howto.nav.commands") },
            { id: "permissions", label: t("howto.nav.permissions") },
            { id: "config", label: t("howto.nav.config") },
            { id: "placeholderapi", label: t("howto.nav.placeholderapi") },
            { id: "webpanel", label: t("howto.nav.webpanel") },
            { id: "projectmode", label: t("howto.nav.projectmode") },
            { id: "bossbar", label: t("howto.nav.bossbar") },
          ].map((item) => (
            <a key={item.id} href={`#${item.id}`} className="rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-3 py-1.5 text-xs text-gray-400 transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF]">
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Installation */}
      <div id="install">
        <Section icon={Download} accentColor="#00F5FF" title={t("howto.install.title")} desc={t("howto.install.desc")}>
          <InfoCard title={t("howto.install.step1Title")}>
            {t("howto.install.step1Desc")}
          </InfoCard>
          <InfoCard title={t("howto.install.step2Title")}>
            {t("howto.install.step2Desc")}
          </InfoCard>
          <InfoCard title={t("howto.install.step3Title")}>
            {t("howto.install.step3Desc")}
          </InfoCard>
          <div className="rounded-lg border border-[#FF0055]/20 bg-[#FF0055]/5 p-4">
            <p className="text-xs text-[#FF0055]">{t("howto.install.requirements")}</p>
          </div>
        </Section>
      </div>

      {/* Commands */}
      <div id="commands" className="border-t border-[#1A1A24]">
        <Section icon={Terminal} accentColor="#00F5FF" title={t("howto.commands.title")} desc={t("howto.commands.desc")}>
          <div className="space-y-3">
            {[
              { cmd: "/404stats me", desc: t("howto.commands.meDesc") },
              { cmd: "/404stats panel", desc: t("howto.commands.panelDesc") },
              { cmd: "/404stats project add <name>", desc: t("howto.commands.projectDesc") },
              { cmd: "/404stats reload", desc: t("howto.commands.reloadDesc") },
              { cmd: "/bossbar", desc: t("howto.commands.bossbarDesc") },
            ].map((c) => (
              <div key={c.cmd} className="flex flex-col gap-1 rounded-lg border border-[#1A1A24] bg-[#0F0F14] p-4 sm:flex-row sm:items-center sm:justify-between">
                <code className="text-sm font-mono text-[#00F5FF]">{c.cmd}</code>
                <span className="text-xs text-gray-500">{c.desc}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Permissions */}
      <div id="permissions" className="border-t border-[#1A1A24]">
        <Section icon={Shield} accentColor="#FF0055" title={t("howto.permissions.title")} desc={t("howto.permissions.desc")}>
          <div className="space-y-3">
            {[
              { perm: "404stats.use", desc: t("howto.permissions.use") },
              { perm: "404stats.bossbar", desc: t("howto.permissions.bossbar") },
              { perm: "404stats.project", desc: t("howto.permissions.project") },
              { perm: "404stats.panel", desc: t("howto.permissions.panel") },
              { perm: "404stats.admin", desc: t("howto.permissions.admin") },
              { perm: "404stats.reload", desc: t("howto.permissions.reload") },
            ].map((p) => (
              <div key={p.perm} className="flex flex-col gap-1 rounded-lg border border-[#1A1A24] bg-[#0F0F14] p-4 sm:flex-row sm:items-center sm:justify-between">
                <code className="text-sm font-mono text-[#FF0055]">{p.perm}</code>
                <span className="text-xs text-gray-500">{p.desc}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-[#1A1A24] bg-[#0A0A0F] p-4">
            <p className="text-xs text-gray-500">{t("howto.permissions.note")}</p>
          </div>
        </Section>
      </div>

      {/* Configuration */}
      <div id="config" className="border-t border-[#1A1A24]">
        <Section icon={Settings} accentColor="#00F5FF" title={t("howto.config.title")} desc={t("howto.config.desc")}>
          <CodeBlock label={t("howto.config.fileLabel")} code={`# 404Stats Configuration
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
          <InfoCard title={t("howto.config.modulesTitle")}>
            {t("howto.config.modulesDesc")}
          </InfoCard>
        </Section>
      </div>

      {/* PlaceholderAPI */}
      <PlaceholderAPISection />

      {/* Web Panel */}
      <div id="webpanel" className="border-t border-[#1A1A24]">
        <Section icon={Globe} accentColor="#00F5FF" title={t("howto.webpanel.title")} desc={t("howto.webpanel.desc")}>
          <InfoCard title={t("howto.webpanel.accessTitle")}>
            {t("howto.webpanel.accessDesc")}
          </InfoCard>
          <CodeBlock code={`http://localhost:8088/server/local
http://YOUR-SERVER-IP:8088/server/local`} />
          <InfoCard title={t("howto.webpanel.passwordTitle")}>
            {t("howto.webpanel.passwordDesc")}
          </InfoCard>
          <div className="grid gap-3 sm:grid-cols-2">
            {["blocks", "npc-combat", "movement", "production", "interactions", "worlds"].map((m) => (
              <div key={m} className="flex items-center gap-2 rounded-lg border border-[#1A1A24] bg-[#0F0F14] p-3">
                <BarChart3 className="h-4 w-4 text-[#00F5FF]" />
                <span className="text-xs text-gray-400">{t(`howto.modules.${m}`)}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Project Mode */}
      <div id="projectmode" className="border-t border-[#1A1A24]">
        <Section icon={Zap} accentColor="#FF0055" title={t("howto.projectmode.title")} desc={t("howto.projectmode.desc")}>
          <InfoCard title={t("howto.projectmode.createTitle")}>
            {t("howto.projectmode.createDesc")}
          </InfoCard>
          <CodeBlock code={`/404stats project add "Spawn Build"
/404stats project add "Community Farm"
/404stats project list
/404stats project leave`} />
          <InfoCard title={t("howto.projectmode.featuresTitle")}>
            {t("howto.projectmode.featuresDesc")}
          </InfoCard>
        </Section>
      </div>

      {/* BossBar */}
      <div id="bossbar" className="border-t border-[#1A1A24]">
        <Section icon={BarChart3} accentColor="#00F5FF" title={t("howto.bossbar.title")} desc={t("howto.bossbar.desc")}>
          <InfoCard title={t("howto.bossbar.modesTitle")}>
            <ul className="space-y-1.5">
              <li>• <span className="text-white">{t("howto.modules.blocks")}</span> — {t("howto.bossbar.blocksMode")}</li>
              <li>• <span className="text-white">{t("howto.modules.npcCombat")}</span> — {t("howto.bossbar.npcMode")}</li>
              <li>• <span className="text-white">{t("howto.modules.movement")}</span> — {t("howto.bossbar.movementMode")}</li>
            </ul>
          </InfoCard>
          <CodeBlock label={t("howto.bossbar.toggleLabel")} code={`/bossbar         # Toggle on/off
/bossbar blocks   # Switch to blocks mode
/bossbar combat   # Switch to NPC combat mode
/bossbar movement # Switch to movement mode`} />
        </Section>
      </div>

      {/* CTA */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="rounded-2xl border border-[#1A1A24] bg-gradient-to-br from-[#0F0F14] to-[#0A0A0F] p-8">
          <h3 className="text-2xl font-black text-white">{t("howto.cta.title")}</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">{t("howto.cta.desc")}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="https://github.com/404DiscNotFound" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/5 px-6 py-3 text-sm font-bold text-[#00F5FF] transition-all hover:bg-[#00F5FF]/10">
              <Download className="h-4 w-4" /> {t("howto.cta.github")}
            </a>
            <a href="https://discord.gg/gsQEWZScuX" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-6 py-3 text-sm font-bold text-gray-400 transition-all hover:border-[#2A2A3A] hover:text-white">
              {t("howto.cta.discord")}
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1A1A24] py-6 text-center">
        <Link to="/" className="text-xs text-gray-600 transition-colors hover:text-white">{t("legal.backToHome")}</Link>
      </footer>
    </div>
  );
}