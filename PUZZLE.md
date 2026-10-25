# Enigma Protocol: testing and release

The public configuration remains `eventPhase: 'teaser'` in `src/config/event.ts`. There is no timed activation. The normal local URL and every production URL show the teaser.

## Local preview

Start Vite and open `http://localhost:3000/?preview=puzzle`. The override is guarded by `import.meta.env.DEV` and is ignored in a production build. The original intro runs; Skip Intro or Escape makes testing quicker. The challenge is self-contained: the exact ciphertext, Japanese instructions, and all Enigma settings appear in the challenge section, with rules expanded on arrival. The visitor can use a standard Enigma I/M3 simulator and enter the resulting English phrase.

The displayed settings are rotors I → II → III from left to right, ring A–A–A, starting position A–A–A, reflector B, and no plugboard pairs. The ciphertext is `OPZFQWVSLOM`. `node --test tests/puzzle.test.mjs` independently checks the standard `AAAAA` → `BDZGO` test vector, the displayed settings, and the ciphertext mapping. The puzzle was designed for a 2–5 minute solve, but that duration needs a participant playtest to confirm.

Wrong answers show one consistent error with no lockout. Correct input is trimmed, uppercased, stripped of spaces, and compared with a SHA-256 digest using Web Crypto. Use HTTPS or localhost. This is a client-side interaction gate, not a security boundary; do not rely on it to protect confidential material.

The input locks for a thin red confirmation rule. ACCESS GRANTED and a brief success line lead into the existing problem statement reveal. A clearly marked dummy statement loads only in the development preview and is excluded from production builds. Success persists for the current tab session with `sessionStorage` key `ace-puzzle-unlocked`. The stored value is versioned, so previous coordinate-puzzle unlocks no longer grant access. The development reset control clears it. If storage fails, the current in-memory unlock still works but will not survive reload.

## Release

Change `eventPhase: 'teaser'` to `eventPhase: 'puzzle'` in `src/config/event.ts`, then rebuild and redeploy. The built-in Enigma protocol is selected when the phase is active and `puzzle` is null. No preview query is needed.

Populate `eventConfig.problemStatement` with `{ title, brief, rules }` before expecting the real brief to appear. With no real statement, success still works and shows a brief-awaiting-release message. Development dummy content never substitutes for a real public brief. Registration and WhatsApp URLs also require the real links.

## Second-stage submission

After unlock, a NEXT PROTOCOL section follows the brief. Initial event registration does not submit a PPT. Participants must complete a separate form with participant or team details, selected problem statement, and PPT upload before the deadline. The same section is directly available in the `submission` phase. It is absent in teaser, before puzzle success, and in closed.

Set `eventConfig.submissionUrl` to the real final form URL, separately from `registrationUrl`. A missing, placeholder, invalid, or duplicated registration URL leaves the action disabled. Set `eventConfig.submissionDeadline` to an ISO 8601 timestamp with an explicit timezone. It displays in IST; null or invalid values show “To be announced”. Both fields remain null until supplied. No destination or deadline is invented, and these fields do not cause timed activation.

Preserve the sequence teaser → puzzle → problem-unlocked → submission → closed. Solving updates only the visitor's local presentation and does not rewrite global configuration. An existing session unlock never overrides teaser, submission, or closed.
