# Emergency puzzle control setup

The site follows its published schedule by default. The hidden control changes only the shared `manualPhaseOverride` value between `null` (automatic) and `"puzzle"` (force puzzle). Do not use the control unless the scheduled switch needs intervention.

## Vercel production setup

1. Create a Vercel Global Config store and connect it to this Vercel project for **Production**. The connection adds the server-only `GLOBAL_CONFIG` environment variable. Do not prefix it with `VITE_`.
2. Add the item `manualPhaseOverride` with JSON value `null`, or leave it absent. The deployed site then follows the existing IST schedule.
3. Set `ACE_ADMIN_OVERRIDE_PASSWORD` as a **Secret** environment variable for Production. Use a unique strong value that is not the public puzzle answer.
4. Create a Vercel API token with access to update this store. Set `ACE_GLOBAL_CONFIG_WRITE_TOKEN` as a **Secret** environment variable for Production. Keep the token server-only and scope it as narrowly as Vercel allows.
5. Set `ACE_GLOBAL_CONFIG_ID` to the store ID as a Production configuration variable. If the store belongs to a Vercel team, set `ACE_GLOBAL_CONFIG_TEAM_ID` to its team ID.
6. Redeploy after adding or changing environment variables. Do not connect a Preview deployment to the Production store with write credentials; use a separate Preview store and credentials if Preview admin testing is needed.

The root `api/event-phase.ts` Vercel Function reads the store using `@vercel/global-config`. The root `api/event-control.ts` Function validates the password and writes the item through Vercel's Global Config REST API. The browser never receives the write token or stored password. The public phase endpoint returns `null` when a store read fails, so the local automatic schedule keeps working. Browser tabs poll every 30 seconds and refresh on focus.

## Local development

`pnpm dev` runs Vite without Vercel Functions, so the hidden admin API is unavailable there. The existing `?preview=puzzle` remains the local puzzle preview. To test the Vercel Functions end to end, use Vercel's local runtime with test-only secrets and a separate test Global Config store.

The current rate limiter is a basic per-function-instance defense (five failed password attempts per IP in ten minutes). Vercel Functions can scale across instances, so production protection also depends on a unique strong password. Consider a Vercel WAF rate limit for `/api/event-control` if the endpoint will stay enabled for a long time.
