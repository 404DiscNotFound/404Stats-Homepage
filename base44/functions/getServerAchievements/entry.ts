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

    let totalMined = 0, totalPlaced = 0;
    const materialSet = new Set();
    const playerSet = new Set();
    const matTotals = {};
    const gameModeMap = {};

    for (const stat of allStats) {
      const mined = stat.mined || 0;
      const placed = stat.placed || 0;
      const gm = stat.game_mode || 'SURVIVAL';

      totalMined += mined;
      totalPlaced += placed;
      materialSet.add(stat.material);
      playerSet.add(stat.uuid);
      if (!matTotals[stat.material]) matTotals[stat.material] = { mined: 0, placed: 0 };
      matTotals[stat.material].mined += mined;
      matTotals[stat.material].placed += placed;

      // Game mode breakdown
      if (!gameModeMap[gm]) gameModeMap[gm] = { game_mode: gm, mined: 0, placed: 0, total: 0 };
      gameModeMap[gm].mined += mined;
      gameModeMap[gm].placed += placed;
      gameModeMap[gm].total += mined + placed;
    }

    const totalCombined = totalMined + totalPlaced;
    const uniqueMaterials = materialSet.size;
    const totalPlayers = playerSet.size;

    const matMined = (names) => names.reduce((s, n) => s + (matTotals[n]?.mined || 0), 0);

    const diamondCount = matMined(['DIAMOND_ORE', 'DEEPSLATE_DIAMOND_ORE']);
    const emeraldCount = matMined(['EMERALD_ORE', 'DEEPSLATE_EMERALD_ORE']);
    const goldCount = matMined(['GOLD_ORE', 'DEEPSLATE_GOLD_ORE']);
    const netheriteCount = matMined(['ANCIENT_DEBRIS']);

    const ach = (id, name, desc, icon, current, threshold) => ({
      id, name, desc, icon,
      current: Math.min(current, threshold),
      threshold,
      progress: threshold > 0 ? Math.min(100, Math.round((current / threshold) * 100)) : 0,
      unlocked: current >= threshold
    });

    const achievements = [
      // Mining
      ach('mine_1k', 'Steinzeit', '1.000 Blöcke abgebaut', '⛏', totalMined, 1000),
      ach('mine_10k', 'Steinbruch', '10.000 Blöcke abgebaut', '⛏', totalMined, 10000),
      ach('mine_50k', 'Ausgrabung', '50.000 Blöcke abgebaut', '⛏', totalMined, 50000),
      ach('mine_100k', 'Weltenfresser', '100.000 Blöcke abgebaut', '⛏', totalMined, 100000),
      ach('mine_500k', 'Planetenbrecher', '500.000 Blöcke abgebaut', '⛏', totalMined, 500000),
      // Building
      ach('build_1k', 'Erste Siedlung', '1.000 Blöcke platziert', '🏗', totalPlaced, 1000),
      ach('build_10k', 'Dorfgründer', '10.000 Blöcke platziert', '🏗', totalPlaced, 10000),
      ach('build_50k', 'Stadtplaner', '50.000 Blöcke platziert', '🏗', totalPlaced, 50000),
      ach('build_100k', 'Metropole', '100.000 Blöcke platziert', '🏗', totalPlaced, 100000),
      // Combined
      ach('total_5k', 'Fleißige Bienen', '5.000 Blöcke gesamt', '📊', totalCombined, 5000),
      ach('total_100k', 'Kraftwerk', '100.000 Blöcke gesamt', '📊', totalCombined, 100000),
      ach('total_500k', 'Monumental', '500.000 Blöcke gesamt', '🔥', totalCombined, 500000),
      // Community
      ach('players_2', 'Das Duo', '2 aktive Spieler', '👥', totalPlayers, 2),
      ach('players_5', 'Squad Goals', '5 aktive Spieler', '👥', totalPlayers, 5),
      ach('players_10', 'Community Hub', '10 aktive Spieler', '👥', totalPlayers, 10),
      ach('players_25', 'Blühender Server', '25 aktive Spieler', '👥', totalPlayers, 25),
      // Variety
      ach('var_25', 'Block-Sammler', '25 verschiedene Blöcke', '🎨', uniqueMaterials, 25),
      ach('var_50', 'Block-Museum', '50 verschiedene Blöcke', '🎨', uniqueMaterials, 50),
      ach('var_100', 'Block-Enzyklopädie', '100 verschiedene Blöcke', '📚', uniqueMaterials, 100),
      // Rare Blocks
      ach('diamond_1', 'Diamantenrausch', 'Ersten Diamanten abbauen', '💎', diamondCount, 1),
      ach('diamond_100', 'Diamantkammer', '100 Diamanten abbauen', '💎', diamondCount, 100),
      ach('emerald_1', 'Smaragdökonomie', 'Ersten Smaragd abbauen', '💚', emeraldCount, 1),
      ach('gold_100', 'Goldreserve', '100 Golderz abbauen', '🟡', goldCount, 100),
      ach('netherite_1', 'Netheritjäger', 'Ancient Debris abbauen', '🔥', netheriteCount, 1),
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return Response.json({
      server: { slug: server.server_slug, display_name: server.display_name },
      achievements,
      unlockedCount,
      totalCount: achievements.length,
      stats: { totalMined, totalPlaced, totalCombined, uniqueMaterials, totalPlayers },
      gameModes: Object.values(gameModeMap).sort((a, b) => b.total - a.total)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});