import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { slug } = body;

    // Sanitize slug — must be a string, max 32 chars
    if (typeof slug !== 'string' || slug.length === 0 || slug.length > 32) {
      return Response.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    // Public read — data is intentionally public (RLS: read=true), service role needed for anonymous access
    const servers = await base44.asServiceRole.entities.Server.filter({ server_slug: slug });
    if (!servers || servers.length === 0) return Response.json({ error: 'Server nicht gefunden' }, { status: 404 });
    const server = servers[0];

    const dailyStats = await base44.asServiceRole.entities.DailyBlockStat.filter(
      { server_id: server.id }, '-created_date', 10000
    );

    const trendMap = {};
    for (const s of dailyStats) {
      if (!trendMap[s.date]) trendMap[s.date] = { date: s.date, mined: 0, placed: 0, gameModes: {} };
      trendMap[s.date].mined += (s.mined || 0);
      trendMap[s.date].placed += (s.placed || 0);

      const gm = s.game_mode || 'SURVIVAL';
      if (!trendMap[s.date].gameModes[gm]) trendMap[s.date].gameModes[gm] = { game_mode: gm, mined: 0, placed: 0, total: 0 };
      trendMap[s.date].gameModes[gm].mined += s.mined || 0;
      trendMap[s.date].gameModes[gm].placed += s.placed || 0;
      trendMap[s.date].gameModes[gm].total += (s.mined || 0) + (s.placed || 0);
    }

    const trends = Object.values(trendMap)
      .map(t => ({
        ...t,
        total: t.mined + t.placed,
        gameModes: Object.values(t.gameModes).sort((a, b) => b.total - a.total)
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);

    return Response.json({ trends });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});