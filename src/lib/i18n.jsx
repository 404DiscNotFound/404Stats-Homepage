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
    "landing.nav.about": "About",
    "landing.nav.discord": "Discord",
    "landing.nav.download": "Download",
    "landing.hero.badge": "Local Minecraft block analytics",
    "landing.hero.title1": "Every block.",
    "landing.hero.title2": "Every stat.",
    "landing.hero.desc": "404Stats tracks every block your players mine and place — then serves a beautiful web panel right from your Minecraft server. No cloud, no accounts, no external databases.",
    "landing.hero.getPlugin": "Get 404Stats",
    "landing.hero.howItWorks": "See how it works",
    "landing.hero.discord": "Join Discord",
    "landing.stats.local": "100% Local",
    "landing.stats.localDesc": "Runs on your server",
    "landing.stats.free": "Free",
    "landing.stats.freeDesc": "Non-profit project",
    "landing.stats.zeroCloud": "Zero Cloud",
    "landing.stats.zeroCloudDesc": "Your data stays home",
    "landing.bstats.servers": "Servers running 404Stats",
    "landing.bstats.players": "Players tracked",
    "landing.features.title": "Everything your server needs",
    "landing.features.desc": "Powerful analytics, beautiful design, fully local",
    "landing.features.blockTracking": "Block Tracking",
    "landing.features.blockTrackingDesc": "Tracks every mined and placed block — by player, material, world, and game mode.",
    "landing.features.webPanel": "Built-in Web Panel",
    "landing.features.webPanelDesc": "A full dashboard, player profiles, block index, and project pages — hosted right on your server.",
    "landing.features.projectMode": "Project Mode",
    "landing.features.projectModeDesc": "Players create community projects with dedicated stats pages, member tracking, and leaderboards.",
    "landing.features.bossbar": "Live BossBar",
    "landing.features.bossbarDesc": "In-game stats display — see your mined, placed, and ratio without opening a menu.",
    "landing.features.placeholder": "PlaceholderAPI",
    "landing.features.placeholderDesc": "Drop stats and leaderboards into any scoreboard, hologram, or tab list.",
    "landing.features.privacy": "Privacy-First",
    "landing.features.privacyDesc": "Everything stays on your server. Only anonymous bStats metrics, no third-party widgets, no cloud.",
    "landing.features.gameModes": "Game Mode Filter",
    "landing.features.gameModesDesc": "Filter by Survival, Creative, or All — fair rankings for every playstyle.",
    "landing.features.achievements": "Achievements",
    "landing.features.achievementsDesc": "20+ unlockable milestones with exact unlock dates — from first block to 1M blocks.",
    "landing.features.share": "Privacy-Friendly Sharing",
    "landing.features.shareDesc": "Share buttons without embedded social media scripts or tracking.",
    "landing.carousel.slide1": "Server Dashboard",
    "landing.carousel.slide2": "Player Compare",
    "landing.carousel.slide3": "Block Index",
    "landing.carousel.slide4": "Player Profiles",
    "landing.how.title": "Up in 3 steps",
    "landing.how.desc": "Drop it in, restart, explore. That's it.",
    "landing.how.step1Title": "Install",
    "landing.how.step1Desc": "Drop the 404Stats plugin JAR into your server's plugins folder.",
    "landing.how.step2Title": "Restart",
    "landing.how.step2Desc": "Restart your server — the web panel starts automatically.",
    "landing.how.step3Title": "Explore",
    "landing.how.step3Desc": "Open the panel URL and explore your live block analytics.",
    "landing.commands.title": "Simple commands",
    "landing.commands.desc": "Everything accessible in-game",
    "landing.commands.me": "/404stats me",
    "landing.commands.meDesc": "See your own stats",
    "landing.commands.bossbar": "/404stats bossbar",
    "landing.commands.bossbarDesc": "Toggle the live BossBar",
    "landing.commands.project": "/404stats project add <name>",
    "landing.commands.projectDesc": "Create a community project",
    "landing.commands.panel": "/404stats panel",
    "landing.commands.panelDesc": "Get your web panel URL",
    "landing.community.title": "Built by the community, for the community",
    "landing.community.desc": "404Stats is a non-profit project by 404GameNotFound — a German gaming community. Created out of personal need, shared with everyone.",
    "landing.cta.title": "Ready to track every block?",
    "landing.cta.desc": "Install 404Stats and give your players the stats they deserve.",
    "landing.cta.download": "Get 404Stats",
    "landing.cta.discord": "Join Discord",
    "landing.footer.desc": "Local block analytics for Minecraft servers",
    "landing.footer.terms": "Terms",
    "landing.footer.privacy": "Privacy",
    "landing.footer.about": "About",
    "about.title": "About 404Stats",
    "about.creator": "Created by 404DiscNotFound",
    "about.community": "404GameNotFound Community",
    "about.communityDesc": "A German gaming community",
    "about.desc": "404Stats is a non-profit project built out of personal need and shared with the community. Everything runs locally on your Minecraft server — no cloud, no external databases, no accounts.",
    "about.links": "Links",
    "about.privacy": "Privacy",
    "about.privacyDesc": "404Stats stores Minecraft statistics locally on your server. The web panel does not use embedded third-party widgets. bStats is used for anonymous plugin metrics only.",

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
    "donuts.yourShare": "Your share",
    "donuts.you": "You",
    "donuts.serverTotal": "Server total",
    "customizer.button": "Customize",
    "customizer.title": "Customize Dashboard",
    "customizer.hint": "Toggle cards on/off and drag to reorder. Your layout is saved in this browser.",
    "customizer.reset": "Reset",
    "customizer.done": "Done",
    "customizer.visible": "Visible",
    "customizer.hidden": "Hidden",
    "customizer.card.donuts": "Category & World Donuts",
    "customizer.card.funFacts": "Fun Facts",
    "customizer.card.trends": "Server Trends",
    "customizer.card.topBlocks": "Top Blocks",
    "customizer.card.leaderboards": "Leaderboards",
    "customizer.card.rareBlocks": "Rare Blocks",
    "customizer.card.achievements": "Achievements",

    // Projects
    "projects.title": "Projects",
    "projects.subtitle": "Community builds tracked through Project Mode",
    "projects.button": "Projects",
    "projects.empty": "No active projects yet. Projects are created from the Minecraft plugin.",
    "projects.members": "Members",
    "projects.totalBlocks": "Total Blocks",
    "projects.netBuildGain": "Net Build Gain",
    "projects.topContributor": "Top Contributor",
    "projects.topBlock": "Top Block",
    "projects.lastActivity": "Last Activity",
    "projects.mined": "Mined",
    "projects.placed": "Placed",
    "projects.viewProject": "View Project",
    "projects.contributors": "Contributors",
    "projects.topBlocks": "Top Blocks",
    "projects.timeline": "Activity Timeline",
    "projects.achievements": "Achievements",
    "projects.overview": "Overview",
    "projects.backToProjects": "← Back to Projects",
    "projects.noProjectData": "No data for this project yet.",
    "projects.projectNotFound": "Project not found",
    "projects.allWorlds": "All Worlds",
    "projects.timeRange.day": "Day",
    "projects.timeRange.week": "Week",
    "projects.timeRange.month": "Month",
    "projects.timeRange.year": "Year",
    "projects.timeRange.all": "All Time",
    "projects.createdBy": "Created by",
    "projects.createdAt": "Created",
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
    "landing.nav.about": "Über",
    "landing.nav.discord": "Discord",
    "landing.nav.download": "Download",
    "landing.hero.badge": "Lokale Minecraft-Block-Analytik",
    "landing.hero.title1": "Jeder Block.",
    "landing.hero.title2": "Jede Stat.",
    "landing.hero.desc": "404Stats trackt jeden Block, den deine Spieler abbauen und bauen — und liefert ein wunderschönes Web-Panel direkt von deinem Minecraft-Server. Keine Cloud, keine Accounts, keine externe Datenbank.",
    "landing.hero.getPlugin": "404Stats holen",
    "landing.hero.howItWorks": "So funktioniert's",
    "landing.hero.discord": "Discord beitreten",
    "landing.stats.local": "100% Lokal",
    "landing.stats.localDesc": "Läuft auf deinem Server",
    "landing.stats.free": "Kostenlos",
    "landing.stats.freeDesc": "Non-Profit-Projekt",
    "landing.stats.zeroCloud": "Ohne Cloud",
    "landing.stats.zeroCloudDesc": "Deine Daten bleiben da",
    "landing.bstats.servers": "Server mit 404Stats",
    "landing.bstats.players": "Spieler getrackt",
    "landing.features.title": "Alles, was dein Server braucht",
    "landing.features.desc": "Starke Analytik, schönes Design, komplett lokal",
    "landing.features.blockTracking": "Block-Tracking",
    "landing.features.blockTrackingDesc": "Trackt jeden abgebauten und gebauten Block — nach Spieler, Material, Welt und Spielmodus.",
    "landing.features.webPanel": "Eingebautes Web-Panel",
    "landing.features.webPanelDesc": "Ein vollständiges Dashboard, Spieler-Profile, Block-Index und Projekt-Seiten — direkt auf deinem Server gehostet.",
    "landing.features.projectMode": "Projekt-Modus",
    "landing.features.projectModeDesc": "Spieler erstellen Community-Projekte mit eigenen Stats-Seiten, Mitglieder-Tracking und Leaderboards.",
    "landing.features.bossbar": "Live BossBar",
    "landing.features.bossbarDesc": "In-Game Stats-Anzeige — sieh deine abgebauten, gebauten Blöcke und dein Verhältnis ohne Menü.",
    "landing.features.placeholder": "PlaceholderAPI",
    "landing.features.placeholderDesc": "Stats und Leaderboards in jedes Scoreboard, Hologramm oder Tab-Liste einbinden.",
    "landing.features.privacy": "Datenschutz zuerst",
    "landing.features.privacyDesc": "Alles bleibt auf deinem Server. Nur anonyme bStats-Metriken, keine Drittanbieter-Widgets, keine Cloud.",
    "landing.features.gameModes": "Spielmodus-Filter",
    "landing.features.gameModesDesc": "Filtere nach Survival, Creative oder Alle — faire Ranglisten für jeden Spielstil.",
    "landing.features.achievements": "Achievements",
    "landing.features.achievementsDesc": "20+ freischaltbare Meilensteine mit genauen Daten — vom ersten Block bis 1M Blöcke.",
    "landing.features.share": "Datenschutz-freundliches Teilen",
    "landing.features.shareDesc": "Teilen-Buttons ohne eingebettete Social-Media-Scripts oder Tracking.",
    "landing.carousel.slide1": "Server-Dashboard",
    "landing.carousel.slide2": "Spieler-Vergleich",
    "landing.carousel.slide3": "Block-Index",
    "landing.carousel.slide4": "Spieler-Profile",
    "landing.how.title": "In 3 Schritten startklar",
    "landing.how.desc": "Reinwerfen, Neustart, Entdecken. Das war's.",
    "landing.how.step1Title": "Installieren",
    "landing.how.step1Desc": "Lege die 404Stats-Plugin-JAR in den Plugins-Ordner deines Servers.",
    "landing.how.step2Title": "Neustart",
    "landing.how.step2Desc": "Starte deinen Server neu — das Web-Panel startet automatisch.",
    "landing.how.step3Title": "Entdecken",
    "landing.how.step3Desc": "Öffne die Panel-URL und entdecke deine Live-Block-Analytik.",
    "landing.commands.title": "Einfache Befehle",
    "landing.commands.desc": "Alles In-Game erreichbar",
    "landing.commands.me": "/404stats me",
    "landing.commands.meDesc": "Sieh deine eigenen Stats",
    "landing.commands.bossbar": "/404stats bossbar",
    "landing.commands.bossbarDesc": "Live BossBar ein-/ausschalten",
    "landing.commands.project": "/404stats project add <Name>",
    "landing.commands.projectDesc": "Projekt erstellen",
    "landing.commands.panel": "/404stats panel",
    "landing.commands.panelDesc": "Web-Panel-URL anzeigen",
    "landing.community.title": "Von der Community, für die Community",
    "landing.community.desc": "404Stats ist ein Non-Profit-Projekt von 404GameNotFound — einer deutschen Gaming-Community. Aus persönlichem Bedarf erstellt, mit allen geteilt.",
    "landing.cta.title": "Bereit, jeden Block zu tracken?",
    "landing.cta.desc": "Installiere 404Stats und gib deinen Spielern die Stats, die sie verdienen.",
    "landing.cta.download": "404Stats holen",
    "landing.cta.discord": "Discord beitreten",
    "landing.footer.desc": "Lokale Block-Analytik für Minecraft-Server",
    "landing.footer.terms": "AGB",
    "landing.footer.privacy": "Datenschutz",
    "landing.footer.about": "Über",
    "about.title": "Über 404Stats",
    "about.creator": "Erstellt von 404DiscNotFound",
    "about.community": "404GameNotFound Community",
    "about.communityDesc": "Eine deutsche Gaming-Community",
    "about.desc": "404Stats ist ein Non-Profit-Projekt, das aus persönlichem Bedarf entstanden ist und mit der Community geteilt wird. Alles läuft lokal auf deinem Minecraft-Server — keine Cloud, keine externe Datenbank, keine Accounts.",
    "about.links": "Links",
    "about.privacy": "Datenschutz",
    "about.privacyDesc": "404Stats speichert Minecraft-Statistiken lokal auf deinem Server. Das Web-Panel verwendet keine eingebetteten Drittanbieter-Widgets. bStats wird nur für anonyme Plugin-Metriken verwendet.",

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
    "donuts.yourShare": "Dein Anteil",
    "donuts.you": "Du",
    "donuts.serverTotal": "Server gesamt",
    "customizer.button": "Anpassen",
    "customizer.title": "Dashboard anpassen",
    "customizer.hint": "Karten ein-/ausblenden und per Drag sortieren. Dein Layout wird in diesem Browser gespeichert.",
    "customizer.reset": "Zurücksetzen",
    "customizer.done": "Fertig",
    "customizer.visible": "Sichtbar",
    "customizer.hidden": "Ausgeblendet",
    "customizer.card.donuts": "Kategorien & Welten Donuts",
    "customizer.card.funFacts": "Fun Facts",
    "customizer.card.trends": "Server Trends",
    "customizer.card.topBlocks": "Top Blöcke",
    "customizer.card.leaderboards": "Bestenlisten",
    "customizer.card.rareBlocks": "Seltene Blöcke",
    "customizer.card.achievements": "Errungenschaften",

    // Projects
    "projects.title": "Projekte",
    "projects.subtitle": "Community-Bauten verfolgt über den Projekt-Modus",
    "projects.button": "Projekte",
    "projects.empty": "Noch keine aktiven Projekte. Projekte werden über das Minecraft-Plugin erstellt.",
    "projects.members": "Mitglieder",
    "projects.totalBlocks": "Blöcke gesamt",
    "projects.netBuildGain": "Netto-Bauzuwachs",
    "projects.topContributor": "Top-Mitwirkender",
    "projects.topBlock": "Top-Block",
    "projects.lastActivity": "Letzte Aktivität",
    "projects.mined": "Abgebaut",
    "projects.placed": "Gebaut",
    "projects.viewProject": "Projekt ansehen",
    "projects.contributors": "Mitwirkende",
    "projects.topBlocks": "Top-Blöcke",
    "projects.timeline": "Aktivitäts-Zeitleiste",
    "projects.achievements": "Errungenschaften",
    "projects.overview": "Überblick",
    "projects.backToProjects": "← Zurück zu Projekten",
    "projects.noProjectData": "Noch keine Daten für dieses Projekt.",
    "projects.projectNotFound": "Projekt nicht gefunden",
    "projects.allWorlds": "Alle Welten",
    "projects.timeRange.day": "Tag",
    "projects.timeRange.week": "Woche",
    "projects.timeRange.month": "Monat",
    "projects.timeRange.year": "Jahr",
    "projects.timeRange.all": "Gesamt",
    "projects.createdBy": "Erstellt von",
    "projects.createdAt": "Erstellt",
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