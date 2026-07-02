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

    const playerMap = {};
    const gameModeMap = {};

    for (const stat of allStats) {
      const mined = stat.mined || 0;
      const placed = stat.placed || 0;
      const gm = stat.game_mode || 'SURVIVAL';

      // Server-wide game mode breakdown (always from all data)
      if (!gameModeMap[gm]) gameModeMap[gm] = { game_mode: gm, mined: 0, placed: 0, total: 0 };
      gameModeMap[gm].mined += mined;
      gameModeMap[gm].placed += placed;
      gameModeMap[gm].total += mined + placed;

      // Skip stats not matching the game mode filter
      if (gameMode !== 'ALL' && gm !== gameMode) continue;

      if (!playerMap[stat.uuid]) {
        playerMap[stat.uuid] = { uuid: stat.uuid, player_name: stat.player_name, mined: 0, placed: 0, materials: new Set(), gameModes: {} };
      }
      playerMap[stat.uuid].mined += mined;
      playerMap[stat.uuid].placed += placed;
      playerMap[stat.uuid].materials.add(stat.material);

      // Per-player game mode breakdown
      if (!playerMap[stat.uuid].gameModes[gm]) playerMap[stat.uuid].gameModes[gm] = { game_mode: gm, mined: 0, placed: 0, total: 0 };
      playerMap[stat.uuid].gameModes[gm].mined += mined;
      playerMap[stat.uuid].gameModes[gm].placed += placed;
      playerMap[stat.uuid].gameModes[gm].total += mined + placed;
    }

    const players = Object.values(playerMap)
      .map(p => ({
        uuid: p.uuid,
        player_name: p.player_name,
        mined: p.mined,
        placed: p.placed,
        total: p.mined + p.placed,
        blockVariety: p.materials.size,
        gameModes: Object.values(p.gameModes).sort((a, b) => b.total - a.total)
      }))
      .sort((a, b) => b.total - a.total);

    return Response.json({
      server: { slug: server.server_slug, display_name: server.display_name },
      players,
      totalPlayers: players.length,
      gameModes: Object.values(gameModeMap).sort((a, b) => b.total - a.total),
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