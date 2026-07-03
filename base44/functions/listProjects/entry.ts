import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const API_KEY_REGEX = /^f0f_live_[A-Za-z0-9_-]{43}$/;

async function hashApiKey(apiKey) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(apiKey));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Missing Authorization header' }, { status: 401 });
    }
    const apiKey = authHeader.slice(7);
    if (!API_KEY_REGEX.test(apiKey)) {
      return Response.json({ error: 'Invalid API key format' }, { status: 401 });
    }
    const apiKeyHash = await hashApiKey(apiKey);

    const body = await req.json();
    const base44 = createClientFromRequest(req);

    const servers = await base44.asServiceRole.entities.Server.filter({ api_key_hash: apiKeyHash });
    if (!servers || servers.length === 0) {
      return Response.json({ error: 'Server not found' }, { status: 404 });
    }
    const server = servers[0];

    const includeArchived = body.include_archived === true;

    // Fetch all projects for this server
    let projects = await base44.asServiceRole.entities.Project.filter(
      { server_id: server.id }, '-last_activity_at', 500
    );
    if (!includeArchived) {
      projects = projects.filter(p => !p.archived);
    }

    // Fetch all project-scoped BlockStats in one query
    const allStats = await base44.asServiceRole.entities.BlockStat.filter(
      { server_id: server.id, project_slug: { $ne: null } }, '-created_date', 10000
    );

    // Aggregate per project_slug
    const projStats = {};
    for (const s of allStats) {
      if (!s.project_slug) continue;
      if (!projStats[s.project_slug]) projStats[s.project_slug] = { mined: 0, placed: 0, total: 0 };
      const mined = s.mined || 0;
      const placed = s.placed || 0;
      projStats[s.project_slug].mined += mined;
      projStats[s.project_slug].placed += placed;
      projStats[s.project_slug].total += mined + placed;
    }

    // Count active members per project
    const allMembers = await base44.asServiceRole.entities.ProjectMember.filter(
      { server_id: server.id, left_at: null }, '-created_date', 5000
    );
    const memberCounts = {};
    for (const m of allMembers) {
      memberCounts[m.project_slug] = (memberCounts[m.project_slug] || 0) + 1;
    }

    const result = projects.map(p => {
      const st = projStats[p.project_slug] || { mined: 0, placed: 0, total: 0 };
      return {
        project_slug: p.project_slug,
        project_name: p.project_name,
        members: memberCounts[p.project_slug] || 0,
        total: st.total,
        mined: st.mined,
        placed: st.placed,
        last_activity_at: p.last_activity_at || null,
        archived: p.archived || false
      };
    });

    return Response.json({ success: true, projects: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});