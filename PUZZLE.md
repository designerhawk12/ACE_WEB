# Enigma Protocol and event release

The public baseline remains `eventPhase: 'teaser'` in `src/config/event.ts`. The effective phase comes from the absolute IST timestamps in `src/config/schedule.ts`:

- Before 27 October 2026, 09:00 IST: teaser.
- From 27 October 2026, 09:00 IST to 29 October 2026, 18:30 IST: Enigma challenge.
- At or after 29 October 2026, 18:30 IST: challenge ended. New answers, initial registrations, and PPT submissions are disabled in this UI.

The shared clock updates once per second, including after focus and visibility changes. An already solved tab retains the unlocked guide after the deadline, with expired submission actions disabled.

## Preview and puzzle

Start Vite and open `http://localhost:3000/?preview=puzzle` for an early development preview. The query is ignored by production builds. The cinematic intro still runs; Skip Intro or Escape bypasses it. Preview does not change countdown dates or open the real submission window early.

The visible Enigma I/M3 settings are rotors I → II → III, rings A–A–A, starting positions A–A–A, reflector B, and no plugboard pairs. The ciphertext is `OPZFQWVSLOM`. `node --test tests/puzzle.test.mjs` independently checks these settings, the standard `AAAAA` → `BDZGO` vector, the intended decryption, and accepted answer formats.

Correct answers reveal the participant guide and centrally configured Domains. No test Domains or real event Domains are currently configured. The unlocked guide explains the separate PPT submission step. The final form action uses only `eventConfig.submissionUrl` and stays disabled if it is missing, invalid, or identical to the registration form.

The answer digest and session unlock are client-side interaction gates, not secrets or secure authorization. Browser clock changes can alter visual phase timing. If actual Domain content must remain confidential before release or submissions must be strictly time-enforced, serve the content and validate deadlines through an authoritative backend or the form provider.

## Before launch

Set the real initial registration URL, final PPT submission URL, and confirmed Domains in `src/config/event.ts`. Open the configured WhatsApp invite and confirm it leads to the intended group. The first two form URLs must remain distinct. Set the forms' own closing rules at 29 October 2026, 18:30 IST; disabling links on this site does not close direct form access.
