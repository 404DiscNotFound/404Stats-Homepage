import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Download, Terminal, Shield, Settings, Globe, Zap, BarChart3, Type,
  Search, Book, Rocket, X, Menu, Boxes, Navigation
} from "lucide-react";
import GlitchLogo from "@/components/GlitchLogo";
import LanguageToggle from "@/components/LanguageToggle";
import MobileMenu from "@/components/MobileMenu";
import Background from "@/components/Background";
import { useT } from "@/lib/i18n";
import {
  InstallArticle, CommandsArticle, PermissionsArticle, ConfigArticle,
  WebPanelArticle, ProjectModeArticle, BossBarArticle, PlaceholderAPIArticle
} from "@/components/wiki/WikiArticles";
import WarpArticle from "@/components/wiki/WarpArticle";

const CATEGORIES = [
  {
    id: "getting-started",
    labelKey: "wiki.category.gettingStarted",
    icon: Rocket,
    articles: ["install", "webpanel"],
  },
  {
    id: "reference",
    labelKey: "wiki.category.reference",
    icon: Book,
    articles: ["commands", "permissions", "config"],
  },
  {
    id: "features",
    labelKey: "wiki.category.features",
    icon: Zap,
    articles: ["placeholderapi", "projectmode", "bossbar"],
  },
  {
    id: "other-apps",
    labelKey: "wiki.category.otherApps",
    icon: Boxes,
    articles: ["404warp"],
  },
];

const ARTICLES = {
  install: { titleKey: "howto.install.title", icon: Download, accent: "#5BA033", keywords: "install download jar setup plugin folder server restart" },
  webpanel: { titleKey: "howto.webpanel.title", icon: Globe, accent: "#5BA033", keywords: "web panel browser dashboard port 8088 password access modules" },
  commands: { titleKey: "howto.commands.title", icon: Terminal, accent: "#5BA033", keywords: "commands me panel project reload bossbar in-game" },
  permissions: { titleKey: "howto.permissions.title", icon: Shield, accent: "#FF0055", keywords: "permissions use bossbar project admin panel luckperms reload" },
  config: { titleKey: "howto.config.title", icon: Settings, accent: "#5BA033", keywords: "config yml configuration modules bossbar database bstats game-mode web-panel" },
  placeholderapi: { titleKey: "howto.placeholderapi.title", icon: Type, accent: "#FF0055", keywords: "placeholderapi papi placeholders scoreboards holograms leaderboard player stats syntax" },
  projectmode: { titleKey: "howto.projectmode.title", icon: Zap, accent: "#FF0055", keywords: "project mode community build members create spawn farm" },
  bossbar: { titleKey: "howto.bossbar.title", icon: BarChart3, accent: "#5BA033", keywords: "bossbar boss bar display mode blocks combat movement toggle" },
  "404warp": { titleKey: "warp.title", icon: Navigation, accent: "#FF007A", keywords: "404warp warp teleport portal survival other app plugin" },
};

const ARTICLE_COMPONENTS = {
  install: InstallArticle,
  commands: CommandsArticle,
  permissions: PermissionsArticle,
  config: ConfigArticle,
  webpanel: WebPanelArticle,
  placeholderapi: PlaceholderAPIArticle,
  projectmode: ProjectModeArticle,
  bossbar: BossBarArticle,
  "404warp": WarpArticle,
};

const NAV_LINKS = [
  { to: "/gallery", label: "landing.nav.gallery" },
  { to: "/about", label: "landing.nav.about" },
  { to: "/projects", label: "landing.nav.projects" },
];

