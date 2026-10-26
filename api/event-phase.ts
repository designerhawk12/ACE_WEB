import { readOverride } from '../server/overrideStore.js';
import { createPhaseHandler } from '../server/phaseCore.js';

export const GET = createPhaseHandler(readOverride);
