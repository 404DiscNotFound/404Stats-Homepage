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

    const materialMap = {};
    for (const stat of allStats) {
      if (!materialMap[stat.material]) {
        materialMap[stat.material] = { material: stat.material, mined: 0, placed: 0 };
      }
      materialMap[stat.material].mined += (stat.mined || 0);
      materialMap[stat.material].placed += (stat.placed || 0);
    }

    const materials = Object.values(materialMap)
      .map(m => ({ ...m, total: m.mined + m.placed }))
      .sort((a, b) => b.total - a.total);

    return Response.json({
      server: { slug: server.server_slug, display_name: server.display_name },
      materials,
      totalMaterials: materials.length,
      totals: {
        mined: materials.reduce((s, m) => s + m.mined, 0),
        placed: materials.reduce((s, m) => s + m.placed, 0),
        combined: materials.reduce((s, m) => s + m.total, 0)
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});