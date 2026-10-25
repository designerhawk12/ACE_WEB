# Vercel deployment checklist

This repository is a single-page Vite application. It has no client router, server routes, or required environment variables. Keep the repository root (`acereverse`) as the Vercel project root. No `vercel.json` or rewrite is needed for the current `/` page and hash navigation.

Verify these settings in Vercel before publishing:

| Setting | Value |
| --- | --- |
| Production branch | `main` (the current local branch; confirm it is the intended remote branch) |
| Framework preset | Vite |
| Node.js version | 22.x (also declared in `package.json`) |
| Install command | Auto-detect from `pnpm-lock.yaml`; confirm the selected pnpm version in build logs |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Environment variables | None required by the current source |

The repository declares `pnpm@11.25.0` and includes a version 9 lockfile. pnpm 11 requires Node.js 22 or newer. Vercel's [package manager documentation](https://vercel.com/docs/package-managers) currently lists built-in pnpm versions only through 10, so a Vercel preview build must confirm how the declared pnpm 11 version is handled. If needed, configure a supported package manager version and regenerate the lockfile in a separate verified change, or use Vercel's documented Corepack path with Node.js 22 or newer. Do not assume a local Vite build proves Vercel installation. The site has not been deployed or pushed by this audit.

## Event values to provide

- Replace the `registrationUrl` placeholder in `src/config/event.ts` with the **initial event registration** Google Form. It is currently disabled by the URL validator.
- Set a separate `submissionUrl` to the **final PPT submission** Google Form. It is currently `null`, so all final submission actions are disabled.
- Add the confirmed Domains to `eventConfig.domains`. It is currently empty, so a solved participant sees “Domains will appear here.”
- Open the configured WhatsApp invitation in a browser or WhatsApp and confirm it joins the intended ACE group. A syntactically valid invitation is not proof that it remains active.
- Confirm both Google Forms accept the required details and uploads. Configure each form's own deadline or close each form separately at **29 October 2026, 18:30 IST** if direct submissions must stop. The website only disables its links; it cannot close the forms.

Release is **27 October 2026, 09:00 IST**. All other current closing times are **29 October 2026, 18:30 IST**. The frontend uses visitors' device clocks for visual transitions. Strict release, confidentiality, or deadline enforcement needs an authoritative server or provider-side controls. Do not bundle confidential Domain content before its intended release.
