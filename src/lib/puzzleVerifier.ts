// A client-side interaction gate, not protection for confidential content.
const ANSWER_DIGEST = '27bed1691706535fdde1972863b745e226aa1b7f21d9b7e1d8c0f0e9516d8ab0';
export const rejectionMessages = [
  'SEQUENCE REJECTED. Recheck the page.',
  'Not every instruction is inside this terminal.',
  'Trace the annotations from the beginning of the page.',
  'Read the Japanese coordinate fragments in page order.',
] as const;

export async function verifyAnswer(answer: string): Promise<boolean> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(answer.trim().toUpperCase()));
  const hex = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  return hex === ANSWER_DIGEST;
}
