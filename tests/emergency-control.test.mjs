import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function loadPureTypeScript(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

const { nextTap } = await loadPureTypeScript('../src/lib/emergencyTap.ts');
const { createControlHandler } = await loadPureTypeScript('../server/controlCore.ts');
const { createPhaseHandler } = await loadPureTypeScript('../server/phaseCore.ts');

test('header trigger opens only on ten taps within seven seconds', () => {
  let sequence = { count: 0, startedAt: 0 };
  for (let count = 1; count <= 9; count++) {
    const result = nextTap(sequence, 1000 + count * 200);
    sequence = result.sequence;
    assert.equal(result.unlocked, false);
  }
  assert.equal(nextTap(sequence, 3000).unlocked, true);
  assert.equal(nextTap(sequence, 10000).sequence.count, 1);
});

test('expired tap window resets rather than unlocking', () => {
  let sequence = { count: 0, startedAt: 0 };
  for (let count = 0; count < 9; count++) sequence = nextTap(sequence, 1000 + count * 100).sequence;
  const result = nextTap(sequence, 9000);
  assert.equal(result.unlocked, false);
  assert.equal(result.sequence.count, 1);
});

function request(operation, password, ip = '192.0.2.8') {
  return new Request('https://ace.example/api/event-control', {
    method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://ace.example', 'x-forwarded-for': ip },
    body: JSON.stringify({ operation, password }),
  });
}

test('wrong password cannot change shared override; correct password authenticates and changes only allowed values', async () => {
  let value = null;
  let writes = 0;
  const handler = createControlHandler({ password: 'a-separate-test-secret', read: async () => value, write: async next => { value = next; writes++; } });
  assert.equal((await handler(request('force-puzzle', 'wrong'))).status, 401);
  assert.equal(value, null);
  assert.equal(writes, 0);
  const auth = await handler(request('authenticate', 'a-separate-test-secret'));
  assert.equal(auth.status, 200);
  assert.deepEqual(await auth.json(), { authenticated: true, manualPhaseOverride: null });
  assert.equal(writes, 0);
  assert.equal((await handler(request('force-puzzle', 'a-separate-test-secret'))).status, 200);
  assert.equal(value, 'puzzle');
  assert.equal((await handler(request('automatic', 'a-separate-test-secret'))).status, 200);
  assert.equal(value, null);
  assert.equal(writes, 2);
  assert.equal((await handler(request('submission', 'a-separate-test-secret'))).status, 400);
  assert.equal(writes, 2);
});

test('missing server secret, wrong origin and repeated failures stay closed', async () => {
  let writes = 0;
  const handler = createControlHandler({ password: undefined, read: async () => null, write: async () => { writes++; } });
  assert.equal((await handler(request('force-puzzle', 'anything', '192.0.2.9'))).status, 401);
  assert.equal(writes, 0);
  const crossOrigin = new Request('https://ace.example/api/event-control', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://other.example' }, body: JSON.stringify({ operation: 'force-puzzle', password: 'anything' }) });
  assert.equal((await handler(crossOrigin)).status, 403);
  const limited = createControlHandler({ password: 'another-test-secret', read: async () => null, write: async () => { writes++; } });
  for (let count = 0; count < 5; count++) assert.equal((await limited(request('authenticate', 'wrong', '192.0.2.10'))).status, 401);
  assert.equal((await limited(request('authenticate', 'another-test-secret', '192.0.2.10'))).status, 429);
  assert.equal(writes, 0);
});

test('public phase endpoint falls back to automatic for unavailable or malformed remote state', async () => {
  const live = await createPhaseHandler(async () => 'puzzle')();
  assert.deepEqual(await live.json(), { manualPhaseOverride: 'puzzle' });
  const malformed = await createPhaseHandler(async () => 'submission')();
  assert.deepEqual(await malformed.json(), { manualPhaseOverride: null });
  const unavailable = await createPhaseHandler(async () => { throw new Error('store unavailable'); })();
  assert.deepEqual(await unavailable.json(), { manualPhaseOverride: null });
});
