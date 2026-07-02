import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch all servers
    const servers = await base44.asServiceRole.entities.Server.list('-created_date', 500);

    // Fetch all BlockStat records (public read via service role)
    const allStats = await base44.asServiceRole.entities.BlockStat.list('-created_date', 10000);

    let totalMined = 0;
    let totalPlaced = 0;
    const materialMap = {};
    const playerMap = {};
    const serverMap = {};

    for (const stat of allStats) {
      totalMined += (stat.mined || 0);
      totalPlaced += (stat.placed || 0);

      // Material aggregation
      if (!materialMap[stat.material]) {
        materialMap[stat.material] = { material: stat.material, mined: 0, placed: 0 };
      }
      materialMap[stat.material].mined += (stat.mined || 0);
      materialMap[stat.material].placed += (stat.placed || 0);

      // Player aggregation (UUID + server combo for uniqueness)
      const playerKey = `${stat.server_id}:${stat.uuid}`;
      if (!playerMap[playerKey]) {
        playerMap[playerKey] = { uuid: stat.uuid, name: stat.player_name, server_id: stat.server_id, mined: 0, placed: 0 };
      }
      playerMap[playerKey].mined += (stat.mined || 0);
      playerMap[playerKey].placed += (stat.placed || 0);

      // Per-server aggregation
      if (!serverMap[stat.server_id]) {
        serverMap[stat.server_id] = { server_id: stat.server_id, mined: 0, placed: 0, materials: new Set(), players: new Set() };
      }
      serverMap[stat.server_id].mined += (stat.mined || 0);
      serverMap[stat.server_id].placed += (stat.placed || 0);
      serverMap[stat.server_id].materials.add(stat.material);
      serverMap[stat.server_id].players.add(stat.uuid);
    }

    const totalCombined = totalMined + totalPlaced;
    const uniquePlayers = Object.keys(playerMap).length;
    const totalServers = servers.length;

    // Top 10 blocks globally
    const topBlocks = Object.values(materialMap)
      .map(m => ({ ...m, total: m.mined + m.placed }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Top 10 players globally
    const topPlayers = Object.values(playerMap)
      .map(p => ({ ...p, total: p.mined + p.placed }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Top 10 servers globally
    const serverSlugs = {};
    for (const s of servers) {
      serverSlugs[s.id] = { slug: s.server_slug, display_name: s.display_name };
    }
    const topServers = Object.values(serverMap)
      .map(s => ({
        ...s,
        total: s.mined + s.placed,
        uniqueMaterials: s.materials.size,
        uniquePlayers: s.players.size,
        slug: serverSlugs[s.server_id]?.slug || null,
        display_name: serverSlugs[s.server_id]?.display_name || null
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Funny / interesting stats
    const avgBlocksPerPlayer = uniquePlayers > 0 ? Math.round(totalCombined / uniquePlayers) : 0;
    const avgBlocksPerServer = totalServers > 0 ? Math.round(totalCombined / totalServers) : 0;

    const mostMinedBlock = Object.values(materialMap).sort((a, b) => b.mined - a.mined)[0];
    const mostPlacedBlock = Object.values(materialMap).sort((a, b) => b.placed - a.placed)[0];

    // Count specific interesting materials
    const DIAMOND_MATS = ['DIAMOND_ORE', 'DEEPSLATE_DIAMOND_ORE'];
    const EMERALD_MATS = ['EMERALD_ORE', 'DEEPSLATE_EMERALD_ORE'];
    const GOLD_MATS = ['GOLD_ORE', 'DEEPSLATE_GOLD_ORE'];
    const ANCIENT_DEBRIS = 'ANCIENT_DEBRIS';

    const diamondsMined = DIAMOND_MATS.reduce((s, m) => s + (materialMap[m]?.mined || 0), 0);
    const emeraldsMined = EMERALD_MATS.reduce((s, m) => s + (materialMap[m]?.mined || 0), 0);
    const goldMined = GOLD_MATS.reduce((s, m) => s + (materialMap[m]?.mined || 0), 0);
    const ancientDebrisMined = materialMap[ANCIENT_DEBRIS]?.mined || 0;

    const uniqueMaterials = Object.keys(materialMap).length;

    // Most active server
    const busiestServer = topServers[0] || null;
    // Most diverse server
    const mostDiverseServer = [...topServers].sort((a, b) => b.uniqueMaterials - a.uniqueMaterials)[0] || null;

    return Response.json({
      totals: {
        servers: totalServers,
        players: uniquePlayers,
        mined: totalMined,
        placed: totalPlaced,
        combined: totalCombined,
        uniqueMaterials
      },
      funStats: {
        avgBlocksPerPlayer,
        avgBlocksPerServer,
        diamondsMined,
        emeraldsMined,
        goldMined,
        ancientDebrisMined,
        mostMinedBlock: mostMinedBlock ? { material: mostMinedBlock.material, count: mostMinedBlock.mined } : null,
        mostPlacedBlock: mostPlacedBlock ? { material: mostPlacedBlock.material, count: mostPlacedBlock.placed } : null,
        busiestServer: busiestServer ? { slug: busiestServer.slug, display_name: busiestServer.display_name, total: busiestServer.total } : null,
        mostDiverseServer: mostDiverseServer ? { slug: mostDiverseServer.slug, display_name: mostDiverseServer.display_name, uniqueMaterials: mostDiverseServer.uniqueMaterials } : null,
      },
      topBlocks,
      topPlayers,
      topServers,
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});