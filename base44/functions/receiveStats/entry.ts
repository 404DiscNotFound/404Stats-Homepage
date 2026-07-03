import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const API_KEY_REGEX = /^f0f_live_[A-Za-z0-9_-]{43}$/;

async function hashApiKey(apiKey) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(apiKey));
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    // 1. Extract Bearer token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Missing Authorization header' }, { status: 401 });
    }
    const apiKey = authHeader.slice(7);

    // 2. Validate API key format
    if (!API_KEY_REGEX.test(apiKey)) {
      return Response.json({ error: 'Invalid API key format' }, { status: 401 });
    }

    // 3-4. Hash the API key (never store raw key)
    const apiKeyHash = await hashApiKey(apiKey);

    const body = await req.json();
    const base44 = createClientFromRequest(req);
    const nowIso = new Date().toISOString();

    // 5-6. Find or auto-register server by key hash
    const existing = await base44.asServiceRole.entities.Server.filter({ api_key_hash: apiKeyHash });
    let server;
    if (existing && existing.length > 0) {
      server = existing[0];
      // 7. Update display_name + last_seen_at + password config on every call
      const updateData = {
        display_name: body.server_name || server.display_name,
        last_seen_at: nowIso
      };
      if (body.webpanel_password_enabled === true) {
        updateData.webpanel_password_enabled = true;
        updateData.webpanel_password_hash = body.webpanel_password_hash || server.webpanel_password_hash;
      } else if (body.webpanel_password_enabled === false) {
        updateData.webpanel_password_enabled = false;
        updateData.webpanel_password_hash = null;
      }
      await base44.asServiceRole.entities.Server.update(server.id, updateData);
      server.display_name = updateData.display_name;
      server.last_seen_at = nowIso;
    } else {
      // 6. Auto-register new server
      const serverSlug = apiKeyHash.substring(0, 8);
      server = await base44.asServiceRole.entities.Server.create({
        api_key_hash: apiKeyHash,
        server_slug: serverSlug,
        display_name: body.server_name || null,
        last_seen_at: nowIso,
        webpanel_password_enabled: body.webpanel_password_enabled === true,
        webpanel_password_hash: body.webpanel_password_enabled === true ? (body.webpanel_password_hash || null) : null
      });
    }

    // 8. Process stats
    const stats = body.stats || [];
    if (stats.length === 0) {
      return Response.json({ success: true, server_slug: server.server_slug, processed: 0 });
    }

    const normalizeGameMode = (gm) => {
      if (typeof gm !== 'string' || gm.length === 0 || gm.length > 32) return 'SURVIVAL';
      return gm.toUpperCase();
    };

    const normalizeProjectSlug = (ps) => {
      if (typeof ps !== 'string' || ps.length === 0 || ps.length > 64) return null;
      return ps;
    };
    const normalizeProjectName = (pn) => {
      if (typeof pn !== 'string' || pn.length === 0 || pn.length > 128) return null;
      return pn;
    };

    // --- BlockStat (aggregated totals) ---
    // When project_slug is set, we store an additional project-scoped record alongside the normal server record.
    // Normal (non-project) records are keyed without project_slug; project records include it.
    // To keep existing behavior intact, non-project stats use key without project prefix.
    const existingStats = await base44.asServiceRole.entities.BlockStat.filter(
      { server_id: server.id }, '-created_date', 10000
    );
    const statMap = {};
    for (const s of existingStats) {
      const gm = s.game_mode || 'SURVIVAL';
      const wn = s.world_name || 'world';
      const ps = s.project_slug || '';
      statMap[s.uuid + ':' + s.material + ':' + gm + ':' + wn + ':' + ps] = s;
    }
    for (const stat of stats) {
      const { uuid, player_name, material, mined_delta = 0, placed_delta = 0 } = stat;
      if (!uuid || !player_name || !material) continue;
      const game_mode = normalizeGameMode(stat.game_mode);
      const world_name = (typeof stat.world_name === 'string' && stat.world_name.length > 0 && stat.world_name.length <= 64) ? stat.world_name : 'world';
      const project_slug = normalizeProjectSlug(stat.project_slug);
      const project_name = normalizeProjectName(stat.project_name);

      // Normal (non-project) record — always stored, keeps existing dashboards working
      const normalKey = uuid + ':' + material + ':' + game_mode + ':' + world_name + ':';
      if (statMap[normalKey]) {
        statMap[normalKey].mined = (statMap[normalKey].mined || 0) + mined_delta;
        statMap[normalKey].placed = (statMap[normalKey].placed || 0) + placed_delta;
        statMap[normalKey].player_name = player_name;
      } else {
        statMap[normalKey] = {
          server_id: server.id, uuid, player_name, material, game_mode, world_name,
          project_slug: null, project_name: null,
          mined: mined_delta, placed: placed_delta, _isNew: true
        };
      }

      // Project-scoped record — only when project_slug is present
      if (project_slug) {
        const projKey = uuid + ':' + material + ':' + game_mode + ':' + world_name + ':' + project_slug;
        if (statMap[projKey]) {
          statMap[projKey].mined = (statMap[projKey].mined || 0) + mined_delta;
          statMap[projKey].placed = (statMap[projKey].placed || 0) + placed_delta;
          statMap[projKey].player_name = player_name;
          statMap[projKey].project_name = project_name || statMap[projKey].project_name;
        } else {
          statMap[projKey] = {
            server_id: server.id, uuid, player_name, material, game_mode, world_name,
            project_slug, project_name,
            mined: mined_delta, placed: placed_delta, _isNew: true
          };
        }

        // Update project last_activity_at
        // We do this in a batch below to avoid N queries
      }
    }
    const toUpdate = [];
    const toCreate = [];
    const projectSlugsTouched = new Set();
    for (const key in statMap) {
      const s = statMap[key];
      if (s._isNew) {
        const { _isNew, ...createData } = s;
        toCreate.push(createData);
      } else {
        const upd = { id: s.id, mined: s.mined, placed: s.placed, player_name: s.player_name, game_mode: s.game_mode || 'SURVIVAL', world_name: s.world_name || 'world' };
        if (s.project_slug) {
          upd.project_slug = s.project_slug;
          if (s.project_name) upd.project_name = s.project_name;
        }
        toUpdate.push(upd);
      }
      if (s.project_slug) projectSlugsTouched.add(s.project_slug);
    }
    if (toUpdate.length > 0) await base44.asServiceRole.entities.BlockStat.bulkUpdate(toUpdate);
    if (toCreate.length > 0) await base44.asServiceRole.entities.BlockStat.bulkCreate(toCreate);

    // Update last_activity_at for touched projects
    if (projectSlugsTouched.size > 0) {
      const touchedProjects = await base44.asServiceRole.entities.Project.filter(
        { server_id: server.id }
      );
      const nowIso2 = new Date().toISOString();
      const projUpdates = touchedProjects
        .filter(p => projectSlugsTouched.has(p.project_slug) && !p.archived)
        .map(p => ({ id: p.id, last_activity_at: nowIso2 }));
      if (projUpdates.length > 0) await base44.asServiceRole.entities.Project.bulkUpdate(projUpdates);
    }

    // --- DailyBlockStat (time-filtered queries) ---
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const existingDaily = await base44.asServiceRole.entities.DailyBlockStat.filter(
      { server_id: server.id, date: today }, '-created_date', 10000
    );
    const dailyMap = {};
    for (const s of existingDaily) {
      const gm = s.game_mode || 'SURVIVAL';
      const wn = s.world_name || 'world';
      const ps = s.project_slug || '';
      dailyMap[s.uuid + ':' + s.material + ':' + gm + ':' + wn + ':' + ps] = s;
    }
    for (const stat of stats) {
      const { uuid, player_name, material, mined_delta = 0, placed_delta = 0 } = stat;
      if (!uuid || !player_name || !material) continue;
      const game_mode = normalizeGameMode(stat.game_mode);
      const world_name = (typeof stat.world_name === 'string' && stat.world_name.length > 0 && stat.world_name.length <= 64) ? stat.world_name : 'world';
      const project_slug = normalizeProjectSlug(stat.project_slug);
      const project_name = normalizeProjectName(stat.project_name);

      // Normal record
      const normalKey = uuid + ':' + material + ':' + game_mode + ':' + world_name + ':';
      if (dailyMap[normalKey]) {
        dailyMap[normalKey].mined = (dailyMap[normalKey].mined || 0) + mined_delta;
        dailyMap[normalKey].placed = (dailyMap[normalKey].placed || 0) + placed_delta;
        dailyMap[normalKey].player_name = player_name;
      } else {
        dailyMap[normalKey] = {
          server_id: server.id, uuid, player_name, material, game_mode, world_name, date: today,
          project_slug: null, project_name: null,
          mined: mined_delta, placed: placed_delta, _isNew: true
        };
      }

      // Project-scoped record
      if (project_slug) {
        const projKey = uuid + ':' + material + ':' + game_mode + ':' + world_name + ':' + project_slug;
        if (dailyMap[projKey]) {
          dailyMap[projKey].mined = (dailyMap[projKey].mined || 0) + mined_delta;
          dailyMap[projKey].placed = (dailyMap[projKey].placed || 0) + placed_delta;
          dailyMap[projKey].player_name = player_name;
          dailyMap[projKey].project_name = project_name || dailyMap[projKey].project_name;
        } else {
          dailyMap[projKey] = {
            server_id: server.id, uuid, player_name, material, game_mode, world_name, date: today,
            project_slug, project_name,
            mined: mined_delta, placed: placed_delta, _isNew: true
          };
        }
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
        const upd = { id: s.id, mined: s.mined, placed: s.placed, player_name: s.player_name, game_mode: s.game_mode || 'SURVIVAL', world_name: s.world_name || 'world' };
        if (s.project_slug) {
          upd.project_slug = s.project_slug;
          if (s.project_name) upd.project_name = s.project_name;
        }
        dailyToUpdate.push(upd);
      }
    }
    if (dailyToUpdate.length > 0) await base44.asServiceRole.entities.DailyBlockStat.bulkUpdate(dailyToUpdate);
    if (dailyToCreate.length > 0) await base44.asServiceRole.entities.DailyBlockStat.bulkCreate(dailyToCreate);

    // --- PlayerActivity (heatmap) ---
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();
    const existingActivity = await base44.asServiceRole.entities.PlayerActivity.filter(
      { server_id: server.id, day_of_week: dayOfWeek, hour: hour }, '-created_date', 10000
    );
    const activityMap = {};
    for (const a of existingActivity) {
      const gm = a.game_mode || 'SURVIVAL';
      activityMap[a.uuid + ':' + gm] = a;
    }
    for (const stat of stats) {
      const { uuid, player_name, mined_delta = 0, placed_delta = 0 } = stat;
      if (!uuid || !player_name) continue;
      const game_mode = normalizeGameMode(stat.game_mode);
      const key = uuid + ':' + game_mode;
      if (activityMap[key]) {
        activityMap[key].mined = (activityMap[key].mined || 0) + mined_delta;
        activityMap[key].placed = (activityMap[key].placed || 0) + placed_delta;
        activityMap[key].player_name = player_name;
      } else {
        activityMap[key] = {
          server_id: server.id, uuid, player_name, game_mode, day_of_week: dayOfWeek, hour: hour,
          mined: mined_delta, placed: placed_delta, _isNew: true
        };
      }
    }
    const activityToUpdate = [];
    const activityToCreate = [];
    for (const key in activityMap) {
      const a = activityMap[key];
      if (a._isNew) {
        const { _isNew, ...createData } = a;
        activityToCreate.push(createData);
      } else {
        activityToUpdate.push({ id: a.id, mined: a.mined, placed: a.placed, player_name: a.player_name, game_mode: a.game_mode || 'SURVIVAL' });
      }
    }
    if (activityToUpdate.length > 0) await base44.asServiceRole.entities.PlayerActivity.bulkUpdate(activityToUpdate);
    if (activityToCreate.length > 0) await base44.asServiceRole.entities.PlayerActivity.bulkCreate(activityToCreate);

    // 9. Response — never return the API key
    return Response.json({
      success: true,
      server_slug: server.server_slug,
      processed: toUpdate.length + toCreate.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});