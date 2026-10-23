import type { ProblemStatement } from './event';

// This module is imported only through an import.meta.env.DEV branch.
export const previewStatement: ProblemStatement = {
  title: 'TEST PROBLEM STATEMENT',
  brief: 'This is development-only content used to verify the unlock flow.',
  rules: ['Testing content only. No competition brief or submission requirements have been released.'],
};
