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

    const materialMap = {};
    const uniquePlayers = new Set();
    for (const stat of allStats) {
      uniquePlayers.add(stat.uuid);
      if (!materialMap[stat.material]) {
        materialMap[stat.material] = {
          material: stat.material, mined: 0, placed: 0,
          players: {}, topContributor: null
        };
      }
      const m = materialMap[stat.material];
      m.mined += (stat.mined || 0);
      m.placed += (stat.placed || 0);
      if (!m.players[stat.uuid]) {
        m.players[stat.uuid] = { name: stat.player_name, mined: 0, placed: 0 };
      }
      m.players[stat.uuid].mined += (stat.mined || 0);
      m.players[stat.uuid].placed += (stat.placed || 0);
    }

    const grandTotal = Object.values(materialMap).reduce((s, m) => s + m.mined + m.placed, 0);

    const materials = Object.values(materialMap)
      .map(m => {
        const playerList = Object.entries(m.players).map(([uuid, p]) => ({
          uuid, name: p.name, mined: p.mined, placed: p.placed, total: p.mined + p.placed
        })).sort((a, b) => b.total - a.total);
        const top = playerList[0] || null;
        const topPlayers = playerList.slice(0, 5);
        return {
          material: m.material,
          mined: m.mined,
          placed: m.placed,
          total: m.mined + m.placed,
          playerCount: playerList.length,
          playerPct: uniquePlayers.size > 0 ? Math.round((playerList.length / uniquePlayers.size) * 100) : 0,
          topContributor: top ? { uuid: top.uuid, name: top.name, total: top.total, mined: top.mined, placed: top.placed } : null,
          topPlayers,
          sharePct: grandTotal > 0 ? Math.round(((m.mined + m.placed) / grandTotal) * 100) : 0
        };
      })
      .sort((a, b) => b.total - a.total);

    return Response.json({
      server: { slug: server.server_slug, display_name: server.display_name },
      materials,
      totalMaterials: materials.length,
      totals: {
        mined: materials.reduce((s, m) => s + m.mined, 0),
        placed: materials.reduce((s, m) => s + m.placed, 0),
        combined: materials.reduce((s, m) => s + m.total, 0)
      },
      totalPlayers: uniquePlayers.size
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});