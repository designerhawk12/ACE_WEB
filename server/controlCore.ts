import { createHash, timingSafeEqual } from 'node:crypto';
import type { StoredOverride } from './overrideStore';

export type ControlOperation = 'authenticate' | 'force-puzzle' | 'automatic';
type Dependencies = {
  password: string | undefined;
  read: () => Promise<StoredOverride>;
  write: (value: StoredOverride) => Promise<void>;
  now?: () => number;
};

const failures = new Map<string, { count: number; until: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 5;
const headers = { 'Cache-Control': 'no-store, max-age=0', 'Content-Type': 'application/json; charset=utf-8' };

function response(body: object, status: number): Response {
  return Response.json(body, { status, headers });
}

export function passwordMatches(candidate: string, configured: string | undefined): boolean {
  if (!configured || !candidate) return false;
  const actual = createHash('sha256').update(candidate).digest();
  const expected = createHash('sha256').update(configured).digest();
  return timingSafeEqual(actual, expected);
}

export function createControlHandler(deps: Dependencies): (request: Request) => Promise<Response> {
  return async request => {
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return response({ error: 'Request unavailable.' }, 403);
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return response({ error: 'Request unavailable.' }, 415);
    const length = Number(request.headers.get('content-length') ?? 0);
    if (length > 1024) return response({ error: 'Request unavailable.' }, 413);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = deps.now?.() ?? Date.now();
    for (const [key, entry] of failures) if (entry.until <= now) failures.delete(key);
    const entry = failures.get(ip);
    if (entry && entry.count >= MAX_FAILURES && entry.until > now) return response({ error: 'Request unavailable.' }, 429);

    let body: unknown;
    try {
      const raw = await request.text();
      if (raw.length > 1024) return response({ error: 'Request unavailable.' }, 413);
      body = JSON.parse(raw);
    } catch { return response({ error: 'Request unavailable.' }, 400); }
    if (!body || typeof body !== 'object' || !('operation' in body) || !('password' in body)) return response({ error: 'Request unavailable.' }, 400);
    const { operation, password } = body;
    if ((operation !== 'authenticate' && operation !== 'force-puzzle' && operation !== 'automatic') || typeof password !== 'string' || password.length > 256) {
      return response({ error: 'Request unavailable.' }, 400);
    }
    if (!passwordMatches(password, deps.password)) {
      failures.set(ip, { count: (entry?.count ?? 0) + 1, until: now + WINDOW_MS });
      return response({ error: 'Request unavailable.' }, 401);
    }
    failures.delete(ip);

    try {
      if (operation === 'authenticate') {
        // Confirm the shared store is configured before claiming that controls are ready.
        return response({ authenticated: true, manualPhaseOverride: await deps.read() }, 200);
      }
      const value: StoredOverride = operation === 'force-puzzle' ? 'puzzle' : null;
      await deps.write(value);
      return response({ manualPhaseOverride: value }, 200);
    } catch {
      return response({ error: 'Control unavailable. Try again later.' }, 503);
    }
  };
}
