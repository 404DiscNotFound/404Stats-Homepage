import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

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
      let startDate;
      if (range === 'day') startDate = now.toISOString().split('T')[0];
      else if (range === 'week') startDate = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];
      else if (range === 'month') startDate = new Date(now.getTime() - 30 * 86400000).toISOString().split('T')[0];
      else if (range === 'year') startDate = new Date(now.getTime() - 365 * 86400000).toISOString().split('T')[0];
      else startDate = now.toISOString().split('T')[0];

      rangeStats = await base44.asServiceRole.entities.DailyBlockStat.filter(
        { server_id: server.id, date: { $gte: startDate } }, '-created_date', 10000
      );
    }

    // Build player maps for range data
    const playerMap = {};
    const playerGameModeMap = {};
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

    // Compute all-time totals from BlockStat
    const allTimePlayer = { mined: 0, placed: 0, materials: {} };
    const materialSet = new Set();
    for (const stat of allTimeStats) {
      if (stat.player_name.toLowerCase() !== playerName.toLowerCase()) continue;
      const gm = stat.game_mode || 'SURVIVAL';
      if (gameMode !== 'ALL' && gm !== gameMode) continue;
      allTimePlayer.mined += (stat.mined || 0);
      allTimePlayer.placed += (stat.placed || 0);
      materialSet.add(stat.material);
      if (!allTimePlayer.materials[stat.material]) allTimePlayer.materials[stat.material] = { mined: 0, placed: 0 };
      allTimePlayer.materials[stat.material].mined += (stat.mined || 0);
      allTimePlayer.materials[stat.material].placed += (stat.placed || 0);
    }

    const allTimeTotal = allTimePlayer.mined + allTimePlayer.placed;
    const hasMat = (names) => names.some(n => allTimePlayer.materials[n]);

    // Fetch daily stats for this player to compute achievement unlock dates
    const playerDaily = await base44.asServiceRole.entities.DailyBlockStat.filter(
      { server_id: server.id, uuid: targetPlayer.uuid }, 'date', 10000
    );

    // Walk through daily stats to find when each milestone was first reached
    const milestones = {};
    let cumMined = 0, cumPlaced = 0, cumTotal = 0;
    const materialFirstSeen = {};
    const seenMats = new Set();

    for (const ds of playerDaily) {
      const dsGm = ds.game_mode || 'SURVIVAL';
      if (gameMode !== 'ALL' && dsGm !== gameMode) continue;
      cumMined += ds.mined || 0;
      cumPlaced += ds.placed || 0;
      cumTotal = cumMined + cumPlaced;
      const ts = ds.created_date || ds.date;

      if (!seenMats.has(ds.material)) {
        seenMats.add(ds.material);
        milestones[`variety_${seenMats.size}`] = ts;
      }
      if (!materialFirstSeen[ds.material]) materialFirstSeen[ds.material] = ts;

      if (cumTotal >= 1 && !milestones['first_block']) milestones['first_block'] = ts;

      const checks = [
        ['miner_100', cumMined, 100], ['miner_1k', cumMined, 1000], ['miner_10k', cumMined, 10000], ['miner_100k', cumMined, 100000],
        ['builder_100', cumPlaced, 100], ['builder_1k', cumPlaced, 1000], ['builder_10k', cumPlaced, 10000], ['builder_100k', cumPlaced, 100000],
        ['total_1k', cumTotal, 1000], ['total_10k', cumTotal, 10000], ['total_100k', cumTotal, 100000], ['total_1m', cumTotal, 1000000],
      ];
      for (const [id, val, thresh] of checks) {
        if (val >= thresh && !milestones[id]) milestones[id] = ts;
      }
    }

    // Material-based achievement dates
    const matAchievements = {
      diamond: ['DIAMOND_ORE', 'DEEPSLATE_DIAMOND_ORE'],
      emerald: ['EMERALD_ORE', 'DEEPSLATE_EMERALD_ORE'],
      netherite: ['ANCIENT_DEBRIS'],
      gold: ['GOLD_ORE', 'DEEPSLATE_GOLD_ORE'],
    };
    for (const [id, mats] of Object.entries(matAchievements)) {
      for (const m of mats) {
        if (materialFirstSeen[m]) { milestones[id] = materialFirstSeen[m]; break; }
      }
    }

    const achievements = [
      { id: 'first_block', name: 'Erster Block', desc: 'Interagiere mit 1 Block', icon: '🧱', unlocked: allTimeTotal >= 1, unlocked_date: milestones['first_block'] || null },
      { id: 'miner_100', name: 'Steinbrucharbeiter', desc: '100 Blöcke abgebaut', icon: '⛏', unlocked: allTimePlayer.mined >= 100, unlocked_date: milestones['miner_100'] || null },
      { id: 'miner_1k', name: 'Bergmann', desc: '1.000 Blöcke abgebaut', icon: '⛏', unlocked: allTimePlayer.mined >= 1000, unlocked_date: milestones['miner_1k'] || null },
      { id: 'miner_10k', name: 'Meisterbergmann', desc: '10.000 Blöcke abgebaut', icon: '⛏', unlocked: allTimePlayer.mined >= 10000, unlocked_date: milestones['miner_10k'] || null },
      { id: 'miner_100k', name: 'Legendärer Bergmann', desc: '100.000 Blöcke abgebaut', icon: '⛏', unlocked: allTimePlayer.mined >= 100000, unlocked_date: milestones['miner_100k'] || null },
      { id: 'builder_100', name: 'Baumeister', desc: '100 Blöcke gesetzt', icon: '🏗', unlocked: allTimePlayer.placed >= 100, unlocked_date: milestones['builder_100'] || null },
      { id: 'builder_1k', name: 'Architekt', desc: '1.000 Blöcke gesetzt', icon: '🏗', unlocked: allTimePlayer.placed >= 1000, unlocked_date: milestones['builder_1k'] || null },
      { id: 'builder_10k', name: 'Master Builder', desc: '10.000 Blöcke gesetzt', icon: '🏗', unlocked: allTimePlayer.placed >= 10000, unlocked_date: milestones['builder_10k'] || null },
      { id: 'builder_100k', name: 'Legendärer Builder', desc: '100.000 Blöcke gesetzt', icon: '🏗', unlocked: allTimePlayer.placed >= 100000, unlocked_date: milestones['builder_100k'] || null },
      { id: 'total_1k', name: 'Fleißig', desc: '1.000 Blöcke gesamt', icon: '📊', unlocked: allTimeTotal >= 1000, unlocked_date: milestones['total_1k'] || null },
      { id: 'total_10k', name: 'Aktiv', desc: '10.000 Blöcke gesamt', icon: '📊', unlocked: allTimeTotal >= 10000, unlocked_date: milestones['total_10k'] || null },
      { id: 'total_100k', name: 'Besessen', desc: '100.000 Blöcke gesamt', icon: '🔥', unlocked: allTimeTotal >= 100000, unlocked_date: milestones['total_100k'] || null },
      { id: 'total_1m', name: 'Maschine', desc: '1.000.000 Blöcke gesamt', icon: '🤖', unlocked: allTimeTotal >= 1000000, unlocked_date: milestones['total_1m'] || null },
      { id: 'diamond', name: 'Diamantenjäger', desc: 'Diamanterz abgebaut', icon: '💎', unlocked: hasMat(['DIAMOND_ORE', 'DEEPSLATE_DIAMOND_ORE']), unlocked_date: milestones['diamond'] || null },
      { id: 'emerald', name: 'Smaragdjäger', desc: 'Smaragderz abgebaut', icon: '💚', unlocked: hasMat(['EMERALD_ORE', 'DEEPSLATE_EMERALD_ORE']), unlocked_date: milestones['emerald'] || null },
      { id: 'netherite', name: 'Netheritjäger', desc: 'Ancient Debris abgebaut', icon: '🔥', unlocked: hasMat(['ANCIENT_DEBRIS']), unlocked_date: milestones['netherite'] || null },
      { id: 'gold', name: 'Goldsucher', desc: 'Golderz abgebaut', icon: '🟡', unlocked: hasMat(['GOLD_ORE', 'DEEPSLATE_GOLD_ORE']), unlocked_date: milestones['gold'] || null },
      { id: 'variety_10', name: 'Sammler', desc: '10 verschiedene Blöcke', icon: '🌈', unlocked: materialSet.size >= 10, unlocked_date: milestones['variety_10'] || null },
      { id: 'variety_50', name: 'Allrounder', desc: '50 verschiedene Blöcke', icon: '🎨', unlocked: materialSet.size >= 50, unlocked_date: milestones['variety_50'] || null },
      { id: 'variety_100', name: 'Enzyklopädie', desc: '100 verschiedene Blöcke', icon: '📚', unlocked: materialSet.size >= 100, unlocked_date: milestones['variety_100'] || null },
    ];

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
      range
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});