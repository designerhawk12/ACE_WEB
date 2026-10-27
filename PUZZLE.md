# Human Test and event release

The public baseline remains `eventPhase: 'teaser'` in `src/config/event.ts`. The effective phase comes from the absolute IST timestamps in `src/config/schedule.ts`:

- Before 27 October 2026, 09:00 IST: teaser.
- From 27 October 2026, 09:00 IST to 29 October 2026, 18:30 IST: Human Test.
- At or after 29 October 2026, 18:30 IST: challenge ended. New answers, initial registrations, and PPT submissions are disabled in this UI.

The shared clock updates once per second, including after focus and visibility changes. An already solved tab retains the unlocked guide after the deadline, with expired submission actions disabled.
The existing Global Config `puzzle` override forces the Human Test; clearing it restores the automatic schedule.

## Preview and challenge

Start Vite and open `http://localhost:3000/?preview=puzzle` for an early development preview. The query is ignored by production builds. The cinematic intro still runs; Skip Intro or Escape bypasses it. Preview does not change countdown dates or open the real submission window early.

The Human Test asks how many E's are in "SEVENTEEN". The answer is `4`, with surrounding whitespace accepted. The first two wrong answers show playful feedback; a third wrong answer reveals `4` and unlocks the guide automatically. Wrong attempts persist within the browser session. `node --test tests/puzzle.test.mjs` checks answer normalization and feedback.

Correct answers and third-attempt completions reveal the participant guide and centrally configured Domains. The unlocked guide explains the separate PPT submission step. The final form action uses only `eventConfig.submissionUrl` and stays disabled if it is missing, invalid, or identical to the registration form.

The Human Test and session unlock are client-side interaction gates, not secure authorization. The existing session revision is retained so participants who already solved the previous challenge remain unlocked. Browser clock changes can alter visual phase timing. If Domain content must remain confidential before release or submissions must be strictly time-enforced, serve the content and validate deadlines through an authoritative backend or the form provider.

## Before launch

Verify the configured initial registration URL, final PPT submission URL, and Domains in `src/config/event.ts`. Open the configured WhatsApp invite and confirm it leads to the intended group. The two form URLs must remain distinct. Set the forms' own closing rules at 29 October 2026, 18:30 IST; disabling links on this site does not close direct form access.
