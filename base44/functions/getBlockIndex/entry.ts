import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { slug, game_mode } = body;

    if (typeof slug !== 'string' || slug.length === 0 || slug.length > 32) {
      return Response.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const gameMode = (typeof game_mode === 'string' && game_mode.length > 0) ? game_mode.toUpperCase() : 'SURVIVAL';

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
    const gameModeMap = {};

    for (const stat of allStats) {
      const mined = stat.mined || 0;
      const placed = stat.placed || 0;
      const gm = stat.game_mode || 'SURVIVAL';

      // Game mode breakdown (always from all data)
      if (!gameModeMap[gm]) gameModeMap[gm] = { game_mode: gm, mined: 0, placed: 0, total: 0 };
      gameModeMap[gm].mined += mined;
      gameModeMap[gm].placed += placed;
      gameModeMap[gm].total += mined + placed;

      // Skip stats not matching the game mode filter
      if (gameMode !== 'ALL' && gm !== gameMode) continue;

      uniquePlayers.add(stat.uuid);

      if (!materialMap[stat.material]) {
        materialMap[stat.material] = {
          material: stat.material, mined: 0, placed: 0,
          players: {}, topContributor: null, gameModes: {}
        };
      }
      const m = materialMap[stat.material];
      m.mined += mined;
      m.placed += placed;
      if (!m.gameModes[gm]) m.gameModes[gm] = { mined: 0, placed: 0, total: 0 };
      m.gameModes[gm].mined += mined;
      m.gameModes[gm].placed += placed;
      m.gameModes[gm].total += mined + placed;
      if (!m.players[stat.uuid]) {
        m.players[stat.uuid] = { name: stat.player_name, mined: 0, placed: 0 };
      }
      m.players[stat.uuid].mined += mined;
      m.players[stat.uuid].placed += placed;
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
          gameModes: Object.values(m.gameModes).sort((a, b) => b.total - a.total),
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
      gameModes: Object.values(gameModeMap).sort((a, b) => b.total - a.total),
      totalPlayers: uniquePlayers.size
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});