# Turing Protocol: testing and release

Public configuration remains `eventPhase: 'teaser'` in `src/config/event.ts`.
Normal development and production URLs show the teaser. There is no timed activation.

## Local test

Start Vite (`pnpm dev`) and open `http://localhost:3000/?preview=puzzle`.
The override is guarded by `import.meta.env.DEV`; production builds ignore it.
The original intro runs; Skip or Escape makes testing quicker.

Automated verifier/reconstruction checks: `node --test tests/puzzle.test.mjs`.
TypeScript: `pnpm exec tsc -b`. Production: `pnpm build`.

Read the five Japanese margin annotations in page order: hero, sequence,
understanding, challenge, footer. The rules disclose the numeral key and the
row-first coordinate convention. They do not collect the fragments for the player.
The arrows preserve the written order; the Japanese fragment labels are metadata,
not extra instructions to reverse a pair.

Wrong answers progressively offer four hints, then repeat the final hint without
lockout. Correct input is trimmed, uppercased, and compared as a SHA-256 digest
using Web Crypto. Use HTTPS or localhost. This is a client-side interaction gate,
not a security boundary: do not ship confidential material expecting a hash to hide it.

The input locks for a restrained confirmation rule, then the status and heading
change to ACCESS GRANTED. Preview alone loads a clearly marked dummy statement
from `src/config/puzzlePreview.ts`. That module is excluded from production builds.
Success persists for the current tab session with sessionStorage key
`ace-puzzle-unlocked`. The preview's DEV PREVIEW / RESET PUZZLE button clears it.
Storage failures retain a working in-memory flow but cannot preserve reload state.

## Release

Change only `eventPhase: 'teaser'` to `eventPhase: 'puzzle'` in
`src/config/event.ts`, then rebuild and redeploy. The built-in protocol is selected
when the phase is active and `puzzle` is null. No preview query is needed.

Before expecting a real brief to appear, populate `eventConfig.problemStatement`
with `{ title, brief, rules }`. With no real statement, success still works and
shows a brief-awaiting-release message; the development dummy never substitutes
for a real public brief. Existing registration/WhatsApp URLs still require real links.

Preserve the sequence teaser → puzzle → problem-unlocked → submission → closed.
Solving updates the visitor's local presentation; it does not rewrite global config.
An existing session unlock never overrides teaser, submission, or closed.

## Difficulty calibration

Intended path: notice the missing information (30–60 seconds), explore annotations
(2–4 minutes), convert numerals and order coordinates (1–2 minutes), then extract
letters and submit (30–60 seconds). No external Japanese knowledge is required.

The supplied puzzle supports this journey but does not enforce a duration. Its
answer is thematically related to the visible event identity, so a participant may
guess it. The grid alone does not specify the coordinate order, but neither that
fact nor client-side hashing prevents guesses or AI assistance. A measured 5–8
minute median requires a small first-time participant playtest; do not add artificial
waiting or claim a verified median without that test.
