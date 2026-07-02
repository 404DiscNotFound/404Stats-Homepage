import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Missing Authorization header' }, { status: 401 });
    }
    const apiKey = authHeader.replace('Bearer ', '');

    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(apiKey));
    const apiKeyHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    const body = await req.json();
    const base44 = createClientFromRequest(req);

    // Find or create server by API key hash
    const existing = await base44.asServiceRole.entities.Server.filter({ api_key_hash: apiKeyHash });
    let server;
    if (existing && existing.length > 0) {
      server = existing[0];
      if (body.server_name && !server.display_name) {
        await base44.asServiceRole.entities.Server.update(server.id, { display_name: body.server_name });
        server.display_name = body.server_name;
      }
    } else {
      const serverSlug = apiKeyHash.substring(0, 8);
      server = await base44.asServiceRole.entities.Server.create({
        api_key_hash: apiKeyHash,
        server_slug: serverSlug,
        display_name: body.server_name || null
      });
    }

    // Process stats
    const stats = body.stats || [];
    if (stats.length === 0) {
      return Response.json({ success: true, server_slug: server.server_slug, processed: 0 });
    }

    // Fetch existing stats for this server in one query
    const existingStats = await base44.asServiceRole.entities.BlockStat.filter(
      { server_id: server.id }, '-created_date', 10000
    );
    const statMap = {};
    for (const s of existingStats) {
      statMap[s.uuid + ':' + s.material] = s;
    }

    // Accumulate all deltas into statMap first
    for (const stat of stats) {
      const { uuid, player_name, material, mined_delta = 0, placed_delta = 0 } = stat;
      if (!uuid || !player_name || !material) continue;

      const key = uuid + ':' + material;
      if (statMap[key]) {
        statMap[key].mined = (statMap[key].mined || 0) + mined_delta;
        statMap[key].placed = (statMap[key].placed || 0) + placed_delta;
        statMap[key].player_name = player_name;
      } else {
        statMap[key] = {
          server_id: server.id, uuid, player_name, material,
          mined: mined_delta, placed: placed_delta,
          _isNew: true
        };
      }
    }

    // Build update/create payloads from accumulated values
    const toUpdate = [];
    const toCreate = [];
    for (const key in statMap) {
      const s = statMap[key];
      if (s._isNew) {
        const { _isNew, ...createData } = s;
        toCreate.push(createData);
      } else {
        toUpdate.push({ id: s.id, mined: s.mined, placed: s.placed, player_name: s.player_name });
      }
    }

    if (toUpdate.length > 0) {
      await base44.asServiceRole.entities.BlockStat.bulkUpdate(toUpdate);
    }
    if (toCreate.length > 0) {
      await base44.asServiceRole.entities.BlockStat.bulkCreate(toCreate);
    }

    // Process daily stats (for time-based filtering)
    const today = new Date().toISOString().split('T')[0];
    const existingDaily = await base44.asServiceRole.entities.DailyBlockStat.filter(
      { server_id: server.id, date: today }, '-created_date', 10000
    );
    const dailyMap = {};
    for (const s of existingDaily) {
      dailyMap[s.uuid + ':' + s.material] = s;
    }

    for (const stat of stats) {
      const { uuid, player_name, material, mined_delta = 0, placed_delta = 0 } = stat;
      if (!uuid || !player_name || !material) continue;
      const key = uuid + ':' + material;
      if (dailyMap[key]) {
        dailyMap[key].mined = (dailyMap[key].mined || 0) + mined_delta;
        dailyMap[key].placed = (dailyMap[key].placed || 0) + placed_delta;
        dailyMap[key].player_name = player_name;
      } else {
        dailyMap[key] = {
          server_id: server.id, uuid, player_name, material, date: today,
          mined: mined_delta, placed: placed_delta,
          _isNew: true
        };
      }
    }

    const dailyToUpdate = [];
    const dailyToCreate = [];
    for (const key in dailyMap) {
      const s = dailyMap[key];
      if (s._isNew) {
        const { _isNew, ...createData } = s;
        dailyToCreate.push(createData);
      } else {
        dailyToUpdate.push({ id: s.id, mined: s.mined, placed: s.placed, player_name: s.player_name });
      }
    }

    if (dailyToUpdate.length > 0) {
      await base44.asServiceRole.entities.DailyBlockStat.bulkUpdate(dailyToUpdate);
    }
    if (dailyToCreate.length > 0) {
      await base44.asServiceRole.entities.DailyBlockStat.bulkCreate(dailyToCreate);
    }

    // Process activity stats (for heatmap) — track by day-of-week + hour
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();
    const existingActivity = await base44.asServiceRole.entities.PlayerActivity.filter(
      { server_id: server.id, day_of_week: dayOfWeek, hour: hour }, '-created_date', 10000
    );
    const activityMap = {};
    for (const a of existingActivity) {
      activityMap[a.uuid] = a;
    }
    for (const stat of stats) {
      const { uuid, player_name, mined_delta = 0, placed_delta = 0 } = stat;
      if (!uuid || !player_name) continue;
      if (activityMap[uuid]) {
        activityMap[uuid].mined = (activityMap[uuid].mined || 0) + mined_delta;
        activityMap[uuid].placed = (activityMap[uuid].placed || 0) + placed_delta;
        activityMap[uuid].player_name = player_name;
      } else {
        activityMap[uuid] = {
          server_id: server.id, uuid, player_name, day_of_week: dayOfWeek, hour: hour,
          mined: mined_delta, placed: placed_delta, _isNew: true
        };
      }
    }
    const activityToUpdate = [];
    const activityToCreate = [];
    for (const uuid in activityMap) {
      const a = activityMap[uuid];
      if (a._isNew) {
        const { _isNew, ...createData } = a;
        activityToCreate.push(createData);
      } else {
        activityToUpdate.push({ id: a.id, mined: a.mined, placed: a.placed, player_name: a.player_name });
      }
    }
    if (activityToUpdate.length > 0) {
      await base44.asServiceRole.entities.PlayerActivity.bulkUpdate(activityToUpdate);
    }
    if (activityToCreate.length > 0) {
      await base44.asServiceRole.entities.PlayerActivity.bulkCreate(activityToCreate);
    }

    return Response.json({
      success: true,
      server_slug: server.server_slug,
      processed: toUpdate.length + toCreate.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});