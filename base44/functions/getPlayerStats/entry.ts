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
    const { uuid, player_name, game_mode: rawGameMode } = body;

    if (!uuid && !player_name) {
      return Response.json({ error: 'Either uuid or player_name is required' }, { status: 400 });
    }

    const gameMode = (typeof rawGameMode === 'string' && rawGameMode.length > 0)
      ? rawGameMode.toUpperCase()
      : 'SURVIVAL';

    // 6. Fetch all BlockStat records for this server
    const allStats = await base44.asServiceRole.entities.BlockStat.filter(
      { server_id: server.id }, '-created_date', 10000
    );

    // 7. Filter: prefer uuid, else case-insensitive player_name — only within this server
    let playerStats;
    if (uuid) {
      playerStats = allStats.filter(s => s.uuid === uuid);
    } else if (player_name) {
      const lowerName = String(player_name).toLowerCase();
      playerStats = allStats.filter(s => s.player_name && s.player_name.toLowerCase() === lowerName);
    }

    if (!playerStats || playerStats.length === 0) {
      return Response.json({
        success: true,
        server_slug: server.server_slug,
        player_name: player_name || null,
        game_mode: gameMode,
        stats: { mined: 0, placed: 0, total: 0 }
      });
    }

    // 8. Aggregate stats, filtered by game_mode
    let mined = 0, placed = 0;
    for (const s of playerStats) {
      const gm = (s.game_mode || 'SURVIVAL').toUpperCase();
      if (gameMode !== 'ALL' && gm !== gameMode) continue;
      mined += (s.mined || 0);
      placed += (s.placed || 0);
    }

    // Resolve display name from stats
    const resolvedName = playerStats[0].player_name || player_name || null;

    return Response.json({
      success: true,
      server_slug: server.server_slug,
      player_name: resolvedName,
      game_mode: gameMode,
      stats: {
        mined,
        placed,
        total: mined + placed
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});