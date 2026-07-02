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

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { slug, playerName, range = 'all' } = body;

    if (!slug || !playerName) {
      return Response.json({ error: 'Missing slug or playerName' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

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
    for (const stat of rangeStats) {
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
    const topMaterials = Object.values(materialMap)
      .map(m => ({ ...m, total: m.mined + m.placed }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Compute all-time achievements
    const allTimePlayer = { mined: 0, placed: 0, materials: {} };
    const materialSet = new Set();
    for (const stat of allTimeStats) {
      if (stat.player_name.toLowerCase() !== playerName.toLowerCase()) continue;
      allTimePlayer.mined += (stat.mined || 0);
      allTimePlayer.placed += (stat.placed || 0);
      materialSet.add(stat.material);
      if (!allTimePlayer.materials[stat.material]) allTimePlayer.materials[stat.material] = { mined: 0, placed: 0 };
      allTimePlayer.materials[stat.material].mined += (stat.mined || 0);
      allTimePlayer.materials[stat.material].placed += (stat.placed || 0);
    }

    const allTimeTotal = allTimePlayer.mined + allTimePlayer.placed;
    const hasMat = (names) => names.some(n => allTimePlayer.materials[n]);

    const achievements = [
      { id: 'first_block', name: 'Erster Block', desc: 'Interagiere mit 1 Block', icon: '🧱', unlocked: allTimeTotal >= 1 },
      { id: 'miner_100', name: 'Steinbrucharbeiter', desc: '100 Blöcke abgebaut', icon: '⛏', unlocked: allTimePlayer.mined >= 100 },
      { id: 'miner_1k', name: 'Bergmann', desc: '1.000 Blöcke abgebaut', icon: '⛏', unlocked: allTimePlayer.mined >= 1000 },
      { id: 'miner_10k', name: 'Meisterbergmann', desc: '10.000 Blöcke abgebaut', icon: '⛏', unlocked: allTimePlayer.mined >= 10000 },
      { id: 'miner_100k', name: 'Legendärer Bergmann', desc: '100.000 Blöcke abgebaut', icon: '⛏', unlocked: allTimePlayer.mined >= 100000 },
      { id: 'builder_100', name: 'Baumeister', desc: '100 Blöcke gesetzt', icon: '🏗', unlocked: allTimePlayer.placed >= 100 },
      { id: 'builder_1k', name: 'Architekt', desc: '1.000 Blöcke gesetzt', icon: '🏗', unlocked: allTimePlayer.placed >= 1000 },
      { id: 'builder_10k', name: 'Master Builder', desc: '10.000 Blöcke gesetzt', icon: '🏗', unlocked: allTimePlayer.placed >= 10000 },
      { id: 'builder_100k', name: 'Legendärer Builder', desc: '100.000 Blöcke gesetzt', icon: '🏗', unlocked: allTimePlayer.placed >= 100000 },
      { id: 'total_1k', name: 'Fleißig', desc: '1.000 Blöcke gesamt', icon: '📊', unlocked: allTimeTotal >= 1000 },
      { id: 'total_10k', name: 'Aktiv', desc: '10.000 Blöcke gesamt', icon: '📊', unlocked: allTimeTotal >= 10000 },
      { id: 'total_100k', name: 'Besessen', desc: '100.000 Blöcke gesamt', icon: '🔥', unlocked: allTimeTotal >= 100000 },
      { id: 'total_1m', name: 'Maschine', desc: '1.000.000 Blöcke gesamt', icon: '🤖', unlocked: allTimeTotal >= 1000000 },
      { id: 'diamond', name: 'Diamantenjäger', desc: 'Diamanterz abgebaut', icon: '💎', unlocked: hasMat(['DIAMOND_ORE', 'DEEPSLATE_DIAMOND_ORE']) },
      { id: 'emerald', name: 'Smaragdjäger', desc: 'Smaragderz abgebaut', icon: '💚', unlocked: hasMat(['EMERALD_ORE', 'DEEPSLATE_EMERALD_ORE']) },
      { id: 'netherite', name: 'Netheritjäger', desc: 'Ancient Debris abgebaut', icon: '🔥', unlocked: hasMat(['ANCIENT_DEBRIS']) },
      { id: 'gold', name: 'Goldsucher', desc: 'Golderz abgebaut', icon: '🟡', unlocked: hasMat(['GOLD_ORE', 'DEEPSLATE_GOLD_ORE']) },
      { id: 'variety_10', name: 'Sammler', desc: '10 verschiedene Blöcke', icon: '🌈', unlocked: materialSet.size >= 10 },
      { id: 'variety_50', name: 'Allrounder', desc: '50 verschiedene Blöcke', icon: '🎨', unlocked: materialSet.size >= 50 },
      { id: 'variety_100', name: 'Enzyklopädie', desc: '100 verschiedene Blöcke', icon: '📚', unlocked: materialSet.size >= 100 },
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
    const heatmap = activity.map(a => ({
      day: a.day_of_week,
      hour: a.hour,
      mined: a.mined || 0,
      placed: a.placed || 0,
      total: (a.mined || 0) + (a.placed || 0)
    }));

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
      range
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});