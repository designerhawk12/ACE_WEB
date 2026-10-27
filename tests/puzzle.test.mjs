import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function loadSource(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { verifyAnswer, feedbackForWrongAttempt, MAX_WRONG_ATTEMPTS } = await loadSource('../src/lib/puzzleVerifier.ts');

test('Human Test accepts only 4 with surrounding whitespace', () => {
  for (const answer of ['4', ' 4 ', '\n4\t']) assert.equal(verifyAnswer(answer), true);
  for (const answer of ['', '3', '5', 'four', '44', '4 E', 'SEVENTEEN']) assert.equal(verifyAnswer(answer), false);
});

test('three wrong attempts give the requested feedback and then allow access', () => {
  assert.equal(MAX_WRONG_ATTEMPTS, 3);
  assert.equal(feedbackForWrongAttempt(1), 'NOT QUITE. TRY AGAIN.');
  assert.equal(feedbackForWrongAttempt(2), 'ONE MORE TRY. THIS IS NOT SUPPOSED TO BE HARD.');
  assert.equal(feedbackForWrongAttempt(3), 'FINE. THE ANSWER IS 4. YOU WIN ANYWAY.');
});
