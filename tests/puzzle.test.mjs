import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function loadSource(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { turingProtocol } = await loadSource('../src/config/turingProtocol.ts');
const { verifyAnswer, rejectionMessages } = await loadSource('../src/lib/puzzleVerifier.ts');

test('five page annotations yield seven valid grid positions and the intended word', async () => {
  assert.deepEqual(turingProtocol.grid.map(row => row.join('')), ['TEAV', 'RNOR', 'IEGH', 'SLED']);
  const numerals = { '一': 1, '二': 2, '三': 3, '四': 4 };
  const slots = ['hero', 'sequence', 'about', 'challenge', 'footer'];
  assert.deepEqual(Object.keys(turingProtocol.clues), slots);
  const pairs = slots.flatMap(slot => [...turingProtocol.clues[slot].matchAll(/([一二三四])・([一二三四])/g)].map(([, row, column]) => [numerals[row], numerals[column]]));
  assert.equal(pairs.length, 7);
  const word = pairs.map(([row, column]) => turingProtocol.grid[row - 1][column - 1]).join('');
  assert.equal(word, 'REVERSE');
  assert.equal(await verifyAnswer(word), true);
});

test('verification normalizes case and surrounding whitespace without ignoring internal errors', async () => {
  assert.equal(await verifyAnswer('  reverse \n'), true);
  assert.equal(await verifyAnswer('ReVeRsE'), true);
  for (const answer of ['', 'wrong', 'RE VERSE', 'REVERSES', 'ESREVER']) assert.equal(await verifyAnswer(answer), false);
});

test('hints retain four levels and disclose neither an extracted sequence nor an answer', () => {
  assert.equal(rejectionMessages.length, 4);
  for (const message of rejectionMessages) {
    assert.doesNotMatch(message, /REVERSE|[1-4][,.·][1-4]/i);
  }
});
