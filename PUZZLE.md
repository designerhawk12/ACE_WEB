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
understanding, challenge, participate (sections 01–05). The rules disclose the numeral key and the
row-first coordinate convention. They do not collect the fragments for the player.
The arrows preserve the written order. The rules hint that page structure matters,
and to begin at 起点 and finish at 終点, without giving away the numbered order.
The eleven extracted letters form a phrase; the full reconstruction is not printed in the UI.

Wrong answers progressively offer five hints, then repeat the final hint without
lockout. Correct input is trimmed, uppercased, stripped of all whitespace, and compared as a SHA-256 digest
using Web Crypto. Use HTTPS or localhost. This is a client-side interaction gate,
not a security boundary: do not ship confidential material expecting a hash to hide it.

The input locks for a restrained confirmation rule, then the status and heading
change to ACCESS GRANTED. Preview alone loads a clearly marked dummy statement
from `src/config/puzzlePreview.ts`. That module is excluded from production builds.
Success persists for the current tab session with sessionStorage key
`ace-puzzle-unlocked`. The preview's DEV PREVIEW / RESET PUZZLE button clears it.
The stored value is protocol-versioned so solutions to the previous puzzle do not
unlock the revised one. Refresh preserves a solution to the current protocol.
Storage failures retain a working in-memory flow but cannot preserve reload state.

## Release

Change only `eventPhase: 'teaser'` to `eventPhase: 'puzzle'` in
`src/config/event.ts`, then rebuild and redeploy. The built-in protocol is selected
when the phase is active and `puzzle` is null. No preview query is needed.

Before expecting a real brief to appear, populate `eventConfig.problemStatement`
with `{ title, brief, rules }`. With no real statement, success still works and
shows a brief-awaiting-release message; the development dummy never substitutes
for a real public brief. Existing registration/WhatsApp URLs still require real links.

## Second-stage submission

After unlock, a prominent NEXT PROTOCOL section follows the brief. It explains
that initial event registration is not PPT submission and participants must complete
a separate final form with participant/team details, selected problem statement,
and PPT upload. The same section is directly available in the `submission` phase.
It remains absent in teaser, before puzzle success, and in closed.

Set `eventConfig.submissionUrl` to the real final form URL. This is independent of
`registrationUrl`; a missing, placeholder, invalid, or duplicated registration URL
leaves the action disabled. No destination is invented.

Set `eventConfig.submissionDeadline` to an ISO 8601 timestamp with an explicit
timezone. It displays prominently in IST (Asia/Kolkata). Null or invalid values
show “To be announced”. This is display-only configuration, not timed activation.
Both new fields remain null until supplied. Details are collected in the external
form, not through a new website form.

Preserve the sequence teaser → puzzle → problem-unlocked → submission → closed.
Solving updates the visitor's local presentation; it does not rewrite global config.
An existing session unlock never overrides teaser, submission, or closed.

## Difficulty calibration

Intended path: notice the missing information (30–60 seconds), explore annotations
(2–4 minutes), convert numerals and order coordinates (1–2 minutes), then extract
letters and submit (30–60 seconds). No external Japanese knowledge is required.

The supplied puzzle supports this journey but does not enforce a duration. The
phrase is no longer the visible event identity. The grid alone does not specify
the coordinate order, but neither that
fact nor client-side hashing prevents guesses or AI assistance. A measured 5–8
minute median requires a small first-time participant playtest; do not add artificial
waiting or claim a verified median without that test.
