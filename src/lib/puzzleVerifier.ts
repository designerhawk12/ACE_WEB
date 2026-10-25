// A client-side interaction gate, not protection for confidential content.
const ANSWER_DIGEST = '720599c0d838c856e8e1a8eb7dd86089f49aeb52f72d68584b6a2b8d5e32685e';
export const rejectionMessage = 'SEQUENCE REJECTED. VERIFY THE SETTINGS.';

export async function verifyAnswer(answer: string): Promise<boolean> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(answer.trim().toUpperCase().replace(/\s+/g, '')));
  const hex = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  return hex === ANSWER_DIGEST;
}
