import type { StoredOverride } from './overrideStore';

const headers = { 'Cache-Control': 'no-store, max-age=0', 'Content-Type': 'application/json; charset=utf-8' };

export function createPhaseHandler(read: () => Promise<StoredOverride>): () => Promise<Response> {
  return async () => {
    try {
      const value: unknown = await read();
      return Response.json({ manualPhaseOverride: value === 'puzzle' ? 'puzzle' : null }, { headers });
    } catch {
      // A broken/missing store cannot block the published automatic schedule.
      return Response.json({ manualPhaseOverride: null }, { headers });
    }
  };
}
