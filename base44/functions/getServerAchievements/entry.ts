import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

async function sha256(text) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

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

    if (server.webpanel_password_enabled) {
      const token = body.access_token;
      if (!token) return Response.json({ error: 'Password required', password_required: true }, { status: 403 });
      const expectedToken = await sha256(server.server_slug + ':' + (server.webpanel_password_hash || '') + ':' + server.id);
      if (token !== expectedToken) return Response.json({ error: 'Invalid token', password_required: true }, { status: 403 });
    }

    const allStats = await base44.asServiceRole.entities.BlockStat.filter(
      { server_id: server.id }, '-created_date', 10000
    );

    const gameModeMap = {};
    const modeData = {
      SURVIVAL: { mined: 0, placed: 0, materials: new Set(), players: new Set(), matTotals: {} },
      CREATIVE: { mined: 0, placed: 0, materials: new Set(), players: new Set(), matTotals: {} },
    };

    for (const stat of allStats) {
      const mined = stat.mined || 0;
      const placed = stat.placed || 0;
      const gm = stat.game_mode || 'SURVIVAL';

      // Game mode breakdown (always from all data)
      if (!gameModeMap[gm]) gameModeMap[gm] = { game_mode: gm, mined: 0, placed: 0, total: 0 };
      gameModeMap[gm].mined += mined;
      gameModeMap[gm].placed += placed;
      gameModeMap[gm].total += mined + placed;

      // Bucket into survival or creative
      const bucket = gm === 'CREATIVE' ? 'CREATIVE' : 'SURVIVAL';
      const md = modeData[bucket];
      md.mined += mined;
      md.placed += placed;
      md.materials.add(stat.material);
      md.players.add(stat.uuid);
      if (!md.matTotals[stat.material]) md.matTotals[stat.material] = { mined: 0, placed: 0 };
      md.matTotals[stat.material].mined += mined;
      md.matTotals[stat.material].placed += placed;
    }

    const ach = (id, name, desc, icon, current, threshold) => ({
      id, name, desc, icon,
      current: Math.min(current, threshold),
      threshold,
      progress: threshold > 0 ? Math.min(100, Math.round((current / threshold) * 100)) : 0,
      unlocked: current >= threshold
    });

    const matMined = (md, names) => names.reduce((s, n) => s + (md.matTotals[n]?.mined || 0), 0);
    const matPlaced = (md, names) => names.reduce((s, n) => s + (md.matTotals[n]?.placed || 0), 0);

    const buildSurvivalAchievements = (md) => {
      const totalCombined = md.mined + md.placed;
      const diamondCount = matMined(md, ['DIAMOND_ORE', 'DEEPSLATE_DIAMOND_ORE']);
      const emeraldCount = matMined(md, ['EMERALD_ORE', 'DEEPSLATE_EMERALD_ORE']);
      const goldCount = matMined(md, ['GOLD_ORE', 'DEEPSLATE_GOLD_ORE']);
      const netheriteCount = matMined(md, ['ANCIENT_DEBRIS']);

      return [
        ach('surv_mine_1k', 'Steinzeit', '1.000 Blöcke abgebaut', '⛏', md.mined, 1000),
        ach('surv_mine_10k', 'Steinbruch', '10.000 Blöcke abgebaut', '⛏', md.mined, 10000),
        ach('surv_mine_50k', 'Ausgrabung', '50.000 Blöcke abgebaut', '⛏', md.mined, 50000),
        ach('surv_mine_100k', 'Weltenfresser', '100.000 Blöcke abgebaut', '⛏', md.mined, 100000),
        ach('surv_mine_500k', 'Planetenbrecher', '500.000 Blöcke abgebaut', '⛏', md.mined, 500000),
        ach('surv_build_1k', 'Erste Siedlung', '1.000 Blöcke platziert', '🏗', md.placed, 1000),
        ach('surv_build_10k', 'Dorfgründer', '10.000 Blöcke platziert', '🏗', md.placed, 10000),
        ach('surv_build_50k', 'Stadtplaner', '50.000 Blöcke platziert', '🏗', md.placed, 50000),
        ach('surv_build_100k', 'Metropole', '100.000 Blöcke platziert', '🏗', md.placed, 100000),
        ach('surv_total_5k', 'Fleißige Bienen', '5.000 Blöcke gesamt', '📊', totalCombined, 5000),
        ach('surv_total_100k', 'Kraftwerk', '100.000 Blöcke gesamt', '📊', totalCombined, 100000),
        ach('surv_total_500k', 'Monumental', '500.000 Blöcke gesamt', '🔥', totalCombined, 500000),
        ach('surv_players_2', 'Das Duo', '2 aktive Spieler', '👥', md.players.size, 2),
        ach('surv_players_5', 'Squad Goals', '5 aktive Spieler', '👥', md.players.size, 5),
        ach('surv_players_10', 'Community Hub', '10 aktive Spieler', '👥', md.players.size, 10),
        ach('surv_players_25', 'Blühender Server', '25 aktive Spieler', '👥', md.players.size, 25),
        ach('surv_var_25', 'Block-Sammler', '25 verschiedene Blöcke', '🎨', md.materials.size, 25),
        ach('surv_var_50', 'Block-Museum', '50 verschiedene Blöcke', '🎨', md.materials.size, 50),
        ach('surv_var_100', 'Block-Enzyklopädie', '100 verschiedene Blöcke', '📚', md.materials.size, 100),
        ach('surv_diamond_1', 'Diamantenrausch', 'Ersten Diamanten abbauen', '💎', diamondCount, 1),
        ach('surv_diamond_100', 'Diamantkammer', '100 Diamanten abbauen', '💎', diamondCount, 100),
        ach('surv_emerald_1', 'Smaragdökonomie', 'Ersten Smaragd abbauen', '💚', emeraldCount, 1),
        ach('surv_gold_100', 'Goldreserve', '100 Golderz abbauen', '🟡', goldCount, 100),
        ach('surv_netherite_1', 'Netheritjäger', 'Ancient Debris abbauen', '🔥', netheriteCount, 1),
      ];
    };

    const buildCreativeAchievements = (md) => {
      const totalCombined = md.mined + md.placed;
      const beaconCount = matPlaced(md, ['BEACON']);
      const conduitCount = matPlaced(md, ['CONDUIT']);
      const dragonEggCount = matPlaced(md, ['DRAGON_EGG']);
      const spawnerCount = matPlaced(md, ['SPAWNER']);
      const enderChestCount = matPlaced(md, ['ENDER_CHEST']);

      return [
        ach('cre_build_1k', 'Erstes Werk', '1.000 Blöcke platziert', '🏗', md.placed, 1000),
        ach('cre_build_10k', 'Baumeister', '10.000 Blöcke platziert', '🏗', md.placed, 10000),
        ach('cre_build_50k', 'Visionär', '50.000 Blöcke platziert', '🎨', md.placed, 50000),
        ach('cre_build_100k', 'Monumental', '100.000 Blöcke platziert', '🏛', md.placed, 100000),
        ach('cre_build_500k', 'Weltenschöpfer', '500.000 Blöcke platziert', '🌍', md.placed, 500000),
        ach('cre_total_10k', 'Schaffenskraft', '10.000 Blöcke gesamt', '📊', totalCombined, 10000),
        ach('cre_total_100k', 'Masterpiece', '100.000 Blöcke gesamt', '✨', totalCombined, 100000),
        ach('cre_total_500k', 'Götterwerk', '500.000 Blöcke gesamt', '⚡', totalCombined, 500000),
        ach('cre_var_25', 'Künstler', '25 verschiedene Blöcke', '🎨', md.materials.size, 25),
        ach('cre_var_50', 'Kunstvolles Werk', '50 verschiedene Blöcke', '🖼', md.materials.size, 50),
        ach('cre_var_100', 'Block-Galerie', '100 verschiedene Blöcke', '🏛', md.materials.size, 100),
        ach('cre_var_200', 'Block-Universum', '200 verschiedene Blöcke', '🌈', md.materials.size, 200),
        ach('cre_players_2', 'Kreativ-Duo', '2 aktive Spieler', '👥', md.players.size, 2),
        ach('cre_players_5', 'Bau-Team', '5 aktive Spieler', '👥', md.players.size, 5),
        ach('cre_players_10', 'Kreativ-Community', '10 aktive Spieler', '👥', md.players.size, 10),
        ach('cre_players_25', 'Kreativ-Hub', '25 aktive Spieler', '👥', md.players.size, 25),
        ach('cre_beacon', 'Leuchtfeuer', 'Beacon platziert', '🔆', beaconCount, 1),
        ach('cre_conduit', 'Meeressäule', 'Conduit platziert', '🌊', conduitCount, 1),
        ach('cre_dragon_egg', 'Drachenhort', 'Drachenei platziert', '🐉', dragonEggCount, 1),
        ach('cre_spawner', 'Spawner-Meister', 'Spawner platziert', '🕸', spawnerCount, 1),
        ach('cre_ender_chest', 'Dimensionskammer', 'Endertruhe platziert', '🔮', enderChestCount, 1),
      ];
    };

    let achievements;
    if (gameMode === 'CREATIVE') {
      achievements = buildCreativeAchievements(modeData.CREATIVE);
    } else if (gameMode === 'SURVIVAL') {
      achievements = buildSurvivalAchievements(modeData.SURVIVAL);
    } else {
      achievements = [...buildSurvivalAchievements(modeData.SURVIVAL), ...buildCreativeAchievements(modeData.CREATIVE)];
    }

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    const activeMd = gameMode === 'CREATIVE' ? modeData.CREATIVE : gameMode === 'SURVIVAL' ? modeData.SURVIVAL : {
      mined: modeData.SURVIVAL.mined + modeData.CREATIVE.mined,
      placed: modeData.SURVIVAL.placed + modeData.CREATIVE.placed,
      materials: new Set([...modeData.SURVIVAL.materials, ...modeData.CREATIVE.materials]),
      players: new Set([...modeData.SURVIVAL.players, ...modeData.CREATIVE.players]),
    };

    return Response.json({
      server: { slug: server.server_slug, display_name: server.display_name },
      achievements,
      unlockedCount,
      totalCount: achievements.length,
      stats: {
        totalMined: activeMd.mined,
        totalPlaced: activeMd.placed,
        totalCombined: activeMd.mined + activeMd.placed,
        uniqueMaterials: activeMd.materials.size,
        totalPlayers: activeMd.players.size,
      },
      gameModes: Object.values(gameModeMap).sort((a, b) => b.total - a.total)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});