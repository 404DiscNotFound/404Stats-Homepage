import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

async function sha256(text) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getMaterialCategory(material) {
  const m = (material || '').toUpperCase();
  if (!m) return 'nature';
  if (m.startsWith('NETHER_') || m.startsWith('CRIMSON_') || m.startsWith('WARPED_') || m.startsWith('SOUL_') ||
      ['NETHERRACK', 'GLOWSTONE', 'BASALT', 'SMOOTH_BASALT', 'POLISHED_BASALT', 'BLACKSTONE', 'GILDED_BLACKSTONE',
       'MAGMA_BLOCK', 'ANCIENT_DEBRIS', 'NETHERITE_BLOCK', 'RESPAWN_ANCHOR', 'LODESTONE', 'CRYING_OBSIDIAN',
       'SHROOMLIGHT'].includes(m)) return 'nether';
  if (m.startsWith('END_') || m.startsWith('PURPUR_') || m.startsWith('CHORUS_') ||
      ['DRAGON_EGG', 'ENDER_CHEST'].includes(m)) return 'end';
  if (m.startsWith('REDSTONE_') ||
      ['REPEATER', 'COMPARATOR', 'PISTON', 'STICKY_PISTON', 'OBSERVER', 'DISPENSER', 'DROPPER', 'HOPPER',
       'DAYLIGHT_DETECTOR', 'TARGET', 'LEVER', 'NOTE_BLOCK', 'JUKEBOX', 'CRAFTING_TABLE', 'FURNACE',
       'BLAST_FURNACE', 'SMOKER', 'ANVIL', 'CHIPPED_ANVIL', 'DAMAGED_ANVIL', 'GRINDSTONE', 'STONECUTTER',
       'LOOM', 'SMITHING_TABLE', 'CARTOGRAPHY_TABLE', 'FLETCHING_TABLE', 'BREWING_STAND', 'CAULDRON',
       'COMPOSTER', 'BARREL', 'LECTERN', 'BELL', 'LIGHTNING_ROD', 'TRAPPED_CHEST', 'CHEST', 'SHULKER_BOX',
       'ENCHANTING_TABLE', 'BEACON', 'CONDUIT', 'SPAWNER', 'SCAFFOLDING', 'HONEY_BLOCK', 'SLIME_BLOCK',
       'TNT', 'TRIPWIRE_HOOK', 'TRIPWIRE'].includes(m) ||
      m.endsWith('_BUTTON') || m.endsWith('_PRESSURE_PLATE') || m.endsWith('_FENCE_GATE')) return 'tech';
  if (['GLASS', 'TINTED_GLASS', 'GLASS_PANE', 'STONE_BRICKS', 'MOSSY_STONE_BRICKS', 'CRACKED_STONE_BRICKS',
       'CHISELED_STONE_BRICKS', 'BRICKS', 'QUARTZ_BLOCK', 'SANDSTONE', 'RED_SANDSTONE', 'SMOOTH_SANDSTONE',
       'CUT_SANDSTONE', 'CHISELED_SANDSTONE', 'CUT_RED_SANDSTONE', 'SMOOTH_RED_SANDSTONE', 'TERRACOTTA',
       'IRON_BLOCK', 'GOLD_BLOCK', 'DIAMOND_BLOCK', 'EMERALD_BLOCK', 'LAPIS_BLOCK', 'COAL_BLOCK',
       'SMOOTH_STONE', 'PRISMARINE', 'PRISMARINE_BRICKS', 'DARK_PRISMARINE', 'SEA_LANTERN',
       'BONE_BLOCK', 'OBSIDIAN'].includes(m) ||
      m.endsWith('_STAINED_GLASS') || m.endsWith('_STAINED_GLASS_PANE') ||
      m.endsWith('_CONCRETE') || m.endsWith('_CONCRETE_POWDER') ||
      m.endsWith('_WOOL') || m.endsWith('_CARPET') ||
      m.endsWith('_GLAZED_TERRACOTTA') ||
      m.endsWith('_PLANKS') || m.endsWith('_SLAB') || m.endsWith('_STAIRS') || m.endsWith('_FENCE') ||
      m.endsWith('_WALL') || m.endsWith('_DOOR') || m.endsWith('_TRAPDOOR') || m.endsWith('_SIGN') ||
      m.endsWith('_BANNER') || m.endsWith('_BED') ||
      m.startsWith('QUARTZ_') ||
      (m.includes('COPPER') && !m.includes('ORE')) ||
      m.startsWith('WAXED_')) return 'building';
  return 'nature';
}

