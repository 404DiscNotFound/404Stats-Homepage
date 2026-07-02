import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { slug, game_mode } = body;

    // Sanitize slug — must be a string, max 32 chars
    if (typeof slug !== 'string' || slug.length === 0 || slug.length > 32) {
      return Response.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const gameMode = (typeof game_mode === 'string' && game_mode.length > 0) ? game_mode.toUpperCase() : 'SURVIVAL';

    const base44 = createClientFromRequest(req);

    // Public read — data is intentionally public (RLS: read=true), service role needed for anonymous access
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

      totalMined += mined;
      totalPlaced += placed;

      if (!materialMap[stat.material]) {
        materialMap[stat.material] = { material: stat.material, mined: 0, placed: 0, players: {} };
      }
      materialMap[stat.material].mined += mined;
      materialMap[stat.material].placed += placed;
      if (!materialMap[stat.material].players[stat.uuid]) {
        materialMap[stat.material].players[stat.uuid] = { name: stat.player_name, mined: 0, placed: 0 };
      }
      materialMap[stat.material].players[stat.uuid].mined += mined;
      materialMap[stat.material].players[stat.uuid].placed += placed;

      if (!playerMap[stat.uuid]) {
        playerMap[stat.uuid] = { uuid: stat.uuid, player_name: stat.player_name, mined: 0, placed: 0 };
      }
      playerMap[stat.uuid].mined += mined;
      playerMap[stat.uuid].placed += placed;
    }

    const topMaterials = Object.values(materialMap)
      .map(m => {
        const total = m.mined + m.placed;
        const topPlayers = Object.entries(m.players)
          .map(([uuid, p]) => ({
            uuid, name: p.name, mined: p.mined, placed: p.placed, total: p.mined + p.placed
          }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);
        return { material: m.material, mined: m.mined, placed: m.placed, total, topPlayers };
      })
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

    // Compute rare blocks
    const RARE_MATERIALS = ['DIAMOND_ORE', 'DEEPSLATE_DIAMOND_ORE', 'EMERALD_ORE', 'DEEPSLATE_EMERALD_ORE', 'ANCIENT_DEBRIS', 'GOLD_ORE', 'DEEPSLATE_GOLD_ORE', 'NETHERITE_BLOCK', 'BEACON', 'CONDUIT', 'ENDER_CHEST', 'END_PORTAL_FRAME', 'DRAGON_EGG', 'SPAWNER', 'SHULKER_BOX'];
    const rareMap = {};
    for (const stat of allStats) {
      if (!RARE_MATERIALS.includes(stat.material)) continue;
      if (!rareMap[stat.material]) {
        rareMap[stat.material] = { material: stat.material, mined: 0, placed: 0, players: {} };
      }
      rareMap[stat.material].mined += (stat.mined || 0);
      rareMap[stat.material].placed += (stat.placed || 0);
      if (!rareMap[stat.material].players[stat.uuid]) {
        rareMap[stat.material].players[stat.uuid] = { name: stat.player_name, total: 0 };
      }
      rareMap[stat.material].players[stat.uuid].total += (stat.mined || 0) + (stat.placed || 0);
    }
    const rareBlocks = Object.values(rareMap)
      .map(r => {
        const top = Object.values(r.players).sort((a, b) => b.total - a.total)[0];
        return {
          material: r.material, mined: r.mined, placed: r.placed, total: r.mined + r.placed,
          topPlayer: top ? top.name : null, topPlayerTotal: top ? top.total : 0
        };
      })
      .sort((a, b) => b.total - a.total);

    // Game modes sorted by total
    const gameModes = Object.values(gameModeMap).sort((a, b) => b.total - a.total);

    // Fun facts
    const fmt = (n) => n.toLocaleString('de-DE');
    const fmtMat = (m) => m.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const combined = totalMined + totalPlaced;
    const minerPct = combined > 0 ? Math.round((totalMined / combined) * 100) : 0;
    const builderPct = 100 - minerPct;
    const avgPerPlayer = allPlayers.length > 0 ? Math.round(combined / allPlayers.length) : 0;
    const topPlayer = allPlayers[0] || null;
    const blockDiversity = Object.keys(materialMap).length;
    const mostLovedBlock = topMaterials[0] || null;
    const facts = [
      { icon: '⚖️', text: `Dein Server ist ${minerPct}% Miner und ${builderPct}% Builder` },
      { icon: '🥇', text: topPlayer ? `${topPlayer.player_name} ist mit ${fmt(topPlayer.total)} Blöcken der aktivste Spieler` : null },
      { icon: '📊', text: `Pro Spieler werden durchschnittlich ${fmt(avgPerPlayer)} Blöcke interagiert` },
      { icon: '🎨', text: `${blockDiversity} verschiedene Blockarten wurden auf dem Server berührt` },
      { icon: '❤️', text: mostLovedBlock ? `${fmtMat(mostLovedBlock.material)} ist mit ${fmt(mostLovedBlock.total)} Aktionen der beliebteste Block` : null },
    ].filter(f => f.text !== null);

    return Response.json({
      server: { slug: server.server_slug, display_name: server.display_name },
      totals: { mined: totalMined, placed: totalPlaced, combined: totalMined + totalPlaced },
      topMaterials,
      topPlayers,
      topMiners,
      topBuilders,
      rareBlocks,
      allPlayers,
      totalPlayers: allPlayers.length,
      gameModes,
      facts
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});