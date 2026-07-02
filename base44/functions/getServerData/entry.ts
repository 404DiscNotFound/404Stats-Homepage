import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return Response.json({ error: 'Missing slug' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    const servers = await base44.asServiceRole.entities.Server.filter({ server_slug: slug });
    if (!servers || servers.length === 0) {
      return Response.json({ error: 'Server nicht gefunden' }, { status: 404 });
    }
    const server = servers[0];

    const allStats = await base44.asServiceRole.entities.BlockStat.filter(
      { server_id: server.id }, '-created_date', 10000
    );

    let totalMined = 0;
    let totalPlaced = 0;
    const materialMap = {};
    const playerMap = {};

    for (const stat of allStats) {
      totalMined += (stat.mined || 0);
      totalPlaced += (stat.placed || 0);

      if (!materialMap[stat.material]) {
        materialMap[stat.material] = { material: stat.material, mined: 0, placed: 0 };
      }
      materialMap[stat.material].mined += (stat.mined || 0);
      materialMap[stat.material].placed += (stat.placed || 0);

      if (!playerMap[stat.uuid]) {
        playerMap[stat.uuid] = { uuid: stat.uuid, player_name: stat.player_name, mined: 0, placed: 0 };
      }
      playerMap[stat.uuid].mined += (stat.mined || 0);
      playerMap[stat.uuid].placed += (stat.placed || 0);
    }

    const topMaterials = Object.values(materialMap)
      .map(m => ({ ...m, total: m.mined + m.placed }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 25);

    const topPlayers = Object.values(playerMap)
      .map(p => ({ ...p, total: p.mined + p.placed }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 25);

    const topMiners = Object.values(playerMap)
      .map(p => ({ uuid: p.uuid, player_name: p.player_name, mined: p.mined, placed: p.placed, total: p.mined + p.placed }))
      .sort((a, b) => b.mined - a.mined)
      .slice(0, 25);

    const topBuilders = Object.values(playerMap)
      .map(p => ({ uuid: p.uuid, player_name: p.player_name, mined: p.mined, placed: p.placed, total: p.mined + p.placed }))
      .sort((a, b) => b.placed - a.placed)
      .slice(0, 25);

    const allPlayers = Object.values(playerMap)
      .map(p => ({ uuid: p.uuid, player_name: p.player_name, total: p.mined + p.placed }))
      .sort((a, b) => b.total - a.total);

    return Response.json({
      server: { slug: server.server_slug, display_name: server.display_name },
      totals: { mined: totalMined, placed: totalPlaced, combined: totalMined + totalPlaced },
      topMaterials,
      topPlayers,
      topMiners,
      topBuilders,
      allPlayers,
      totalPlayers: allPlayers.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});