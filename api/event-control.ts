import { createControlHandler } from '../server/controlCore';
import { readOverride, writeOverride } from '../server/overrideStore';

export const POST = createControlHandler({
  password: process.env.ACE_ADMIN_OVERRIDE_PASSWORD,
  read: readOverride,
  write: writeOverride,
});
