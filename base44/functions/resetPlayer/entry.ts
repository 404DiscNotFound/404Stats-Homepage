import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    // Auth via API key (same as receiveStats)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Missing Authorization header' }, { status: 401 });
    }
    const apiKey = authHeader.replace('Bearer ', '');

    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(apiKey));
    const apiKeyHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    const body = await req.json();
    const { player_name } = body;

    if (!player_name) {
      return Response.json({ error: 'Missing player_name' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Find the server by API key hash
    const servers = await base44.asServiceRole.entities.Server.filter({ api_key_hash: apiKeyHash });
    if (!servers || servers.length === 0) {
      return Response.json({ error: 'Server nicht gefunden – API-Key ungültig' }, { status: 404 });
    }
    const server = servers[0];

    // Find all BlockStat records for this player on this server
    const playerStats = await base44.asServiceRole.entities.BlockStat.filter(
      { server_id: server.id, player_name: player_name }, '-created_date', 10000
    );

    if (!playerStats || playerStats.length === 0) {
      return Response.json({ success: true, deleted: 0, message: `Keine Stats für '${player_name}' gefunden` });
    }

    // Delete all records for this player
    await base44.asServiceRole.entities.BlockStat.deleteMany({
      server_id: server.id,
      player_name: player_name
    });

    return Response.json({
      success: true,
      deleted: playerStats.length,
      player_name,
      message: `${playerStats.length} Stat-Einträge für '${player_name}' gelöscht`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});