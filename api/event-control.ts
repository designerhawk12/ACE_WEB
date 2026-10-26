import { createControlHandler } from '../server/controlCore.js';
import { readOverride, writeOverride } from '../server/overrideStore.js';

export const POST = createControlHandler({
  password: process.env.ACE_ADMIN_OVERRIDE_PASSWORD,
  read: readOverride,
  write: writeOverride,
});