function getTimeRangeStart(timeRange) {
  if (timeRange === 'day') { const d = new Date(); d.setDate(d.getDate() - 1); return d; }
  if (timeRange === 'week') { const d = new Date(); d.setDate(d.getDate() - 7); return d; }
  if (timeRange === 'month') { const d = new Date(); d.setMonth(d.getMonth() - 1); return d; }
  if (timeRange === 'year') { const d = new Date(); d.setFullYear(d.getFullYear() - 1); return d; }
  return null; // 'all'
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { slug, server_slug, project_slug, game_mode, world_name, time_range } = body;

    // Accept both slug and server_slug for plugin/website compatibility
    const resolvedSlug = slug || server_slug;
    if (typeof resolvedSlug !== 'string' || resolvedSlug.length === 0 || resolvedSlug.length > 32) {
      return Response.json({ error: 'Invalid slug' }, { status: 400 });
    }
    if (typeof project_slug !== 'string' || project_slug.length === 0 || project_slug.length > 64) {
      return Response.json({ error: 'Invalid project_slug' }, { status: 400 });
    }

    const gameMode = (typeof game_mode === 'string' && game_mode.length > 0) ? game_mode.toUpperCase() : 'SURVIVAL';
    const worldFilter = (typeof world_name === 'string' && world_name.length > 0 && world_name !== 'ALL') ? world_name : null;
    const timeRange = (typeof time_range === 'string') ? time_range.toLowerCase() : 'all';

    const base44 = createClientFromRequest(req);

    // Plugin auth: Bearer token with f0f_live_ API key — skip web panel password
    const authHeader = req.headers.get('authorization') || '';
    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    const apiKey = bearerMatch ? bearerMatch[1].trim() : null;
    const isPluginKey = apiKey && apiKey.startsWith('f0f_live_');

    let server;
    if (isPluginKey) {
      // Plugin request: authenticate via API key hash
      const keyHash = await sha256(apiKey);
      const keyServers = await base44.asServiceRole.entities.Server.filter({ api_key_hash: keyHash });
      if (!keyServers || keyServers.length === 0) {
        return Response.json({ success: false, error: 'Invalid API key' }, { status: 401 });
      }
      server = keyServers[0];
      // Verify the slug matches this server
      if (server.server_slug !== resolvedSlug) {
        return Response.json({ success: false, error: 'Server slug mismatch' }, { status: 403 });
      }
    } else {
      // Website request: lookup by slug, apply web panel password protection
      const servers = await base44.asServiceRole.entities.Server.filter({ server_slug: resolvedSlug });
      if (!servers || servers.length === 0) {
        return Response.json({ error: 'Server not found' }, { status: 404 });
      }
      server = servers[0];

      if (server.webpanel_password_enabled) {
        const token = body.access_token;
        if (!token) return Response.json({ error: 'Password required', password_required: true }, { status: 403 });
        const expectedToken = await sha256(server.server_slug + ':' + (server.webpanel_password_hash || '') + ':' + server.id);
        if (token !== expectedToken) return Response.json({ error: 'Invalid token', password_required: true }, { status: 403 });
      }
    }

    // Find project
    const projects = await base44.asServiceRole.entities.Project.filter({ server_id: server.id, project_slug });
    if (!projects || projects.length === 0) {
      return Response.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    const project = projects[0];

    // Fetch project-scoped stats
    const useDaily = timeRange !== 'all';
    let stats;
    if (useDaily) {
      const startDate = getTimeRangeStart(timeRange);
      const startStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(startDate);
      const allDaily = await base44.asServiceRole.entities.DailyBlockStat.filter(
        { server_id: server.id, project_slug }, '-date', 10000
      );
      stats = allDaily.filter(d => d.date >= startStr);
    } else {
      stats = await base44.asServiceRole.entities.BlockStat.filter(
        { server_id: server.id, project_slug }, '-created_date', 10000
      );
    }

    let totalMined = 0, totalPlaced = 0;
    const materialMap = {};
    const playerMap = {};
    const categoryMap = {};
    const worldMap = {};

    for (const stat of stats) {
      const mined = stat.mined || 0;
      const placed = stat.placed || 0;
      const gm = stat.game_mode || 'SURVIVAL';
      if (gameMode !== 'ALL' && gm !== gameMode) continue;
      if (worldFilter && (stat.world_name || 'world') !== worldFilter) continue;

      totalMined += mined;
      totalPlaced += placed;

      const cat = getMaterialCategory(stat.material);
      if (!categoryMap[cat]) categoryMap[cat] = { mined: 0, placed: 0, total: 0 };
      categoryMap[cat].mined += mined;
      categoryMap[cat].placed += placed;
      categoryMap[cat].total += mined + placed;

      const wn = stat.world_name || 'world';
      if (!worldMap[wn]) worldMap[wn] = { mined: 0, placed: 0, total: 0 };
      worldMap[wn].mined += mined;
      worldMap[wn].placed += placed;
      worldMap[wn].total += mined + placed;

      if (!materialMap[stat.material]) materialMap[stat.material] = { material: stat.material, mined: 0, placed: 0 };
      materialMap[stat.material].mined += mined;
      materialMap[stat.material].placed += placed;

      if (!playerMap[stat.uuid]) playerMap[stat.uuid] = { uuid: stat.uuid, player_name: stat.player_name, mined: 0, placed: 0 };
      playerMap[stat.uuid].mined += mined;
      playerMap[stat.uuid].placed += placed;
    }

    // Get distinct worlds available
    const worldNames = [...new Set(stats.map(s => s.world_name || 'world'))].sort();

    // Get members — formal ProjectMember records (may be empty if plugin doesn't call joinProject)
    const memberRecords = await base44.asServiceRole.entities.ProjectMember.filter(
      { server_id: server.id, project_slug, left_at: null }, '-created_date', 500
    );

    // Get available game modes
    const gameModeSet = new Set();
    for (const s of stats) gameModeSet.add(s.game_mode || 'SURVIVAL');
    const gameModes = [...gameModeSet].map(gm => ({ game_mode: gm }));

    const topMaterials = Object.values(materialMap)
      .map(m => ({ ...m, total: m.mined + m.placed }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 25);

    const contributors = Object.values(playerMap)
      .map(p => ({ ...p, total: p.mined + p.placed }))
      .sort((a, b) => b.total - a.total);

    const topContributor = contributors[0] || null;
    const topBlock = topMaterials[0] || null;
    const netBuildGain = totalPlaced - totalMined;

    // Members: prefer ProjectMember records; fall back to distinct contributors from stats
    let members = memberRecords;
    if (!members || members.length === 0) {
      members = contributors.map(c => ({
        uuid: c.uuid, player_name: c.player_name, joined_at: null
      }));
    }

    // Activity timeline from DailyBlockStat
    let timeline = [];
    if (!useDaily) {
      const allDaily = await base44.asServiceRole.entities.DailyBlockStat.filter(
        { server_id: server.id, project_slug }, 'date', 10000
      );
      const timelineMap = {};
      for (const d of allDaily) {
        const gm = d.game_mode || 'SURVIVAL';
        if (gameMode !== 'ALL' && gm !== gameMode) continue;
        if (worldFilter && (d.world_name || 'world') !== worldFilter) continue;
        if (!timelineMap[d.date]) timelineMap[d.date] = { date: d.date, mined: 0, placed: 0 };
        timelineMap[d.date].mined += d.mined || 0;
        timelineMap[d.date].placed += d.placed || 0;
      }
      timeline = Object.values(timelineMap).sort((a, b) => a.date.localeCompare(b.date));
    } else {
      const tlMap = {};
      for (const s of stats) {
        const date = s.date;
        if (!date) continue;
        if (!tlMap[date]) tlMap[date] = { date, mined: 0, placed: 0 };
        tlMap[date].mined += s.mined || 0;
        tlMap[date].placed += s.placed || 0;
      }
      timeline = Object.values(tlMap).sort((a, b) => a.date.localeCompare(b.date));
    }

    // Material categories + world distribution with top players
    const materialCategories = Object.entries(categoryMap)
      .map(([cat, data]) => ({
        category: cat, ...data,
        pct: totalMined + totalPlaced > 0 ? Math.round(data.total / (totalMined + totalPlaced) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);

    const worldDistribution = Object.entries(worldMap)
      .map(([world, data]) => ({
        world, ...data,
        pct: totalMined + totalPlaced > 0 ? Math.round(data.total / (totalMined + totalPlaced) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);

    // Fun facts
    const fmt = (n) => n.toLocaleString('de-DE');
    const fmtMat = (m) => m.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const combined = totalMined + totalPlaced;
    const minerPct = combined > 0 ? Math.round((totalMined / combined) * 100) : 0;
    const builderPct = 100 - minerPct;
    const avgPerPlayer = contributors.length > 0 ? Math.round(combined / contributors.length) : 0;
    const blockDiversity = Object.keys(materialMap).length;
    const facts = [
      { icon: '⚖️', text: `This project is ${minerPct}% mining and ${builderPct}% building` },
      { icon: '🥇', text: topContributor ? `${topContributor.player_name} leads with ${fmt(topContributor.total)} blocks` : null },
      { icon: '📊', text: `Average ${fmt(avgPerPlayer)} blocks per contributor` },
      { icon: '🎨', text: `${blockDiversity} different block types used in this project` },
      { icon: '❤️', text: topBlock ? `${fmtMat(topBlock.material)} is the most used block (${fmt(topBlock.total)} actions)` : null },
      { icon: '🏗️', text: `Net build gain: ${fmt(netBuildGain)} blocks placed minus removed` },
    ].filter(f => f.text !== null);

    // Achievements (simplified project-level)
    const achievements = [
      { id: 'first_block', icon: '🧱', name: 'First Block', description: 'Place or mine the first block in this project', unlocked: combined > 0, progress: combined > 0 ? 100 : 0 },
      { id: 'builder_100', icon: '🏗️', name: 'Apprentice Builder', description: 'Place 100 blocks', unlocked: totalPlaced >= 100, progress: Math.min(100, Math.round(totalPlaced / 100 * 100)) },
      { id: 'builder_1000', icon: '🏰', name: 'Master Builder', description: 'Place 1,000 blocks', unlocked: totalPlaced >= 1000, progress: Math.min(100, Math.round(totalPlaced / 1000 * 100)) },
      { id: 'miner_100', icon: '⛏️', name: 'Apprentice Miner', description: 'Mine 100 blocks', unlocked: totalMined >= 100, progress: Math.min(100, Math.round(totalMined / 100 * 100)) },
      { id: 'miner_1000', icon: '💎', name: 'Master Miner', description: 'Mine 1,000 blocks', unlocked: totalMined >= 1000, progress: Math.min(100, Math.round(totalMined / 1000 * 100)) },
      { id: 'diverse_10', icon: '🎨', name: 'Block Connoisseur', description: 'Use 10 different block types', unlocked: blockDiversity >= 10, progress: Math.min(100, Math.round(blockDiversity / 10 * 100)) },
      { id: 'team_5', icon: '👥', name: 'Team Effort', description: 'Have 5 active members', unlocked: members.length >= 5, progress: Math.min(100, Math.round(members.length / 5 * 100)) },
      { id: 'mega_10k', icon: '🌟', name: 'Mega Project', description: 'Reach 10,000 total block actions', unlocked: combined >= 10000, progress: Math.min(100, Math.round(combined / 10000 * 100)) },
    ];

    return Response.json({
      success: true,
      project: {
        project_slug: project.project_slug,
        project_name: project.project_name,
        server_slug: server.server_slug,
        server_name: server.display_name,
        members: members.length,
        mined: totalMined,
        placed: totalPlaced,
        total: combined,
        net_build_gain: netBuildGain,
        top_block: topBlock ? topBlock.material : null,
        top_contributor: topContributor ? topContributor.player_name : null,
        created_at: project.created_date,
        last_activity_at: project.last_activity_at || null,
        archived: project.archived || false
      },
      contributors,
      topMaterials,
      materialCategories,
      worldDistribution,
      worldNames,
      gameModes,
      timeline,
      achievements,
      facts,
      memberList: members.map(m => ({ uuid: m.uuid, player_name: m.player_name, joined_at: m.joined_at }))
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});