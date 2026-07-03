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

    // 3-4. Hash API key
    const apiKeyHash = await hashApiKey(apiKey);

    const base44 = createClientFromRequest(req);

    // 5. Find server by key hash — auth validation BEFORE parsing body
    const servers = await base44.asServiceRole.entities.Server.filter({ api_key_hash: apiKeyHash });
    if (!servers || servers.length === 0) {
      return Response.json({ error: 'Server nicht gefunden – API-Key ungültig' }, { status: 401 });
    }
    const server = servers[0];

    // Parse body after auth confirmed
    const body = await req.json();
    const { player_name } = body;

    // Update webpanel password config if provided
    if (body.webpanel_password_enabled === true) {
      await base44.asServiceRole.entities.Server.update(server.id, {
        webpanel_password_enabled: true,
        webpanel_password_hash: body.webpanel_password_hash || server.webpanel_password_hash
      });
    } else if (body.webpanel_password_enabled === false) {
      await base44.asServiceRole.entities.Server.update(server.id, {
        webpanel_password_enabled: false,
        webpanel_password_hash: null
      });
    }

    if (!player_name || typeof player_name !== 'string' || player_name.length > 32) {
      return Response.json({ error: 'Invalid player_name' }, { status: 400 });
    }

    // 6. Delete only within this server — never global by player_name
    const playerStats = await base44.asServiceRole.entities.BlockStat.filter(
      { server_id: server.id, player_name: player_name }, '-created_date', 10000
    );

    if (!playerStats || playerStats.length === 0) {
      return Response.json({ success: true, deleted: 0, message: `Keine Stats für '${player_name}' gefunden` });
    }

    // Delete ALL stats for this player — includes project-scoped records (project_slug != null)
    await base44.asServiceRole.entities.BlockStat.deleteMany({
      server_id: server.id,
      player_name: player_name
    });
    await base44.asServiceRole.entities.DailyBlockStat.deleteMany({
      server_id: server.id,
      player_name: player_name
    });
    await base44.asServiceRole.entities.PlayerActivity.deleteMany({
      server_id: server.id,
      player_name: player_name
    });

    // Optionally reset only within a specific project if project_slug is provided
    // (above already covers this since it deletes ALL — this is just for the response)
    return Response.json({
      success: true,
      deleted: playerStats.length,
      player_name,
      message: `${playerStats.length} Stat-Einträge für '${player_name}' gelöscht (inkl. Projekt-Stats)`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});