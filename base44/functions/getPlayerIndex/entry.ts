import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { slug } = body;

    if (typeof slug !== 'string' || slug.length === 0 || slug.length > 32) {
      return Response.json({ error: 'Invalid slug' }, { status: 400 });
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
        playerMap[stat.uuid] = { uuid: stat.uuid, player_name: stat.player_name, mined: 0, placed: 0, materials: new Set() };
      }
      playerMap[stat.uuid].mined += (stat.mined || 0);
      playerMap[stat.uuid].placed += (stat.placed || 0);
      playerMap[stat.uuid].materials.add(stat.material);
    }

    const players = Object.values(playerMap)
      .map(p => ({
        uuid: p.uuid,
        player_name: p.player_name,
        mined: p.mined,
        placed: p.placed,
        total: p.mined + p.placed,
        blockVariety: p.materials.size
      }))
      .sort((a, b) => b.total - a.total);

    return Response.json({
      server: { slug: server.server_slug, display_name: server.display_name },
      players,
      totalPlayers: players.length,
      totals: {
        mined: players.reduce((s, p) => s + p.mined, 0),
        placed: players.reduce((s, p) => s + p.placed, 0),
        combined: players.reduce((s, p) => s + p.total, 0)
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});