import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function loadSource(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { enigmaProtocol } = await loadSource('../src/config/enigmaProtocol.ts');
const { verifyAnswer, rejectionMessage } = await loadSource('../src/lib/puzzleVerifier.ts');

// Independent Enigma I/M3 implementation using historical I, II, III and reflector B wirings.
function enigma(input) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const rotors = ['EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'AJDKSIRUXBLHWTMCQGZNPYFVOE', 'BDFHJLCPRTXVZNYEIWGAKMUSQO'];
  const reflector = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';
  const position = [0, 0, 0];
  return [...input].map(letter => {
    const middleAtNotch = position[1] === 4;
    const rightAtNotch = position[2] === 21;
    if (middleAtNotch) position[0] = (position[0] + 1) % 26;
    if (middleAtNotch || rightAtNotch) position[1] = (position[1] + 1) % 26;
    position[2] = (position[2] + 1) % 26;
    let index = alphabet.indexOf(letter);
    for (let rotor = 2; rotor >= 0; rotor--) index = (alphabet.indexOf(rotors[rotor][(index + position[rotor]) % 26]) - position[rotor] + 26) % 26;
    index = alphabet.indexOf(reflector[index]);
    for (let rotor = 0; rotor < 3; rotor++) index = (rotors[rotor].indexOf(alphabet[(index + position[rotor]) % 26]) - position[rotor] + 26) % 26;
    return alphabet[index];
  }).join('');
}

test('displayed Enigma I/M3 configuration decrypts its exact ciphertext', () => {
  assert.equal(enigma('AAAAA'), 'BDZGO'); // Standard AAA test vector.
  assert.equal(enigmaProtocol.ciphertext, 'OPZFQWVSLOM');
  assert.deepEqual(enigmaProtocol.settings.map(({ label, value }) => [label, value]), [
    ['機種', 'Enigma I（M3）'],
    ['ローターの順序（左から右）', 'I → II → III'],
    ['リング設定', 'A – A – A'],
    ['開始位置', 'A – A – A'],
    ['リフレクター', 'B'],
    ['プラグボード', '接続なし（ペアなし）'],
    ['暗号文', 'OPZFQWVSLOM'],
  ]);
  assert.equal(enigma(enigmaProtocol.ciphertext), 'THATWASFAST');
  assert.equal(enigma('THATWASFAST'), enigmaProtocol.ciphertext);
});

test('verification accepts the requested forms and rejects incorrect phrases', async () => {
  for (const answer of ['THATWASFAST', 'thatwasfast', 'THAT WAS FAST', 'That Was Fast', '  That Was Fast  ']) assert.equal(await verifyAnswer(answer), true);
  for (const answer of ['', 'wrong', 'REVERSE', 'THATWASFASTER', 'THAT-WAS-FAST']) assert.equal(await verifyAnswer(answer), false);
  assert.equal(rejectionMessage, 'SEQUENCE REJECTED. VERIFY THE SETTINGS.');
});
