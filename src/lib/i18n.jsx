import { createContext, useContext, useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "f0f_lang";

const translations = {
  en: {
    // Common
    "common.mined": "Mined",
    "common.placed": "Placed",
    "common.total": "Total",
    "common.blocks": "blocks",
    "common.players": "players",
    "common.player": "player",
    "common.backToHome": "← Back to home",
    "common.backToServer": "← Back to server",
    "common.dashboard": "Dashboard",
    "common.loading": "Loading...",
    "common.serverNotFound": "Server not found",
    "common.playerNotFound": "Player not found",
    "common.noData": "No data",
    "common.page": "Page",
    "common.of": "of",

    // Landing
    "landing.nav.features": "Features",
    "landing.nav.howItWorks": "How it works",
    "landing.nav.globalStats": "Global Stats",
    "landing.nav.plugin": "Plugin",
    "landing.nav.soon": "Soon",
    "landing.hero.badge": "Real-time Minecraft block analytics",
    "landing.hero.title1": "Track every block.",
    "landing.hero.title2": "See every stat.",
    "landing.hero.desc": "The analytics platform for Minecraft servers. Live leaderboards, player profiles, achievements and more — all in one place.",
    "landing.hero.getPlugin": "Get the Plugin",
    "landing.hero.howItWorks": "See how it works",
    "landing.stats.blocksTracked": "Blocks tracked",
    "landing.stats.liveData": "Live data",
    "landing.stats.setupCost": "Setup cost",
    "landing.features.title": "Everything you need",
    "landing.features.desc": "Powerful analytics built for Minecraft communities",
    "landing.features.liveDashboard": "Live Dashboard",
    "landing.features.liveDashboardDesc": "Real-time server stats — blocks mined, placed, combined totals, and player count.",
    "landing.features.leaderboards": "Leaderboards",
    "landing.features.leaderboardsDesc": "Top 25 miners and builders ranked side by side with player heads and split stats.",
    "landing.features.playerProfiles": "Player Profiles",
    "landing.features.playerProfilesDesc": "Detailed profiles with rank, top blocks, achievements, rare blocks, and activity heatmap.",
    "landing.features.playerCompare": "Player Compare",
    "landing.features.playerCompareDesc": "Deep side-by-side comparison — win tallies, ratios, diversity, heatmaps, and achievement progress.",
    "landing.features.achievements": "Achievements",
    "landing.features.achievementsDesc": "20+ unlockable milestones with exact unlock dates — from first block to 1M blocks.",
    "landing.features.heatmap": "Activity Heatmap",
    "landing.features.heatmapDesc": "See when players are most active — by day and hour, converted to their local timezone.",
    "landing.features.blockIndex": "Block Index",
    "landing.features.blockIndexDesc": "Searchable, sortable block catalog with Top 10 Hall of Fame and per-block contributor breakdown.",
    "landing.features.serverTrends": "Server Trends",
    "landing.features.serverTrendsDesc": "30-day mined vs. placed trend chart to track your server's activity over time.",
    "landing.features.rareBlocks": "Rare Blocks",
    "landing.features.rareBlocksDesc": "Track diamond, emerald, ancient debris, and other rare block interactions per player.",
    "landing.features.timeRange": "Time Range Filter",
    "landing.features.timeRangeDesc": "Filter player stats by day, week, month, year, or all-time to spot trends and spikes.",
    "landing.features.globalStats": "Global Stats",
    "landing.features.globalStatsDesc": "Anonymized cross-server statistics aggregating data from all connected servers worldwide.",
    "landing.features.zeroSetup": "Zero Setup",
    "landing.features.zeroSetupDesc": "No account, no login. Drop the plugin in, restart, and your stats are live instantly.",
    "landing.how.title": "Up in 3 steps",
    "landing.how.desc": "No account needed. No login. Just plug and play.",
    "landing.how.step1Title": "Install Plugin",
    "landing.how.step1Desc": "Drop the 404Stats plugin into your server's plugins folder and restart.",
    "landing.how.step2Title": "Auto-Sync",
    "landing.how.step2Desc": "The plugin automatically sends block activity to 404Stats — no config needed.",
    "landing.how.step3Title": "View Stats",
    "landing.how.step3Desc": "Open your server URL from the plugin log and explore live analytics.",
    "landing.cta.title": "Ready to level up?",
    "landing.cta.desc": "The plugin is coming soon. Be the first to know.",
    "landing.cta.button": "Get Notified",
    "landing.footer.desc": "Block analytics for Minecraft servers",
    "landing.footer.terms": "Terms",
    "landing.footer.privacy": "Privacy",

    // Server Dashboard
    "dashboard.blocksMined": "Blocks Mined",
    "dashboard.blocksPlaced": "Blocks Placed",
    "dashboard.serverTrend": "Server Trend",
    "dashboard.topBlocks": "Top 25 Blocks",
    "dashboard.topMiners": "Top 25 Miners",
    "dashboard.topBuilders": "Top 25 Builders",
    "dashboard.rareBlocks": "Rare Blocks",
    "dashboard.players": "Players",
    "dashboard.blockIndex": "Block Index",
    "dashboard.compare": "Compare",

    // Player Profile
    "player.rank": "Rank",
    "player.ofPlayers": "players",
    "player.topBlocks": "Top Blocks",
    "player.achievements": "Achievements",
    "player.activityHeatmap": "Activity Heatmap",
    "player.rareBlocks": "Rare Blocks",

    // Compare
    "compare.title": "Compare Players",
    "compare.player1": "Player 1",
    "compare.player2": "Player 2",
    "compare.wins": "Wins",
    "compare.vs": "VS",
    "compare.ties": "ties",
    "compare.deadHeat": "🤝 It's a dead heat!",
    "compare.leads": "leads",
    "compare.coreStats": "Core Stats",
    "compare.ratios": "Ratios & Breakdown",
    "compare.miningFocus": "Mining Focus %",
    "compare.buildingFocus": "Building Focus %",
    "compare.serverShare": "Server Share %",
    "compare.minedPlacedRatio": "Mined : Placed Ratio",
    "compare.diversityAchievements": "Diversity & Achievements",
    "compare.uniqueBlockTypes": "Unique Block Types",
    "compare.rareBlocksFound": "Rare Blocks Found",
    "compare.achievementsUnlocked": "Achievements Unlocked",
    "compare.achievementProgress": "Achievement Progress %",
    "compare.favoriteBlock": "Favorite Block",
    "compare.topBlocks": "Top Blocks",
    "compare.activityPatterns": "Activity Patterns",
    "compare.peak": "Peak",
    "compare.active": "Active",
    "compare.noRareBlocks": "No rare blocks yet",
    "compare.selectTwo": "Select two players to compare their stats.",
    "compare.uniqueBlocks": "Unique Blocks",
    "compare.activeHours": "Active Hours",
    "compare.peakActivity": "Peak Activity",
    "compare.failedLoad": "Failed to load player data",
    "compare.noData": "No data",
    "compare.achievements": "Achievements",

    // Block Index
    "blockIndex.title": "Block Index",
    "blockIndex.uniqueBlocks": "unique blocks",
    "blockIndex.totalActions": "total actions",
    "blockIndex.searchPlaceholder": "Search blocks...",
    "blockIndex.sortTotal": "Total",
    "blockIndex.sortMined": "Mined",
    "blockIndex.sortPlaced": "Placed",
    "blockIndex.noResults": "No blocks found.",
    "blockIndex.noData": "No block data yet.",
    "blockIndex.ofPlayers": "% of players",

    // Player Index
    "playerIndex.title": "Player Index",
    "playerIndex.searchPlaceholder": "Search players...",
    "playerIndex.sortName": "Name",
    "playerIndex.noResults": "No players found.",
    "playerIndex.noData": "No player data yet.",
    "playerIndex.prev": "Prev",
    "playerIndex.next": "Next",

    // Global Stats
    "global.restrictedArea": "Restricted Area",
    "global.accessCodeRequired": "Global platform statistics — access code required",
    "global.enterAccessCode": "Enter access code...",
    "global.unlock": "Unlock",
    "global.wrongCode": "Wrong access code",
    "global.title": "Global Stats",
    "global.subtitle": "All servers · All time",
    "global.updated": "Updated",
    "global.refresh": "Refresh",
    "global.home": "Home",
    "global.servers": "Servers",
    "global.players": "Players",
    "global.blocksMined": "Blocks Mined",
    "global.blocksPlaced": "Blocks Placed",
    "global.totalInteractions": "Total block interactions",
    "global.funStats": "Fun Stats & Insights",
    "global.avgPerPlayer": "Avg blocks per player",
    "global.acrossAllServers": "across all servers",
    "global.avgPerServer": "Avg blocks per server",
    "global.serverAverage": "server average",
    "global.uniqueBlockTypes": "Unique block types",
    "global.materialsTracked": "different materials tracked",
    "global.diamondsMined": "Diamonds mined",
    "global.oreBlocksTotal": "ore blocks total",
    "global.emeraldsMined": "Emeralds mined",
    "global.goldMined": "Gold mined",
    "global.ancientDebris": "Ancient Debris",
    "global.netheriteReady": "netherite ready",
    "global.mostMinedBlock": "Most mined block",
    "global.mostPlacedBlock": "Most placed block",
    "global.times": "times",
    "global.top10Blocks": "Top 10 Blocks Globally",
    "global.autoRefresh": "Auto-refreshes every 3 hours",
    "global.lastUpdate": "Last update:",
    "global.justNow": "just now",
    "global.mAgo": "m ago",
    "global.tryAgain": "Try again",
    "global.failedLoad": "Failed to load stats",

    // Password Prompt
    "password.title": "Protected Server Statistics",
    "password.desc": "This page shows detailed block statistics and activity data for a Minecraft server. The server admin has protected this data with a password.",
    "password.placeholder": "Server password",
    "password.checking": "Checking...",
    "password.unlock": "Unlock",
    "password.hint": "You can get the password from the Minecraft server admin.",
    "password.wrongPassword": "Wrong password",
    "password.error": "Error verifying password",

    // Not Found
    "notFound.text": "Page or server not found.",

    // Legal
    "legal.lastUpdated": "Last updated:",
    "legal.backToHome": "Back to home",
    "legal.footerText": "404Stats is a hobby project by 404DiscNotFound, on behalf of the 404GameNotFound Community.",
    "legal.termsOfService": "Terms of Service",
    "legal.privacyPolicy": "Privacy Policy",
    "legal.home": "Home",

    // Share
    "share.share": "Share",
    "share.copyLink": "Copy link",

    // Time Range
    "time.day": "Day",
    "time.week": "Week",
    "time.month": "Month",
    "time.year": "Year",
    "time.all": "All",

    // Game Mode
    "mode.survival": "Survival",
    "mode.creative": "Creative",
    "mode.all": "All",

    // Server Achievements
    "serverAchievements.title": "Server Achievements",

    // Hall of Fame
    "hallOfFame.topPlayers": "Top 10 Players Hall of Fame",
    "hallOfFame.mostActivePlayers": "Most active players",
    "hallOfFame.topBlocks": "Top 10 Blocks Hall of Fame",
    "hallOfFame.mostActiveBlocks": "Most active blocks",

    // Player Search
    "playerSearch.placeholder": "Search players...",

    // Player Picker
    "playerPicker.placeholder": "Player name...",

    // Server Trends
    "trends.noData": "No trend data yet.",

    // Top Blocks Chart
    "topBlocks.noData": "No block data yet.",
    "topBlocks.yourShare": "Your share",
    "topBlocks.you": "You",
    "topBlocks.serverTotal": "Server total",

    // Top Players List
    "topPlayers.noData": "No player data yet.",

    // Rare Blocks
    "rareBlocks.noData": "No rare blocks found yet.",

    // Rank Neighbors
    "rankNeighbors.topOfBoard": "Top of the board!",
    "rankNeighbors.you": "You",
    "rankNeighbors.noOneBehind": "No one behind you!",

    // Achievements
    "achievements.unlocked": "unlocked",

    // Heatmap
    "heatmap.localTime": "Local time (browser) · tap or hover a cell",
    "heatmap.less": "Less",
    "heatmap.more": "More",
    "heatmap.days": "Sun,Mon,Tue,Wed,Thu,Fri,Sat",

    // Block Players Tooltip
    "blockPlayers.top5": "Top 5 Players",
    "blockPlayers.noData": "No player data",

    // Fun Facts
    "funFacts.title": "Fun Facts",

    // Carousel
    "carousel.dashboardSubtitle": "See your most active players and even statistics",
    "carousel.compareSubtitle": "1v1 — who is the biggest block addict?",
    "carousel.blockIndexSubtitle": "See the most loved blocks of your players",
    "carousel.profilesSubtitle": "Track individual players and their stats",

    // Donut Charts
    "donuts.materialCategories": "Material Categories",
    "donuts.worldDistribution": "World Distribution",
    "donuts.nature": "Nature",
    "donuts.building": "Building",
    "donuts.tech": "Tech",
    "donuts.nether": "Nether",
    "donuts.end": "End",
    "donuts.overworld": "Overworld",
    "donuts.other": "Other",
    "donuts.noData": "No data available",
  },
  de: {
    // Common
    "common.mined": "Abgebaut",
    "common.placed": "Gebaut",
    "common.total": "Gesamt",
    "common.blocks": "Blöcke",
    "common.players": "Spieler",
    "common.player": "Spieler",
    "common.backToHome": "← Zurück zur Startseite",
    "common.backToServer": "← Zurück zum Server",
    "common.dashboard": "Dashboard",
    "common.loading": "Lädt...",
    "common.serverNotFound": "Server nicht gefunden",
    "common.playerNotFound": "Spieler nicht gefunden",
    "common.noData": "Keine Daten",
    "common.page": "Seite",
    "common.of": "von",

    // Landing
    "landing.nav.features": "Features",
    "landing.nav.howItWorks": "So funktioniert's",
    "landing.nav.globalStats": "Globale Stats",
    "landing.nav.plugin": "Plugin",
    "landing.nav.soon": "Bald",
    "landing.hero.badge": "Echtzeit Minecraft-Block-Analytik",
    "landing.hero.title1": "Verfolge jeden Block.",
    "landing.hero.title2": "Sieh jede Statistik.",
    "landing.hero.desc": "Die Analytics-Plattform für Minecraft-Server. Live-Leaderboards, Spieler-Profile, Achievements und mehr — alles an einem Ort.",
    "landing.hero.getPlugin": "Plugin holen",
    "landing.hero.howItWorks": "So funktioniert's",
    "landing.stats.blocksTracked": "Blöcke getrackt",
    "landing.stats.liveData": "Live-Daten",
    "landing.stats.setupCost": "Setup-Kosten",
    "landing.features.title": "Alles, was du brauchst",
    "landing.features.desc": "Leistungsstarke Analytics für Minecraft-Communities",
    "landing.features.liveDashboard": "Live Dashboard",
    "landing.features.liveDashboardDesc": "Echtzeit-Server-Stats — abgebaute, gebaute und kombinierte Blöcke sowie Spielerzahl.",
    "landing.features.leaderboards": "Leaderboards",
    "landing.features.leaderboardsDesc": "Top 25 Miner und Builder nebeneinander mit Spielerköpfen und geteilten Stats.",
    "landing.features.playerProfiles": "Spieler-Profile",
    "landing.features.playerProfilesDesc": "Detaillierte Profile mit Rang, Top-Blöcken, Achievements, seltenen Blöcken und Aktivitäts-Heatmap.",
    "landing.features.playerCompare": "Spieler-Vergleich",
    "landing.features.playerCompareDesc": "Detaillierter Side-by-Side-Vergleich — Siegpunkte, Verhältnisse, Vielfalt, Heatmaps und Achievement-Fortschritt.",
    "landing.features.achievements": "Achievements",
    "landing.features.achievementsDesc": "20+ freischaltbare Meilensteine mit genauen Daten — vom ersten Block bis 1M Blöcke.",
    "landing.features.heatmap": "Aktivitäts-Heatmap",
    "landing.features.heatmapDesc": "Sieh, wann Spieler am aktivsten sind — nach Tag und Stunde, in deiner lokalen Zeitzone.",
    "landing.features.blockIndex": "Block-Index",
    "landing.features.blockIndexDesc": "Durchsuchbarer, sortierbarer Block-Katalog mit Top 10 Hall of Fame und Beiträger-Übersicht.",
    "landing.features.serverTrends": "Server-Trends",
    "landing.features.serverTrendsDesc": "30-Tage-Trend für abgebaute vs. gebaute Blöcke zur Verfolgung der Server-Aktivität.",
    "landing.features.rareBlocks": "Seltene Blöcke",
    "landing.features.rareBlocksDesc": "Verfolge Diamant, Smaragd, Antikes Schutt und andere seltene Block-Interaktionen pro Spieler.",
    "landing.features.timeRange": "Zeitraum-Filter",
    "landing.features.timeRangeDesc": "Filtere Spieler-Stats nach Tag, Woche, Monat, Jahr oder Gesamtzeit, um Trends zu erkennen.",
    "landing.features.globalStats": "Globale Stats",
    "landing.features.globalStatsDesc": "Anonymisierte serverübergreifende Statistiken aller verbundenen Server weltweit.",
    "landing.features.zeroSetup": "Kein Setup",
    "landing.features.zeroSetupDesc": "Kein Account, kein Login. Plugin reinwerfen, Neustart, und deine Stats sind live.",
    "landing.how.title": "In 3 Schritten startklar",
    "landing.how.desc": "Kein Account nötig. Kein Login. Einfach einstecken und loslegen.",
    "landing.how.step1Title": "Plugin installieren",
    "landing.how.step1Desc": "Lege das 404Stats-Plugin in den Plugins-Ordner deines Servers und starte neu.",
    "landing.how.step2Title": "Auto-Sync",
    "landing.how.step2Desc": "Das Plugin sendet automatisch Block-Aktivitäten an 404Stats — keine Konfiguration nötig.",
    "landing.how.step3Title": "Stats ansehen",
    "landing.how.step3Desc": "Öffne deine Server-URL aus dem Plugin-Log und entdecke Live-Analytics.",
    "landing.cta.title": "Bereit für das nächste Level?",
    "landing.cta.desc": "Das Plugin kommt bald. Sei der Erste, der es erfährt.",
    "landing.cta.button": "Benachrichtigt werden",
    "landing.footer.desc": "Block-Analytics für Minecraft-Server",
    "landing.footer.terms": "AGB",
    "landing.footer.privacy": "Datenschutz",

    // Server Dashboard
    "dashboard.blocksMined": "Blöcke abgebaut",
    "dashboard.blocksPlaced": "Blöcke gebaut",
    "dashboard.serverTrend": "Server-Trend",
    "dashboard.topBlocks": "Top 25 Blöcke",
    "dashboard.topMiners": "Top 25 Miner",
    "dashboard.topBuilders": "Top 25 Builder",
    "dashboard.rareBlocks": "Seltene Blöcke",
    "dashboard.players": "Spieler",
    "dashboard.blockIndex": "Block-Index",
    "dashboard.compare": "Vergleich",

    // Player Profile
    "player.rank": "Rang",
    "player.ofPlayers": "Spieler",
    "player.topBlocks": "Top Blöcke",
    "player.achievements": "Achievements",
    "player.activityHeatmap": "Aktivitäts-Heatmap",
    "player.rareBlocks": "Seltene Blöcke",

    // Compare
    "compare.title": "Spieler vergleichen",
    "compare.player1": "Spieler 1",
    "compare.player2": "Spieler 2",
    "compare.wins": "Siege",
    "compare.vs": "VS",
    "compare.ties": "Unentschieden",
    "compare.deadHeat": "🤝 Kopf-an-Kopf!",
    "compare.leads": "führt",
    "compare.coreStats": "Kern-Stats",
    "compare.ratios": "Verhältnisse & Aufschlüsselung",
    "compare.miningFocus": "Mining-Fokus %",
    "compare.buildingFocus": "Bau-Fokus %",
    "compare.serverShare": "Server-Anteil %",
    "compare.minedPlacedRatio": "Abbau : Bau-Verhältnis",
    "compare.diversityAchievements": "Vielfalt & Achievements",
    "compare.uniqueBlockTypes": "Eindeutige Block-Typen",
    "compare.rareBlocksFound": "Seltene Blöcke gefunden",
    "compare.achievementsUnlocked": "Achievements freigeschaltet",
    "compare.achievementProgress": "Achievement-Fortschritt %",
    "compare.favoriteBlock": "Lieblings-Block",
    "compare.topBlocks": "Top Blöcke",
    "compare.activityPatterns": "Aktivitäts-Muster",
    "compare.peak": "Spitze",
    "compare.active": "Aktiv",
    "compare.noRareBlocks": "Noch keine seltenen Blöcke",
    "compare.selectTwo": "Wähle zwei Spieler zum Vergleichen ihrer Stats.",
    "compare.uniqueBlocks": "Eindeutige Blöcke",
    "compare.activeHours": "Aktive Stunden",
    "compare.peakActivity": "Spitzen-Aktivität",
    "compare.failedLoad": "Spielerdaten konnten nicht geladen werden",
    "compare.noData": "Keine Daten",
    "compare.achievements": "Achievements",

    // Block Index
    "blockIndex.title": "Block-Index",
    "blockIndex.uniqueBlocks": "eindeutige Blöcke",
    "blockIndex.totalActions": "Aktionen gesamt",
    "blockIndex.searchPlaceholder": "Blöcke durchsuchen...",
    "blockIndex.sortTotal": "Gesamt",
    "blockIndex.sortMined": "Abgebaut",
    "blockIndex.sortPlaced": "Gebaut",
    "blockIndex.noResults": "Keine Blöcke gefunden.",
    "blockIndex.noData": "Noch keine Blockdaten vorhanden.",
    "blockIndex.ofPlayers": "% der Spieler",

    // Player Index
    "playerIndex.title": "Spieler-Index",
    "playerIndex.searchPlaceholder": "Spieler durchsuchen...",
    "playerIndex.sortName": "Name",
    "playerIndex.noResults": "Keine Spieler gefunden.",
    "playerIndex.noData": "Noch keine Spielerdaten vorhanden.",
    "playerIndex.prev": "Zurück",
    "playerIndex.next": "Weiter",

    // Global Stats
    "global.restrictedArea": "Geschützter Bereich",
    "global.accessCodeRequired": "Globale Plattform-Statistiken — Zugangscode erforderlich",
    "global.enterAccessCode": "Zugangscode eingeben...",
    "global.unlock": "Entsperren",
    "global.wrongCode": "Falscher Zugangscode",
    "global.title": "Globale Stats",
    "global.subtitle": "Alle Server · Gesamtzeit",
    "global.updated": "Aktualisiert",
    "global.refresh": "Aktualisieren",
    "global.home": "Start",
    "global.servers": "Server",
    "global.players": "Spieler",
    "global.blocksMined": "Blöcke abgebaut",
    "global.blocksPlaced": "Blöcke gebaut",
    "global.totalInteractions": "Block-Interaktionen gesamt",
    "global.funStats": "Fun Stats & Einblicke",
    "global.avgPerPlayer": "Ø Blöcke pro Spieler",
    "global.acrossAllServers": "über alle Server",
    "global.avgPerServer": "Ø Blöcke pro Server",
    "global.serverAverage": "Server-Durchschnitt",
    "global.uniqueBlockTypes": "Eindeutige Block-Typen",
    "global.materialsTracked": "verschiedene Materialien",
    "global.diamondsMined": "Diamanten abgebaut",
    "global.oreBlocksTotal": "Erzblöcke gesamt",
    "global.emeraldsMined": "Smaragde abgebaut",
    "global.goldMined": "Gold abgebaut",
    "global.ancientDebris": "Antikes Schutt",
    "global.netheriteReady": "Netherit-bereit",
    "global.mostMinedBlock": "Meist abgebauter Block",
    "global.mostPlacedBlock": "Meist gebauter Block",
    "global.times": "mal",
    "global.top10Blocks": "Top 10 Blöcke weltweit",
    "global.autoRefresh": "Auto-Aktualisierung alle 3 Stunden",
    "global.lastUpdate": "Letzte Aktualisierung:",
    "global.justNow": "gerade eben",
    "global.mAgo": "min her",
    "global.tryAgain": "Erneut versuchen",
    "global.failedLoad": "Stats konnten nicht geladen werden",

    // Password Prompt
    "password.title": "Geschützte Server-Statistiken",
    "password.desc": "Diese Seite zeigt detaillierte Block-Statistiken und Aktivitätsdaten eines Minecraft-Servers. Der Server-Administrator hat diese Daten mit einem Passwort geschützt.",
    "password.placeholder": "Server-Passwort",
    "password.checking": "Prüfe...",
    "password.unlock": "Entsperren",
    "password.hint": "Das Passwort erhältst du vom Administrator des Minecraft-Servers.",
    "password.wrongPassword": "Falsches Passwort",
    "password.error": "Fehler beim Verifizieren",

    // Not Found
    "notFound.text": "Seite oder Server nicht gefunden.",

    // Legal
    "legal.lastUpdated": "Zuletzt aktualisiert:",
    "legal.backToHome": "Zurück zur Startseite",
    "legal.footerText": "404Stats ist ein Hobby-Projekt von 404DiscNotFound, im Auftrag der 404GameNotFound Community.",
    "legal.termsOfService": "AGB",
    "legal.privacyPolicy": "Datenschutzerklärung",
    "legal.home": "Start",

    // Share
    "share.share": "Teilen",
    "share.copyLink": "Link kopieren",

    // Time Range
    "time.day": "Tag",
    "time.week": "Woche",
    "time.month": "Monat",
    "time.year": "Jahr",
    "time.all": "Gesamt",

    // Game Mode
    "mode.survival": "Überleben",
    "mode.creative": "Kreativ",
    "mode.all": "Alle",

    // Server Achievements
    "serverAchievements.title": "Server-Achievements",

    // Hall of Fame
    "hallOfFame.topPlayers": "Top 10 Spieler Hall of Fame",
    "hallOfFame.mostActivePlayers": "Aktivste Spieler",
    "hallOfFame.topBlocks": "Top 10 Blöcke Hall of Fame",
    "hallOfFame.mostActiveBlocks": "Aktivste Blöcke",

    // Player Search
    "playerSearch.placeholder": "Spieler durchsuchen...",

    // Player Picker
    "playerPicker.placeholder": "Spielername...",

    // Server Trends
    "trends.noData": "Noch keine Trend-Daten.",

    // Top Blocks Chart
    "topBlocks.noData": "Noch keine Blockdaten.",
    "topBlocks.yourShare": "Dein Anteil",
    "topBlocks.you": "Du",
    "topBlocks.serverTotal": "Server-Gesamt",

    // Top Players List
    "topPlayers.noData": "Noch keine Spielerdaten.",

    // Rare Blocks
    "rareBlocks.noData": "Noch keine seltenen Blöcke gefunden.",

    // Rank Neighbors
    "rankNeighbors.topOfBoard": "An der Spitze!",
    "rankNeighbors.you": "Du",
    "rankNeighbors.noOneBehind": "Niemand hinter dir!",

    // Achievements
    "achievements.unlocked": "freigeschaltet",

    // Heatmap
    "heatmap.localTime": "Lokale Zeit (Browser) · tippe oder fahre über eine Zelle",
    "heatmap.less": "Weniger",
    "heatmap.more": "Mehr",
    "heatmap.days": "So,Mo,Di,Mi,Do,Fr,Sa",

    // Block Players Tooltip
    "blockPlayers.top5": "Top 5 Spieler",
    "blockPlayers.noData": "Keine Spielerdaten",

    // Fun Facts
    "funFacts.title": "Fun Facts",

    // Carousel
    "carousel.dashboardSubtitle": "Sieh deine aktivsten Spieler und Statistiken",
    "carousel.compareSubtitle": "1v1 — wer ist der größte Block-Süchtige?",
    "carousel.blockIndexSubtitle": "Sieh die beliebtesten Blöcke deiner Spieler",
    "carousel.profilesSubtitle": "Verfolge einzelne Spieler und ihre Stats",

    // Donut Charts
    "donuts.materialCategories": "Material-Kategorien",
    "donuts.worldDistribution": "Welt-Verteilung",
    "donuts.nature": "Natur",
    "donuts.building": "Bau",
    "donuts.tech": "Technik",
    "donuts.nether": "Nether",
    "donuts.end": "End",
    "donuts.overworld": "Oberwelt",
    "donuts.other": "Sonstige",
    "donuts.noData": "Keine Daten verfügbar",
  },
};

const LanguageContext = createContext({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch { /* ignore */ }
  }, [lang]);

  const setLang = useCallback((l) => setLangState(l), []);
  const t = useCallback((key) => translations[lang]?.[key] ?? translations.en[key] ?? key, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(LanguageContext);
  return ctx.t;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  return { lang: ctx.lang, setLang: ctx.setLang };
}