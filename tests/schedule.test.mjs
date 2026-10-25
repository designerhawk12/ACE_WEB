import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/config/schedule.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { eventSchedule, eventTimes, getScheduleWindow, getEffectivePhase, canSolveAt, isRegistrationOpenAt, isSubmissionOpenAt, formatCountdown, getCountdown } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

const start = eventTimes.challengeStart;
const end = eventTimes.challengeEnd;

test('one IST schedule supplies every release and deadline', () => {
  assert.equal(eventSchedule.challengeStart, '2026-10-27T09:00:00+05:30');
  assert.equal(eventSchedule.challengeEnd, '2026-10-29T18:30:00+05:30');
  assert.equal(start, Date.parse('2026-10-27T03:30:00Z'));
  assert.equal(end, Date.parse('2026-10-29T13:00:00Z'));
  assert.equal(eventTimes.registrationEnd, end);
  assert.equal(eventTimes.problemStatementsStart, start);
  assert.equal(eventTimes.problemStatementsEnd, end);
  assert.equal(eventTimes.submissionStart, start);
  assert.equal(eventTimes.submissionDeadline, end);
});

test('public phase and solve permission switch at the exact boundaries', () => {
  assert.equal(getScheduleWindow(start - 1), 'upcoming');
  assert.equal(getEffectivePhase(start - 1, 'teaser', false, false), 'teaser');
  assert.equal(getEffectivePhase(start - 1, 'puzzle', false, false), 'teaser');
  assert.equal(getEffectivePhase(start - 1, 'teaser', false, true), 'teaser');
  assert.equal(getEffectivePhase(start - 1, 'teaser', true, false), 'puzzle');
  assert.equal(canSolveAt(start - 1, false), false);
  assert.equal(canSolveAt(start - 1, true), true);
  assert.equal(isRegistrationOpenAt(start - 1), true);
  assert.equal(isSubmissionOpenAt(start - 1), false);

  for (const at of [start, start + 3600000, end - 1]) {
    assert.equal(getScheduleWindow(at), 'live');
    assert.equal(getEffectivePhase(at, 'teaser', false, false), 'puzzle');
    assert.equal(getEffectivePhase(at, 'teaser', false, true), 'problem-unlocked');
    assert.equal(canSolveAt(at, false), true);
    assert.equal(isRegistrationOpenAt(at), true);
    assert.equal(isSubmissionOpenAt(at), true);
  }

  assert.equal(getScheduleWindow(end), 'ended');
  assert.equal(getEffectivePhase(end, 'teaser', false, false), 'closed');
  assert.equal(getEffectivePhase(end, 'teaser', true, false), 'closed');
  assert.equal(getEffectivePhase(end, 'teaser', false, true), 'problem-unlocked');
  assert.equal(canSolveAt(end, false), false);
  assert.equal(canSolveAt(end, true), false);
  assert.equal(isRegistrationOpenAt(end), false);
  assert.equal(isSubmissionOpenAt(end), false);
  assert.equal(getEffectivePhase(end, 'submission', false, false), 'submission');
});

test('timeline countdowns use total hours, switch labels, and never go negative', () => {
  assert.equal(formatCountdown(end, end - (66 * 3600 + 15 * 60 + 30) * 1000), '66HR 15MIN 30SEC');
  assert.equal(formatCountdown(end, end + 1000), '00HR 00MIN 00SEC');
  assert.deepEqual(getCountdown('registration', start - 1), { label: 'REGISTRATION CLOSES IN', value: formatCountdown(end, start - 1) });
  for (const kind of ['challenge', 'statements', 'submission']) {
    assert.deepEqual(getCountdown(kind, start - 1), { label: 'STARTS IN', value: '00HR 00MIN 01SEC' });
    assert.deepEqual(getCountdown(kind, start), { label: 'ENDS IN', value: formatCountdown(end, start) });
    assert.deepEqual(getCountdown(kind, end), { label: 'ENDED', value: null });
  }
  assert.deepEqual(getCountdown('registration', end), { label: 'REGISTRATIONS ENDED', value: null });
});
