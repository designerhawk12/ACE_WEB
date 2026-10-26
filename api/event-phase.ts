import { readOverride } from '../server/overrideStore';
import { createPhaseHandler } from '../server/phaseCore';

export const GET = createPhaseHandler(readOverride);
