import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

async function sha256(text) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { server_slug, password } = body;

    if (typeof server_slug !== 'string' || server_slug.length === 0 || server_slug.length > 32) {
      return Response.json({ error: 'Invalid server_slug' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    const servers = await base44.asServiceRole.entities.Server.filter({ server_slug });
    if (!servers || servers.length === 0) {
      return Response.json({ error: 'Server nicht gefunden' }, { status: 404 });
    }
    const server = servers[0];

    // If password protection is not enabled, no token needed
    if (!server.webpanel_password_enabled) {
      return Response.json({ password_required: false, access_token: null });
    }

    // Reject if password protection is enabled but no hash is configured
    if (typeof server.webpanel_password_hash !== 'string' || server.webpanel_password_hash.length === 0) {
      return Response.json({ error: 'Server password not configured' }, { status: 500 });
    }

    // Password protection is enabled — require password
    if (typeof password !== 'string' || password.length === 0) {
      return Response.json({ password_required: true, access_token: null });
    }

    // Hash the provided password and compare
    const passwordHash = await sha256(password);
    if (passwordHash !== server.webpanel_password_hash) {
      return Response.json({ error: 'Falsches Passwort' }, { status: 401 });
    }

    // Generate cryptographically random session token and store it on the server
    const accessToken = crypto.randomUUID();
    await base44.asServiceRole.entities.Server.update(server.id, { session_token: accessToken });

    return Response.json({ password_required: false, access_token: accessToken });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});