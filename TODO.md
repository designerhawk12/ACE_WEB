# TODO

## [x] Isolated intro placeholder
- Leave a full-screen dedicated `IntroPlaceholder` component where a custom cinematic mechanical typewriter intro will later be implemented.
- For now make it a simple black screen with an ENTER / SKIP placeholder.
- Keep it isolated from the rest of the site.

## [x] Hero and event challenge status
- Hero: ACE PRESENTS; Reverse Engineering; short event tagline.
- Current Challenge Status: large premium section with PROBLEM STATEMENTS and COMING SOON.
- Keep the teaser challenge section modular so later event phases can replace its content without rebuilding the site.

## [x] Primary actions and event explanation
- Provide REGISTER FOR EVENT and JOIN WHATSAPP GROUP as primary actions using placeholder URLs.
- Explain the reverse-engineering challenge in a short section.

## [x] Timeline and footer
- Include Registration Open, Challenge Unlock, Problem Statements, PPT Submission, and Shortlisting in a timeline/status section.
- Include ACE Club branding in the footer.

## [x] Phase-aware configuration
- Create an event configuration file with `eventPhase: "teaser" | "quiz" | "problems" | "submission" | "closed"`.
- Set `eventPhase` to `"teaser"` for now.
- Create modular components so later phases can replace the Coming Soon section without rebuilding the site.

## [x] Visual system, accessibility, and responsive behavior
- Build a production-quality React + TypeScript landing website using Tailwind, clean reusable components, and no unnecessary dependencies.
- Use a premium dark industrial/editorial design: black and near-black backgrounds, warm off-white typography, restrained red accent, thin engineering-grid lines, technical annotation motifs, schematic details, and subtle grain/noise.
- Do NOT use generic SaaS design, large gradient blobs, excessive glassmorphism, Matrix hacker visuals, random glowing neon elements, or stock dashboard components.
- Make the site responsive/mobile-first and accessible. Most students will enter by scanning a QR code on their phones; prioritize excellent typography, spacing, and layout.
- Do not attempt complex 3D animation yet.