export default function HowToUse() {
  const t = useT();
  const [activeArticle, setActiveArticle] = useState("install");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && ARTICLES[hash]) setActiveArticle(hash);
  }, []);

  const selectArticle = (id) => {
    setActiveArticle(id);
    window.location.hash = id;
    setSearchQuery("");
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return Object.entries(ARTICLES)
      .filter(([id, a]) => {
        const title = t(a.titleKey).toLowerCase();
        return title.includes(q) || a.keywords.toLowerCase().includes(q);
      })
      .map(([id, a]) => ({ id, ...a }));
  }, [searchQuery, t]);

  const ArticleComponent = ARTICLE_COMPONENTS[activeArticle] || InstallArticle;

  return (
    <div className="min-h-screen bg-black text-white">
      <Background />
      <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <GlitchLogo size="sm" />
        <div className="flex items-center gap-6">
          <Link to="/gallery" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("landing.nav.gallery")}</Link>
          <Link to="/about" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("landing.nav.about")}</Link>
          <Link to="/projects" className="hidden text-xs text-gray-500 transition-colors hover:text-white sm:block">{t("landing.nav.projects")}</Link>
          <div className="flex items-center gap-3">
            <LanguageToggle compact />
            <a href="https://github.com/404DiscNotFound" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#5BA033]/30 bg-[#5BA033]/5 px-4 py-2 text-xs font-bold text-[#5BA033] transition-all hover:bg-[#5BA033]/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.15)]">
              {t("landing.nav.download")}
            </a>
            <MobileMenu links={NAV_LINKS} />
          </div>
        </div>
      </nav>

      {/* Wiki Header */}
      <div className="relative z-10 border-b border-[#1E1E1F]">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-[#5BA033]" />
            <h1 className="text-2xl font-black tracking-tight">{t("howto.title")}</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">{t("howto.desc")}</p>
        </div>
      </div>

      {/* Wiki Layout */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="lg:w-64 lg:shrink-0">
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="mb-3 flex w-full items-center justify-between rounded-lg border border-[#1E1E1F] bg-[#313233] px-4 py-3 text-sm text-gray-400 lg:hidden"
            >
              <span className="flex items-center gap-2">
                {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                {t(ARTICLES[activeArticle].titleKey)}
              </span>
            </button>

            <div className={`${mobileSidebarOpen ? "block" : "hidden"} lg:block`}>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("wiki.search")}
                  className="w-full rounded-lg border border-[#1E1E1F] bg-[#313233] py-2 pl-9 pr-3 text-xs text-white placeholder:text-gray-600 focus:border-[#5BA033]/30 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Search Results or Categories */}
              {searchResults ? (
                <div>
                  <p className="mb-2 px-1 text-[10px] uppercase tracking-widest text-gray-600">
                    {searchResults.length} {t("wiki.results")}
                  </p>
                  {searchResults.length === 0 ? (
                    <p className="px-1 text-xs text-gray-600">{t("wiki.noResults")}</p>
                  ) : (
                    <div className="space-y-1">
                      {searchResults.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => selectArticle(a.id)}
                          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${activeArticle === a.id ? "bg-[#5BA033]/10 text-[#5BA033]" : "text-gray-400 hover:bg-[#3A3A3B] hover:text-white"}`}
                        >
                          {a.icon && <a.icon className="h-3.5 w-3.5 shrink-0" />}
                          <span className="truncate">{t(a.titleKey)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.id}>
                      <div className="mb-1.5 flex items-center gap-2 px-1">
                        {cat.icon && <cat.icon className="h-3.5 w-3.5 text-gray-600" />}
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{t(cat.labelKey)}</span>
                      </div>
                      <div className="space-y-0.5">
                        {cat.articles.map((articleId) => {
                          const a = ARTICLES[articleId];
                          const AIcon = a.icon;
                          return (
                            <button
                              key={articleId}
                              onClick={() => selectArticle(articleId)}
                              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${activeArticle === articleId ? "bg-[#5BA033]/10 text-[#5BA033]" : "text-gray-400 hover:bg-[#3A3A3B] hover:text-white"}`}
                            >
                              {AIcon && <AIcon className="h-3.5 w-3.5 shrink-0" />}
                              <span className="truncate">{t(a.titleKey)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Article Content */}
          <main className="min-w-0 flex-1">
            <div className="rounded-xl border border-[#1E1E1F] bg-[#313233] p-6 sm:p-8">
              <ArticleComponent />
            </div>

            {/* Article Navigation */}
            <ArticleNav activeArticle={activeArticle} selectArticle={selectArticle} t={t} />

            {/* CTA */}
            <div className="mt-6 rounded-2xl border border-[#1E1E1F] bg-gradient-to-br from-[#3A3A3B] to-[#313233] p-8 text-center">
              <h3 className="text-2xl font-black text-white">{t("howto.cta.title")}</h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">{t("howto.cta.desc")}</p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="https://github.com/404DiscNotFound" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#5BA033]/30 bg-[#5BA033]/5 px-6 py-3 text-sm font-bold text-[#5BA033] transition-all hover:bg-[#5BA033]/10">
                  <Download className="h-4 w-4" /> {t("howto.cta.github")}
                </a>
                <a href="https://discord.gg/gsQEWZScuX" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#1E1E1F] bg-[#313233] px-6 py-3 text-sm font-bold text-gray-400 transition-all hover:border-[#48494A] hover:text-white">
                  {t("howto.cta.discord")}
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1E1E1F] py-6 text-center">
        <Link to="/" className="text-xs text-gray-600 transition-colors hover:text-white">{t("legal.backToHome")}</Link>
      </footer>
    </div>
  );
}

function ArticleNav({ activeArticle, selectArticle, t }) {
  const allIds = CATEGORIES.flatMap((c) => c.articles);
  const currentIdx = allIds.indexOf(activeArticle);
  const prev = currentIdx > 0 ? allIds[currentIdx - 1] : null;
  const next = currentIdx < allIds.length - 1 ? allIds[currentIdx + 1] : null;

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      {prev ? (
        <button onClick={() => selectArticle(prev)} className="flex flex-1 items-center gap-2 rounded-lg border border-[#1E1E1F] bg-[#313233] px-4 py-3 text-xs text-gray-400 transition-colors hover:border-[#5BA033]/30 hover:text-[#5BA033]">
          <span>← {t("wiki.prev")}</span>
          <span className="truncate text-gray-600">{t(ARTICLES[prev].titleKey)}</span>
        </button>
      ) : <div className="flex-1" />}
      {next ? (
        <button onClick={() => selectArticle(next)} className="flex flex-1 items-center justify-end gap-2 rounded-lg border border-[#1E1E1F] bg-[#313233] px-4 py-3 text-xs text-gray-400 transition-colors hover:border-[#5BA033]/30 hover:text-[#5BA033]">
          <span className="truncate text-gray-600">{t(ARTICLES[next].titleKey)}</span>
          <span>{t("wiki.next")} →</span>
        </button>
      ) : <div className="flex-1" />}
    </div>
  );
}