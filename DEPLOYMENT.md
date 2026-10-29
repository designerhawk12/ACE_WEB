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

## Participant-facing event details

- The registration form and WhatsApp invitation are configured in `src/config/event.ts`. Verify both links before publishing.
- The public event process has four stages, from team registration through the prototype presentation.
- Teams may use a PPT as supporting material during their presentation. There is no online PPT upload step or preliminary shortlisting round.
