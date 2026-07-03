import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

async function sha256(text) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

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
      return Response.json({ error: 'Server not found' }, { status: 404 });
    }
    const server = servers[0];

    if (server.webpanel_password_enabled) {
      const token = body.access_token;
      if (!token) return Response.json({ error: 'Password required', password_required: true }, { status: 403 });
      const expectedToken = await sha256(server.server_slug + ':' + (server.webpanel_password_hash || '') + ':' + server.id);
      if (token !== expectedToken) return Response.json({ error: 'Invalid token', password_required: true }, { status: 403 });
    }

    const projects = await base44.asServiceRole.entities.Project.filter(
      { server_id: server.id, archived: false }, '-last_activity_at', 500
    );

    // Fetch all project-scoped BlockStats
    const allStats = await base44.asServiceRole.entities.BlockStat.filter(
      { server_id: server.id, project_slug: { $ne: null } }, '-created_date', 10000
    );

    const projStats = {};
    const projContributors = {};
    const projTopBlock = {};
    for (const s of allStats) {
      if (!s.project_slug) continue;
      if (!projStats[s.project_slug]) {
        projStats[s.project_slug] = { mined: 0, placed: 0, total: 0 };
        projContributors[s.project_slug] = {};
        projTopBlock[s.project_slug] = {};
      }
      const mined = s.mined || 0;
      const placed = s.placed || 0;
      projStats[s.project_slug].mined += mined;
      projStats[s.project_slug].placed += placed;
      projStats[s.project_slug].total += mined + placed;

      if (!projContributors[s.project_slug][s.uuid]) {
        projContributors[s.project_slug][s.uuid] = { name: s.player_name, total: 0 };
      }
      projContributors[s.project_slug][s.uuid].total += mined + placed;

      if (!projTopBlock[s.project_slug][s.material]) {
        projTopBlock[s.project_slug][s.material] = 0;
      }
      projTopBlock[s.project_slug][s.material] += mined + placed;
    }

    // Count active members
    const allMembers = await base44.asServiceRole.entities.ProjectMember.filter(
      { server_id: server.id, left_at: null }, '-created_date', 5000
    );
    const memberCounts = {};
    for (const m of allMembers) {
      memberCounts[m.project_slug] = (memberCounts[m.project_slug] || 0) + 1;
    }

    const result = projects.map(p => {
      const st = projStats[p.project_slug] || { mined: 0, placed: 0, total: 0 };
      const contributors = Object.values(projContributors[p.project_slug] || {}).sort((a, b) => b.total - a.total);
      const topContributor = contributors[0] || null;
      const topBlockEntry = Object.entries(projTopBlock[p.project_slug] || {}).sort((a, b) => b[1] - a[1])[0];
      return {
        project_slug: p.project_slug,
        project_name: p.project_name,
        members: memberCounts[p.project_slug] || Object.keys(projContributors[p.project_slug] || {}).length || 0,
        total: st.total,
        mined: st.mined,
        placed: st.placed,
        net_build_gain: st.placed - st.mined,
        top_contributor: topContributor ? topContributor.name : null,
        top_block: topBlockEntry ? topBlockEntry[0] : null,
        last_activity_at: p.last_activity_at || null,
        created_at: p.created_date
      };
    });

    return Response.json({
      server: { slug: server.server_slug, display_name: server.display_name },
      projects: result
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});