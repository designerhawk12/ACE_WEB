import { get } from '@vercel/global-config';

export type StoredOverride = 'puzzle' | null;
const KEY = 'manualPhaseOverride';

function safeDiagnostic(value: unknown, token: string): string | null {
  if (typeof value !== 'string' || value.includes(token) || /bearer/i.test(value)) return null;
  const singleLine = value.replace(/\s+/g, ' ').trim();
  return /^[\w .,:;!?/()-]{1,160}$/.test(singleLine) ? singleLine : null;
}

export async function readOverride(): Promise<StoredOverride> {
  if (!process.env.GLOBAL_CONFIG) throw new Error('Global Config is unavailable');
  const value: unknown = await get(KEY);
  if (value !== null && value !== undefined && value !== 'puzzle') throw new Error('Invalid Global Config value');
  return value === 'puzzle' ? 'puzzle' : null;
}

export async function writeOverride(value: StoredOverride): Promise<void> {
  const id = process.env.ACE_GLOBAL_CONFIG_ID;
  const token = process.env.ACE_GLOBAL_CONFIG_WRITE_TOKEN;
  if (!id || !token) throw new Error('Global Config write access is unavailable');

  const url = new URL(`https://api.vercel.com/v1/global-config/${encodeURIComponent(id)}/items`);
  if (process.env.ACE_GLOBAL_CONFIG_TEAM_ID) url.searchParams.set('teamId', process.env.ACE_GLOBAL_CONFIG_TEAM_ID);
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ operation: 'upsert', key: KEY, value }] }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const error = payload && typeof payload === 'object' && 'error' in payload ? payload.error : null;
    const details = error && typeof error === 'object' ? error : null;
    const code = details && 'code' in details ? safeDiagnostic(details.code, token) : null;
    const message = details && 'message' in details ? safeDiagnostic(details.message, token) : null;
    console.error(`Global Config write failed: ${[response.status, code, message].filter(Boolean).join(' ')}`);
    throw new Error('Global Config write failed');
  }
}
