import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const INACTIVE_DAYS = 30;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Only allow authenticated admins to call this directly (scheduled runs bypass via service role)
    try {
      const user = await base44.auth.me();
      if (user && user.role !== 'admin') {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
    } catch {
      // No user — likely a scheduled invocation; allow via service role
    }

    const cutoff = new Date(Date.now() - INACTIVE_DAYS * 86400000).toISOString();

    // Find all servers — filter for inactive ones
    const allServers = await base44.asServiceRole.entities.Server.list('-created_date', 500);
    const inactive = allServers.filter(s => {
      const lastSeen = s.last_seen_at || s.created_date;
      return lastSeen < cutoff;
    });

    if (inactive.length === 0) {
      return Response.json({ success: true, deleted: 0, message: 'No inactive servers found' });
    }

    // Delete only the Server entity records.
    // BlockStat / DailyBlockStat / PlayerActivity data is intentionally KEPT
    // so global stats remain untouched and the deleted server's contribution persists.
    // The old data becomes orphaned (no Server entity references it),
    // so if the server re-registers it gets a clean slate (new server_id + slug),
    // while global stats still include the old data.
    for (const server of inactive) {
      await base44.asServiceRole.entities.Server.delete(server.id);
    }

    return Response.json({
      success: true,
      deleted: inactive.length,
      deleted_slugs: inactive.map(s => s.server_slug)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});