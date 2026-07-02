import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { slug, playerName } = body;

    if (!slug || !playerName) {
      return Response.json({ error: 'Missing slug or playerName' }, { status: 400 });
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

    const playerMap = {};
    for (const stat of allStats) {
      if (!playerMap[stat.uuid]) {
        playerMap[stat.uuid] = {
          uuid: stat.uuid, player_name: stat.player_name, mined: 0, placed: 0, materials: []
        };
      }
      playerMap[stat.uuid].mined += (stat.mined || 0);
      playerMap[stat.uuid].placed += (stat.placed || 0);
      playerMap[stat.uuid].materials.push({
        material: stat.material, mined: stat.mined || 0, placed: stat.placed || 0
      });
    }

    const allPlayers = Object.values(playerMap).map(p => ({ ...p, total: p.mined + p.placed }));
    const targetPlayer = allPlayers.find(
      p => p.player_name.toLowerCase() === playerName.toLowerCase()
    );

    if (!targetPlayer) {
      return Response.json({ error: 'Spieler nicht gefunden' }, { status: 404 });
    }

    const sortedPlayers = allPlayers.sort((a, b) => b.total - a.total);
    const rank = sortedPlayers.findIndex(p => p.uuid === targetPlayer.uuid) + 1;

    const topMaterials = targetPlayer.materials
      .map(m => ({ ...m, total: m.mined + m.placed }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

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
      topMaterials
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});