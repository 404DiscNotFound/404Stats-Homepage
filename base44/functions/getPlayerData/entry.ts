import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

async function sha256(text) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const RARE_MATERIALS = [
  'DIAMOND_ORE', 'DEEPSLATE_DIAMOND_ORE',
  'EMERALD_ORE', 'DEEPSLATE_EMERALD_ORE',
  'ANCIENT_DEBRIS',
  'GOLD_ORE', 'DEEPSLATE_GOLD_ORE',
  'NETHERITE_BLOCK', 'BEACON', 'CONDUIT',
  'ENDER_CHEST', 'END_PORTAL_FRAME',
  'DRAGON_EGG', 'SPAWNER', 'SHULKER_BOX'
];

const VALID_RANGES = ['all', 'day', 'week', 'month', 'year'];

function getMaterialCategory(material) {
  const m = (material || '').toUpperCase();
  if (!m) return 'nature';
  if (m.startsWith('NETHER_') || m.startsWith('CRIMSON_') || m.startsWith('WARPED_') || m.startsWith('SOUL_') ||
      ['NETHERRACK', 'GLOWSTONE', 'BASALT', 'SMOOTH_BASALT', 'POLISHED_BASALT', 'BLACKSTONE', 'GILDED_BLACKSTONE',
       'MAGMA_BLOCK', 'ANCIENT_DEBRIS', 'NETHERITE_BLOCK', 'RESPAWN_ANCHOR', 'LODESTONE', 'CRYING_OBSIDIAN',
       'SHROOMLIGHT'].includes(m)) return 'nether';
  if (m.startsWith('END_') || m.startsWith('PURPUR_') || m.startsWith('CHORUS_') ||
      ['DRAGON_EGG', 'ENDER_CHEST'].includes(m)) return 'end';
  if (m.startsWith('REDSTONE_') ||
      ['REPEATER', 'COMPARATOR', 'PISTON', 'STICKY_PISTON', 'OBSERVER', 'DISPENSER', 'DROPPER', 'HOPPER',
       'DAYLIGHT_DETECTOR', 'TARGET', 'LEVER', 'NOTE_BLOCK', 'JUKEBOX', 'CRAFTING_TABLE', 'FURNACE',
       'BLAST_FURNACE', 'SMOKER', 'ANVIL', 'CHIPPED_ANVIL', 'DAMAGED_ANVIL', 'GRINDSTONE', 'STONECUTTER',
       'LOOM', 'SMITHING_TABLE', 'CARTOGRAPHY_TABLE', 'FLETCHING_TABLE', 'BREWING_STAND', 'CAULDRON',
       'COMPOSTER', 'BARREL', 'LECTERN', 'BELL', 'LIGHTNING_ROD', 'TRAPPED_CHEST', 'CHEST', 'SHULKER_BOX',
       'ENCHANTING_TABLE', 'BEACON', 'CONDUIT', 'SPAWNER', 'SCAFFOLDING', 'HONEY_BLOCK', 'SLIME_BLOCK',
       'TNT', 'TRIPWIRE_HOOK', 'TRIPWIRE'].includes(m) ||
      m.endsWith('_BUTTON') || m.endsWith('_PRESSURE_PLATE') || m.endsWith('_FENCE_GATE')) return 'tech';
  if (['GLASS', 'TINTED_GLASS', 'GLASS_PANE', 'STONE_BRICKS', 'MOSSY_STONE_BRICKS', 'CRACKED_STONE_BRICKS',
       'CHISELED_STONE_BRICKS', 'BRICKS', 'QUARTZ_BLOCK', 'SANDSTONE', 'RED_SANDSTONE', 'SMOOTH_SANDSTONE',
       'CUT_SANDSTONE', 'CHISELED_SANDSTONE', 'CUT_RED_SANDSTONE', 'SMOOTH_RED_SANDSTONE', 'TERRACOTTA',
       'IRON_BLOCK', 'GOLD_BLOCK', 'DIAMOND_BLOCK', 'EMERALD_BLOCK', 'LAPIS_BLOCK', 'COAL_BLOCK',
       'SMOOTH_STONE', 'PRISMARINE', 'PRISMARINE_BRICKS', 'DARK_PRISMARINE', 'SEA_LANTERN',
       'BONE_BLOCK', 'OBSIDIAN'].includes(m) ||
      m.endsWith('_STAINED_GLASS') || m.endsWith('_STAINED_GLASS_PANE') ||
      m.endsWith('_CONCRETE') || m.endsWith('_CONCRETE_POWDER') ||
      m.endsWith('_WOOL') || m.endsWith('_CARPET') ||
      m.endsWith('_GLAZED_TERRACOTTA') ||
      m.endsWith('_PLANKS') || m.endsWith('_SLAB') || m.endsWith('_STAIRS') || m.endsWith('_FENCE') ||
      m.endsWith('_WALL') || m.endsWith('_DOOR') || m.endsWith('_TRAPDOOR') || m.endsWith('_SIGN') ||
      m.endsWith('_BANNER') || m.endsWith('_BED') ||
      m.startsWith('QUARTZ_') ||
      (m.includes('COPPER') && !m.includes('ORE')) ||
      m.startsWith('WAXED_')) return 'building';
  return 'nature';
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { slug, playerName, range = 'all', game_mode } = body;

    // Sanitize all inputs — must be strings with length limits
    if (typeof slug !== 'string' || slug.length === 0 || slug.length > 32) {
      return Response.json({ error: 'Invalid slug' }, { status: 400 });
    }
    if (typeof playerName !== 'string' || playerName.length === 0 || playerName.length > 32) {
      return Response.json({ error: 'Invalid playerName' }, { status: 400 });
    }
    if (typeof range !== 'string' || !VALID_RANGES.includes(range)) {
      return Response.json({ error: 'Invalid range' }, { status: 400 });
    }

    const gameMode = (typeof game_mode === 'string' && game_mode.length > 0) ? game_mode.toUpperCase() : 'SURVIVAL';

    const base44 = createClientFromRequest(req);

    // Public read — data is intentionally public (RLS: read=true), service role needed for anonymous access
    const servers = await base44.asServiceRole.entities.Server.filter({ server_slug: slug });
    if (!servers || servers.length === 0) {
      return Response.json({ error: 'Server nicht gefunden' }, { status: 404 });
    }
    const server = servers[0];

    if (server.webpanel_password_enabled) {
      const token = body.access_token;
      if (!token) return Response.json({ error: 'Password required', password_required: true }, { status: 403 });
      const expectedToken = await sha256(server.server_slug + ':' + (server.webpanel_password_hash || '') + ':' + server.id);
      if (token !== expectedToken) return Response.json({ error: 'Invalid token', password_required: true }, { status: 403 });
    }

    // Always fetch all-time BlockStat for achievements + rare blocks
    const allTimeStats = await base44.asServiceRole.entities.BlockStat.filter(
      { server_id: server.id }, '-created_date', 10000
    );

    // Compute time-filtered stats
    let rangeStats;
    if (range === 'all') {
      rangeStats = allTimeStats;
    } else {
      const now = new Date();
      const berlinFmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' });
      let startDate;
      if (range === 'day') startDate = berlinFmt.format(now);
      else if (range === 'week') startDate = berlinFmt.format(new Date(now.getTime() - 7 * 86400000));
      else if (range === 'month') startDate = berlinFmt.format(new Date(now.getTime() - 30 * 86400000));
      else if (range === 'year') startDate = berlinFmt.format(new Date(now.getTime() - 365 * 86400000));
      else startDate = berlinFmt.format(now);

      rangeStats = await base44.asServiceRole.entities.DailyBlockStat.filter(
        { server_id: server.id, date: { $gte: startDate } }, '-created_date', 10000
      );
    }

    // Build player maps for range data
    const playerMap = {};
    const playerGameModeMap = {};
    const targetLower = playerName.toLowerCase();
    const targetCategoryMap = {};
    const targetWorldMap = {};
    for (const stat of rangeStats) {
      const gm = stat.game_mode || 'SURVIVAL';

      // Per-player game mode breakdown (always from all data)
      if (!playerGameModeMap[stat.uuid]) playerGameModeMap[stat.uuid] = {};
      if (!playerGameModeMap[stat.uuid][gm]) playerGameModeMap[stat.uuid][gm] = { game_mode: gm, mined: 0, placed: 0, total: 0 };
      playerGameModeMap[stat.uuid][gm].mined += stat.mined || 0;
      playerGameModeMap[stat.uuid][gm].placed += stat.placed || 0;
      playerGameModeMap[stat.uuid][gm].total += (stat.mined || 0) + (stat.placed || 0);

      // Skip stats not matching the game mode filter
      if (gameMode !== 'ALL' && gm !== gameMode) continue;

      if (!playerMap[stat.uuid]) {
        playerMap[stat.uuid] = { uuid: stat.uuid, player_name: stat.player_name, mined: 0, placed: 0, materials: [] };
      }
      playerMap[stat.uuid].mined += (stat.mined || 0);
      playerMap[stat.uuid].placed += (stat.placed || 0);
      playerMap[stat.uuid].materials.push({ material: stat.material, mined: stat.mined || 0, placed: stat.placed || 0 });

      if (stat.player_name.toLowerCase() === targetLower) {
        const cat = getMaterialCategory(stat.material);
        if (!targetCategoryMap[cat]) targetCategoryMap[cat] = { mined: 0, placed: 0, total: 0 };
        targetCategoryMap[cat].mined += stat.mined || 0;
        targetCategoryMap[cat].placed += stat.placed || 0;
        targetCategoryMap[cat].total += (stat.mined || 0) + (stat.placed || 0);

        const wn = stat.world_name || 'world';
        if (!targetWorldMap[wn]) targetWorldMap[wn] = { mined: 0, placed: 0, total: 0 };
        targetWorldMap[wn].mined += stat.mined || 0;
        targetWorldMap[wn].placed += stat.placed || 0;
        targetWorldMap[wn].total += (stat.mined || 0) + (stat.placed || 0);
      }
    }

    const allPlayers = Object.values(playerMap).map(p => ({ ...p, total: p.mined + p.placed }));
    const targetPlayer = allPlayers.find(p => p.player_name.toLowerCase() === playerName.toLowerCase());

    if (!targetPlayer) {
      return Response.json({ error: 'Spieler nicht gefunden' }, { status: 404 });
    }

    const sortedPlayers = allPlayers.sort((a, b) => b.total - a.total);
    const rank = sortedPlayers.findIndex(p => p.uuid === targetPlayer.uuid) + 1;

    // Merge materials for time-filtered top blocks
    const materialMap = {};
    for (const m of targetPlayer.materials) {
      if (!materialMap[m.material]) materialMap[m.material] = { material: m.material, mined: 0, placed: 0 };
      materialMap[m.material].mined += m.mined;
      materialMap[m.material].placed += m.placed;
    }
    // Compute server-wide totals per material (for player share %)
    const serverMaterialTotals = {};
    for (const stat of rangeStats) {
      if (!serverMaterialTotals[stat.material]) serverMaterialTotals[stat.material] = { mined: 0, placed: 0, total: 0 };
      serverMaterialTotals[stat.material].mined += stat.mined || 0;
      serverMaterialTotals[stat.material].placed += stat.placed || 0;
      serverMaterialTotals[stat.material].total += (stat.mined || 0) + (stat.placed || 0);
    }

    const topMaterials = Object.values(materialMap)
      .map(m => {
        const svTotal = serverMaterialTotals[m.material] || { total: m.total };
        return {
          ...m,
          total: m.mined + m.placed,
          serverTotal: svTotal.total,
          serverMined: svTotal.mined,
          serverPlaced: svTotal.placed,
          sharePct: svTotal.total > 0 ? Math.round(((m.mined + m.placed) / svTotal.total) * 100) : 100
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Compute all-time totals per mode (survival vs creative)
    const allTimeSurvival = { mined: 0, placed: 0, materials: {} };
    const allTimeCreative = { mined: 0, placed: 0, materials: {} };
    const materialSetS = new Set();
    const materialSetC = new Set();
    for (const stat of allTimeStats) {
      if (stat.player_name.toLowerCase() !== playerName.toLowerCase()) continue;
      const gm = stat.game_mode || 'SURVIVAL';
      const isCreative = gm === 'CREATIVE';
      const bucket = isCreative ? allTimeCreative : allTimeSurvival;
      const matSet = isCreative ? materialSetC : materialSetS;
      bucket.mined += (stat.mined || 0);
      bucket.placed += (stat.placed || 0);
      matSet.add(stat.material);
      if (!bucket.materials[stat.material]) bucket.materials[stat.material] = { mined: 0, placed: 0 };
      bucket.materials[stat.material].mined += (stat.mined || 0);
      bucket.materials[stat.material].placed += (stat.placed || 0);
    }

    // For rare blocks — combine based on game mode filter
    const allTimePlayer = gameMode === 'CREATIVE' ? allTimeCreative
      : gameMode === 'SURVIVAL' ? allTimeSurvival
      : {
          mined: allTimeSurvival.mined + allTimeCreative.mined,
          placed: allTimeSurvival.placed + allTimeCreative.placed,
          materials: { ...allTimeSurvival.materials },
        };
    if (gameMode === 'ALL') {
      for (const [mat, data] of Object.entries(allTimeCreative.materials)) {
        if (!allTimePlayer.materials[mat]) allTimePlayer.materials[mat] = { mined: 0, placed: 0 };
        allTimePlayer.materials[mat].mined += data.mined;
        allTimePlayer.materials[mat].placed += data.placed;
      }
    }
    const hasMat = (names) => names.some(n => allTimePlayer.materials[n]);

    // Fetch daily stats for this player to compute achievement unlock dates
    const playerDaily = await base44.asServiceRole.entities.DailyBlockStat.filter(
      { server_id: server.id, uuid: targetPlayer.uuid }, 'date', 10000
    );

    // Track milestones per mode separately
    const milestonesS = {};
    const milestonesC = {};
    let cumMinedS = 0, cumPlacedS = 0, cumTotalS = 0;
    let cumMinedC = 0, cumPlacedC = 0, cumTotalC = 0;
    const materialFirstSeenS = {};
    const materialFirstSeenC = {};
    const seenMatsS = new Set();
    const seenMatsC = new Set();

    for (const ds of playerDaily) {
      const dsGm = ds.game_mode || 'SURVIVAL';
      const isCreative = dsGm === 'CREATIVE';
      const ms = isCreative ? milestonesC : milestonesS;
      const seenMats = isCreative ? seenMatsC : seenMatsS;
      const materialFirstSeen = isCreative ? materialFirstSeenC : materialFirstSeenS;
      const ts = ds.created_date || ds.date;

      if (isCreative) {
        cumMinedC += ds.mined || 0;
        cumPlacedC += ds.placed || 0;
        cumTotalC = cumMinedC + cumPlacedC;
      } else {
        cumMinedS += ds.mined || 0;
        cumPlacedS += ds.placed || 0;
        cumTotalS = cumMinedS + cumPlacedS;
      }
      const cumMined = isCreative ? cumMinedC : cumMinedS;
      const cumPlaced = isCreative ? cumPlacedC : cumPlacedS;
      const cumTotal = isCreative ? cumTotalC : cumTotalS;

      if (!seenMats.has(ds.material)) {
        seenMats.add(ds.material);
        ms[`variety_${seenMats.size}`] = ts;
      }
      if (!materialFirstSeen[ds.material]) materialFirstSeen[ds.material] = ts;

      if (cumTotal >= 1 && !ms['first_block']) ms['first_block'] = ts;

      if (!isCreative) {
        const checks = [
          ['miner_100', cumMined, 100], ['miner_1k', cumMined, 1000], ['miner_10k', cumMined, 10000], ['miner_100k', cumMined, 100000],
          ['builder_100', cumPlaced, 100], ['builder_1k', cumPlaced, 1000], ['builder_10k', cumPlaced, 10000], ['builder_100k', cumPlaced, 100000],
          ['total_1k', cumTotal, 1000], ['total_10k', cumTotal, 10000], ['total_100k', cumTotal, 100000], ['total_1m', cumTotal, 1000000],
        ];
        for (const [id, val, thresh] of checks) {
          if (val >= thresh && !ms[id]) ms[id] = ts;
        }
      } else {
        const checks = [
          ['cre_builder_1k', cumPlaced, 1000], ['cre_builder_10k', cumPlaced, 10000], ['cre_builder_50k', cumPlaced, 50000], ['cre_builder_100k', cumPlaced, 100000], ['cre_builder_500k', cumPlaced, 500000],
          ['cre_total_10k', cumTotal, 10000], ['cre_total_100k', cumTotal, 100000], ['cre_total_500k', cumTotal, 500000], ['cre_total_1m', cumTotal, 1000000],
        ];
        for (const [id, val, thresh] of checks) {
          if (val >= thresh && !ms[id]) ms[id] = ts;
        }
      }
    }

    // Survival material-based achievement dates
    const survivalMatAch = {
      diamond: ['DIAMOND_ORE', 'DEEPSLATE_DIAMOND_ORE'],
      emerald: ['EMERALD_ORE', 'DEEPSLATE_EMERALD_ORE'],
      netherite: ['ANCIENT_DEBRIS'],
      gold: ['GOLD_ORE', 'DEEPSLATE_GOLD_ORE'],
    };
    for (const [id, mats] of Object.entries(survivalMatAch)) {
      for (const m of mats) {
        if (materialFirstSeenS[m]) { milestonesS[id] = materialFirstSeenS[m]; break; }
      }
    }

    // Creative special-block achievement dates
    const creativeMatAch = {
      cre_beacon: ['BEACON'],
      cre_conduit: ['CONDUIT'],
      cre_dragon_egg: ['DRAGON_EGG'],
      cre_spawner: ['SPAWNER'],
      cre_ender_chest: ['ENDER_CHEST'],
    };
    for (const [id, mats] of Object.entries(creativeMatAch)) {
      for (const m of mats) {
        if (materialFirstSeenC[m]) { milestonesC[id] = materialFirstSeenC[m]; break; }
      }
    }

    const buildSurvivalAchievements = () => {
      const total = allTimeSurvival.mined + allTimeSurvival.placed;
      const hasMatS = (names) => names.some(n => allTimeSurvival.materials[n]);
      return [
        { id: 'first_block', name: 'Erster Block', desc: 'Interagiere mit 1 Block', icon: '🧱', unlocked: total >= 1, unlocked_date: milestonesS['first_block'] || null },
        { id: 'miner_100', name: 'Steinbrucharbeiter', desc: '100 Blöcke abgebaut', icon: '⛏', unlocked: allTimeSurvival.mined >= 100, unlocked_date: milestonesS['miner_100'] || null },
        { id: 'miner_1k', name: 'Bergmann', desc: '1.000 Blöcke abgebaut', icon: '⛏', unlocked: allTimeSurvival.mined >= 1000, unlocked_date: milestonesS['miner_1k'] || null },
        { id: 'miner_10k', name: 'Meisterbergmann', desc: '10.000 Blöcke abgebaut', icon: '⛏', unlocked: allTimeSurvival.mined >= 10000, unlocked_date: milestonesS['miner_10k'] || null },
        { id: 'miner_100k', name: 'Legendärer Bergmann', desc: '100.000 Blöcke abgebaut', icon: '⛏', unlocked: allTimeSurvival.mined >= 100000, unlocked_date: milestonesS['miner_100k'] || null },
        { id: 'builder_100', name: 'Baumeister', desc: '100 Blöcke gesetzt', icon: '🏗', unlocked: allTimeSurvival.placed >= 100, unlocked_date: milestonesS['builder_100'] || null },
        { id: 'builder_1k', name: 'Architekt', desc: '1.000 Blöcke gesetzt', icon: '🏗', unlocked: allTimeSurvival.placed >= 1000, unlocked_date: milestonesS['builder_1k'] || null },
        { id: 'builder_10k', name: 'Master Builder', desc: '10.000 Blöcke gesetzt', icon: '🏗', unlocked: allTimeSurvival.placed >= 10000, unlocked_date: milestonesS['builder_10k'] || null },
        { id: 'builder_100k', name: 'Legendärer Builder', desc: '100.000 Blöcke gesetzt', icon: '🏗', unlocked: allTimeSurvival.placed >= 100000, unlocked_date: milestonesS['builder_100k'] || null },
        { id: 'total_1k', name: 'Fleißig', desc: '1.000 Blöcke gesamt', icon: '📊', unlocked: total >= 1000, unlocked_date: milestonesS['total_1k'] || null },
        { id: 'total_10k', name: 'Aktiv', desc: '10.000 Blöcke gesamt', icon: '📊', unlocked: total >= 10000, unlocked_date: milestonesS['total_10k'] || null },
        { id: 'total_100k', name: 'Besessen', desc: '100.000 Blöcke gesamt', icon: '🔥', unlocked: total >= 100000, unlocked_date: milestonesS['total_100k'] || null },
        { id: 'total_1m', name: 'Maschine', desc: '1.000.000 Blöcke gesamt', icon: '🤖', unlocked: total >= 1000000, unlocked_date: milestonesS['total_1m'] || null },
        { id: 'diamond', name: 'Diamantenjäger', desc: 'Diamanterz abgebaut', icon: '💎', unlocked: hasMatS(['DIAMOND_ORE', 'DEEPSLATE_DIAMOND_ORE']), unlocked_date: milestonesS['diamond'] || null },
        { id: 'emerald', name: 'Smaragdjäger', desc: 'Smaragderz abgebaut', icon: '💚', unlocked: hasMatS(['EMERALD_ORE', 'DEEPSLATE_EMERALD_ORE']), unlocked_date: milestonesS['emerald'] || null },
        { id: 'netherite', name: 'Netheritjäger', desc: 'Ancient Debris abgebaut', icon: '🔥', unlocked: hasMatS(['ANCIENT_DEBRIS']), unlocked_date: milestonesS['netherite'] || null },
        { id: 'gold', name: 'Goldsucher', desc: 'Golderz abgebaut', icon: '🟡', unlocked: hasMatS(['GOLD_ORE', 'DEEPSLATE_GOLD_ORE']), unlocked_date: milestonesS['gold'] || null },
        { id: 'variety_10', name: 'Sammler', desc: '10 verschiedene Blöcke', icon: '🌈', unlocked: materialSetS.size >= 10, unlocked_date: milestonesS['variety_10'] || null },
        { id: 'variety_50', name: 'Allrounder', desc: '50 verschiedene Blöcke', icon: '🎨', unlocked: materialSetS.size >= 50, unlocked_date: milestonesS['variety_50'] || null },
        { id: 'variety_100', name: 'Enzyklopädie', desc: '100 verschiedene Blöcke', icon: '📚', unlocked: materialSetS.size >= 100, unlocked_date: milestonesS['variety_100'] || null },
      ];
    };

    const buildCreativeAchievements = () => {
      const total = allTimeCreative.mined + allTimeCreative.placed;
      const hasMatC = (names) => names.some(n => allTimeCreative.materials[n]);
      return [
        { id: 'cre_first_block', name: 'Erster Kreativblock', desc: '1 Block im Kreativmodus', icon: '🎨', unlocked: total >= 1, unlocked_date: milestonesC['first_block'] || null },
        { id: 'cre_builder_1k', name: 'Erstes Werk', desc: '1.000 Blöcke platziert', icon: '🏗', unlocked: allTimeCreative.placed >= 1000, unlocked_date: milestonesC['cre_builder_1k'] || null },
        { id: 'cre_builder_10k', name: 'Baumeister', desc: '10.000 Blöcke platziert', icon: '🏗', unlocked: allTimeCreative.placed >= 10000, unlocked_date: milestonesC['cre_builder_10k'] || null },
        { id: 'cre_builder_50k', name: 'Visionär', desc: '50.000 Blöcke platziert', icon: '🎨', unlocked: allTimeCreative.placed >= 50000, unlocked_date: milestonesC['cre_builder_50k'] || null },
        { id: 'cre_builder_100k', name: 'Monumental', desc: '100.000 Blöcke platziert', icon: '🏛', unlocked: allTimeCreative.placed >= 100000, unlocked_date: milestonesC['cre_builder_100k'] || null },
        { id: 'cre_builder_500k', name: 'Weltenschöpfer', desc: '500.000 Blöcke platziert', icon: '🌍', unlocked: allTimeCreative.placed >= 500000, unlocked_date: milestonesC['cre_builder_500k'] || null },
        { id: 'cre_total_10k', name: 'Schaffenskraft', desc: '10.000 Blöcke gesamt', icon: '📊', unlocked: total >= 10000, unlocked_date: milestonesC['cre_total_10k'] || null },
        { id: 'cre_total_100k', name: 'Masterpiece', desc: '100.000 Blöcke gesamt', icon: '✨', unlocked: total >= 100000, unlocked_date: milestonesC['cre_total_100k'] || null },
        { id: 'cre_total_500k', name: 'Götterwerk', desc: '500.000 Blöcke gesamt', icon: '⚡', unlocked: total >= 500000, unlocked_date: milestonesC['cre_total_500k'] || null },
        { id: 'cre_total_1m', name: 'Universum', desc: '1.000.000 Blöcke gesamt', icon: '🌌', unlocked: total >= 1000000, unlocked_date: milestonesC['cre_total_1m'] || null },
        { id: 'cre_variety_25', name: 'Künstler', desc: '25 verschiedene Blöcke', icon: '🎨', unlocked: materialSetC.size >= 25, unlocked_date: milestonesC['variety_25'] || null },
        { id: 'cre_variety_50', name: 'Kunstvolles Werk', desc: '50 verschiedene Blöcke', icon: '🖼', unlocked: materialSetC.size >= 50, unlocked_date: milestonesC['variety_50'] || null },
        { id: 'cre_variety_100', name: 'Block-Galerie', desc: '100 verschiedene Blöcke', icon: '🏛', unlocked: materialSetC.size >= 100, unlocked_date: milestonesC['variety_100'] || null },
        { id: 'cre_variety_200', name: 'Block-Universum', desc: '200 verschiedene Blöcke', icon: '🌈', unlocked: materialSetC.size >= 200, unlocked_date: milestonesC['variety_200'] || null },
        { id: 'cre_beacon', name: 'Leuchtfeuer', desc: 'Beacon platziert', icon: '🔆', unlocked: hasMatC(['BEACON']), unlocked_date: milestonesC['cre_beacon'] || null },
        { id: 'cre_conduit', name: 'Meeressäule', desc: 'Conduit platziert', icon: '🌊', unlocked: hasMatC(['CONDUIT']), unlocked_date: milestonesC['cre_conduit'] || null },
        { id: 'cre_dragon_egg', name: 'Drachenhort', desc: 'Drachenei platziert', icon: '🐉', unlocked: hasMatC(['DRAGON_EGG']), unlocked_date: milestonesC['cre_dragon_egg'] || null },
        { id: 'cre_spawner', name: 'Spawner-Meister', desc: 'Spawner platziert', icon: '🕸', unlocked: hasMatC(['SPAWNER']), unlocked_date: milestonesC['cre_spawner'] || null },
        { id: 'cre_ender_chest', name: 'Dimensionskammer', desc: 'Endertruhe platziert', icon: '🔮', unlocked: hasMatC(['ENDER_CHEST']), unlocked_date: milestonesC['cre_ender_chest'] || null },
      ];
    };

    let achievements;
    if (gameMode === 'CREATIVE') {
      achievements = buildCreativeAchievements();
    } else if (gameMode === 'SURVIVAL') {
      achievements = buildSurvivalAchievements();
    } else {
      achievements = [...buildSurvivalAchievements(), ...buildCreativeAchievements()];
    }

    // Compute rare blocks (all-time for this player)
    const rareBlocks = [];
    for (const mat of RARE_MATERIALS) {
      const data = allTimePlayer.materials[mat];
      if (data && (data.mined > 0 || data.placed > 0)) {
        rareBlocks.push({
          material: mat,
          mined: data.mined,
          placed: data.placed,
          total: data.mined + data.placed
        });
      }
    }
    rareBlocks.sort((a, b) => b.total - a.total);

    // Fetch heatmap data (all-time activity)
    const activity = await base44.asServiceRole.entities.PlayerActivity.filter(
      { server_id: server.id, uuid: targetPlayer.uuid }, '-created_date', 1000
    );
    const heatmap = activity
      .filter(a => gameMode === 'ALL' || (a.game_mode || 'SURVIVAL') === gameMode)
      .map(a => ({
        day: a.day_of_week,
        hour: a.hour,
        mined: a.mined || 0,
        placed: a.placed || 0,
        total: (a.mined || 0) + (a.placed || 0),
        game_mode: a.game_mode || 'SURVIVAL'
      }));

    // Compute player's game mode breakdown
    const gameModes = Object.values(playerGameModeMap[targetPlayer.uuid] || {}).sort((a, b) => b.total - a.total);

    // Material categories + world distribution
    const materialCategories = Object.entries(targetCategoryMap)
      .map(([cat, data]) => ({ category: cat, ...data }))
      .sort((a, b) => b.total - a.total);
    const worldDistribution = Object.entries(targetWorldMap)
      .map(([world, data]) => ({ world, ...data }))
      .sort((a, b) => b.total - a.total);

    // Compute neighbors (above/below for each metric)
    const sortedByMined = [...allPlayers].sort((a, b) => b.mined - a.mined);
    const sortedByPlaced = [...allPlayers].sort((a, b) => b.placed - a.placed);

    const computeNeighbors = (sorted, metric) => {
      const idx = sorted.findIndex(p => p.uuid === targetPlayer.uuid);
      const targetVal = sorted[idx][metric];
      const above = idx > 0 ? { name: sorted[idx - 1].player_name, value: sorted[idx - 1][metric], gap: sorted[idx - 1][metric] - targetVal } : null;
      const below = idx < sorted.length - 1 ? { name: sorted[idx + 1].player_name, value: sorted[idx + 1][metric], gap: targetVal - sorted[idx + 1][metric] } : null;
      return { above, below, rank: idx + 1 };
    };

    const neighbors = {
      mined: computeNeighbors(sortedByMined, 'mined'),
      placed: computeNeighbors(sortedByPlaced, 'placed'),
      total: computeNeighbors(sortedPlayers, 'total')
    };

    // Fun facts
    const fmt = (n) => n.toLocaleString('de-DE');
    const fmtMat = (m) => m.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const betterThanPct = sortedPlayers.length > 1 ? Math.round(((sortedPlayers.length - rank) / sortedPlayers.length) * 100) : 100;
    const playerMinerPct = targetPlayer.total > 0 ? Math.round((targetPlayer.mined / targetPlayer.total) * 100) : 0;
    const playerBuilderPct = 100 - playerMinerPct;
    const topBlock = topMaterials[0];
    const topBlockPct = targetPlayer.total > 0 && topBlock ? Math.round((topBlock.total / targetPlayer.total) * 100) : 0;

    const hourMap = {};
    for (const h of heatmap) {
      if (!hourMap[h.hour]) hourMap[h.hour] = 0;
      hourMap[h.hour] += h.total;
    }
    const peakHourEntry = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0];
    const peakHourStr = peakHourEntry ? `${String(peakHourEntry[0]).padStart(2, '0')}:00` : null;

    const facts = [
      { icon: '📈', text: `Du bist besser als ${betterThanPct}% der Spieler auf diesem Server` },
      { icon: '⚖️', text: `Du bist ${playerMinerPct}% Miner und ${playerBuilderPct}% Builder` },
      { icon: topBlock ? '❤️' : null, text: topBlock ? `Dein Lieblingsblock ist ${fmtMat(topBlock.material)} — er macht ${topBlockPct}% deiner Aktivität aus` : null },
      { icon: peakHourStr ? '🕐' : null, text: peakHourStr ? `Du bist am aktivsten um ${peakHourStr} Uhr` : null },
    ].filter(f => f.icon !== null);

    return Response.json({
      player: {
        uuid: targetPlayer.uuid,
        player_name: targetPlayer.player_name,
        mined: targetPlayer.mined,
        placed: targetPlayer.placed,
        total: targetPlayer.total,
        rank,
        totalPlayers: sortedPlayers.length
      },
      topMaterials,
      achievements,
      rareBlocks,
      heatmap,
      gameModes,
      neighbors,
      facts,
      range,
      materialCategories,
      worldDistribution
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});