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

    const projectSlug = typeof body.project_slug === 'string' ? body.project_slug.trim() : '';
    if (projectSlug.length === 0 || projectSlug.length > 64) {
      return Response.json({ error: 'Invalid project_slug' }, { status: 400 });
    }

    const projects = await base44.asServiceRole.entities.Project.filter({
      server_id: server.id, project_slug: projectSlug
    });
    if (!projects || projects.length === 0) {
      return Response.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // Detach stats from the project: unset project_slug and project_name so the
    // block counts stay in the database and keep contributing to player overall
    // stats, but are no longer linked to this (now-deleted) project.
    // A new project with the same slug will start with fresh stats.
    let hasMore = true;
    while (hasMore) {
      const res = await base44.asServiceRole.entities.BlockStat.updateMany(
        { server_id: server.id, project_slug: projectSlug },
        { $unset: { project_slug: "", project_name: "" } }
      );
      hasMore = res && res.has_more === true;
    }
    hasMore = true;
    while (hasMore) {
      const res = await base44.asServiceRole.entities.DailyBlockStat.updateMany(
        { server_id: server.id, project_slug: projectSlug },
        { $unset: { project_slug: "", project_name: "" } }
      );
      hasMore = res && res.has_more === true;
    }

    // Delete the project record entirely
    await base44.asServiceRole.entities.Project.delete(projects[0].id);

    // Remove all member records for this project
    await base44.asServiceRole.entities.ProjectMember.deleteMany({
      server_id: server.id, project_slug: projectSlug
    });

    return Response.json({ success: true, deleted: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});