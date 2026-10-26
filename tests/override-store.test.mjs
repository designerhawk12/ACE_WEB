import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

test('Global Config batch write uses the global-config REST route for puzzle and automatic values', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', optimizeDeps: { noDiscovery: true } });
  const previous = {
    id: process.env.ACE_GLOBAL_CONFIG_ID,
    token: process.env.ACE_GLOBAL_CONFIG_WRITE_TOKEN,
    teamId: process.env.ACE_GLOBAL_CONFIG_TEAM_ID,
    fetch: globalThis.fetch,
  };
  const calls = [];
  try {
    process.env.ACE_GLOBAL_CONFIG_ID = 'ecfg_test';
    process.env.ACE_GLOBAL_CONFIG_WRITE_TOKEN = 'test-only-token';
    process.env.ACE_GLOBAL_CONFIG_TEAM_ID = 'team_test';
    globalThis.fetch = async (url, init) => {
      calls.push({ url: new URL(url), init });
      return Response.json({ status: 'ok' });
    };
    const { writeOverride } = await server.ssrLoadModule('/server/overrideStore.ts');
    await writeOverride('puzzle');
    await writeOverride(null);
    assert.equal(calls.length, 2);
    for (const call of calls) {
      assert.equal(call.url.origin, 'https://api.vercel.com');
      assert.equal(call.url.pathname, '/v1/global-config/ecfg_test/items');
      assert.equal(call.url.searchParams.get('teamId'), 'team_test');
      assert.equal(call.init.method, 'PATCH');
      assert.equal(call.init.headers.Authorization, 'Bearer test-only-token');
      assert.equal(call.init.headers['Content-Type'], 'application/json');
    }
    assert.deepEqual(JSON.parse(calls[0].init.body), { items: [{ operation: 'upsert', key: 'manualPhaseOverride', value: 'puzzle' }] });
    assert.deepEqual(JSON.parse(calls[1].init.body), { items: [{ operation: 'upsert', key: 'manualPhaseOverride', value: null }] });
  } finally {
    globalThis.fetch = previous.fetch;
    for (const [key, value] of Object.entries({ ACE_GLOBAL_CONFIG_ID: previous.id, ACE_GLOBAL_CONFIG_WRITE_TOKEN: previous.token, ACE_GLOBAL_CONFIG_TEAM_ID: previous.teamId })) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    await server.close();
  }
});

test('failed batch writes log only safe status and Vercel error details', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', optimizeDeps: { noDiscovery: true } });
  const previous = { id: process.env.ACE_GLOBAL_CONFIG_ID, token: process.env.ACE_GLOBAL_CONFIG_WRITE_TOKEN, fetch: globalThis.fetch, error: console.error };
  const logged = [];
  try {
    process.env.ACE_GLOBAL_CONFIG_ID = 'ecfg_test';
    process.env.ACE_GLOBAL_CONFIG_WRITE_TOKEN = 'test-only-token';
    globalThis.fetch = async () => Response.json({ error: { code: 'forbidden', message: 'Permission denied' } }, { status: 403 });
    console.error = message => logged.push(message);
    const { writeOverride } = await server.ssrLoadModule('/server/overrideStore.ts');
    await assert.rejects(writeOverride('puzzle'), /Global Config write failed/);
    assert.deepEqual(logged, ['Global Config write failed: 403 forbidden Permission denied']);
    assert.equal(logged[0].includes('test-only-token'), false);
  } finally {
    globalThis.fetch = previous.fetch;
    console.error = previous.error;
    if (previous.id === undefined) delete process.env.ACE_GLOBAL_CONFIG_ID; else process.env.ACE_GLOBAL_CONFIG_ID = previous.id;
    if (previous.token === undefined) delete process.env.ACE_GLOBAL_CONFIG_WRITE_TOKEN; else process.env.ACE_GLOBAL_CONFIG_WRITE_TOKEN = previous.token;
    await server.close();
  }
});
