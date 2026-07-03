import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const API_KEY_REGEX = /^f0f_live_[A-Za-z0-9_-]{43}$/;

async function hashApiKey(apiKey) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(apiKey));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function slugifyProject(name) {
  return (name || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 32);
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

    // Update display_name + last_seen_at
    const nowIso = new Date().toISOString();
    await base44.asServiceRole.entities.Server.update(server.id, {
      display_name: body.server_name || server.display_name,
      last_seen_at: nowIso
    });

    const projectName = typeof body.project_name === 'string' ? body.project_name.trim() : '';
    if (projectName.length === 0 || projectName.length > 128) {
      return Response.json({ error: 'Invalid project_name' }, { status: 400 });
    }
    const createdByUuid = typeof body.created_by_uuid === 'string' ? body.created_by_uuid : '';
    const createdByName = typeof body.created_by_name === 'string' ? body.created_by_name : '';
    if (createdByUuid.length === 0) {
      return Response.json({ error: 'created_by_uuid is required' }, { status: 400 });
    }

    const projectSlug = slugifyProject(projectName);
    if (projectSlug.length === 0) {
      return Response.json({ error: 'Could not generate project slug from name' }, { status: 400 });
    }

    // Check if project already exists (not archived)
    const existing = await base44.asServiceRole.entities.Project.filter({
      server_id: server.id, project_slug: projectSlug
    });
    if (existing && existing.length > 0 && !existing[0].archived) {
      return Response.json({ success: false, error: 'Project already exists' });
    }

    // If an archived project with the same slug exists, reactivate it
    if (existing && existing.length > 0 && existing[0].archived) {
      await base44.asServiceRole.entities.Project.update(existing[0].id, {
        project_name: projectName,
        created_by_uuid: createdByUuid,
        created_by_name: createdByName,
        archived: false,
        last_activity_at: nowIso
      });
      return Response.json({ success: true, project_slug: projectSlug, project_name: projectName });
    }

    await base44.asServiceRole.entities.Project.create({
      server_id: server.id,
      server_slug: server.server_slug,
      project_slug: projectSlug,
      project_name: projectName,
      created_by_uuid: createdByUuid,
      created_by_name: createdByName,
      archived: false,
      last_activity_at: nowIso
    });

    return Response.json({ success: true, project_slug: projectSlug, project_name: projectName });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});