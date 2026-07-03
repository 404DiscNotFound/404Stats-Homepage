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
    const uuid = typeof body.uuid === 'string' ? body.uuid.trim() : '';
    const playerName = typeof body.player_name === 'string' ? body.player_name.trim() : '';
    if (projectSlug.length === 0 || uuid.length === 0 || playerName.length === 0) {
      return Response.json({ error: 'project_slug, uuid and player_name are required' }, { status: 400 });
    }

    // Verify project exists and is not archived
    const projects = await base44.asServiceRole.entities.Project.filter({
      server_id: server.id, project_slug: projectSlug
    });
    if (!projects || projects.length === 0 || projects[0].archived) {
      return Response.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    const project = projects[0];

    // Check for existing active membership
    const existing = await base44.asServiceRole.entities.ProjectMember.filter({
      server_id: server.id, project_slug: projectSlug, uuid: uuid, left_at: null
    });
    if (existing && existing.length > 0) {
      // Already a member — update name in case it changed
      await base44.asServiceRole.entities.ProjectMember.update(existing[0].id, { player_name: playerName });
      return Response.json({ success: true, project_slug: projectSlug, project_name: project.project_name });
    }

    // Check for previously-left membership — reactivate
    const oldMemberships = await base44.asServiceRole.entities.ProjectMember.filter({
      server_id: server.id, project_slug: projectSlug, uuid: uuid
    });
    if (oldMemberships && oldMemberships.length > 0) {
      await base44.asServiceRole.entities.ProjectMember.update(oldMemberships[0].id, {
        player_name: playerName, joined_at: new Date().toISOString(), left_at: null
      });
      return Response.json({ success: true, project_slug: projectSlug, project_name: project.project_name });
    }

    await base44.asServiceRole.entities.ProjectMember.create({
      server_id: server.id,
      server_slug: server.server_slug,
      project_slug: projectSlug,
      uuid: uuid,
      player_name: playerName,
      joined_at: new Date().toISOString(),
      left_at: null
    });

    return Response.json({ success: true, project_slug: projectSlug, project_name: project.project_name });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});