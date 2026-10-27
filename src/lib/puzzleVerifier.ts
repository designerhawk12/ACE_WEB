// This is a playful interaction gate, not protection for confidential content.
export const MAX_WRONG_ATTEMPTS = 3;

export function verifyAnswer(answer: string): boolean {
  return answer.trim() === '4';
}

export function feedbackForWrongAttempt(attempt: number): string {
  if (attempt >= MAX_WRONG_ATTEMPTS) return 'FINE. THE ANSWER IS 4. YOU WIN ANYWAY.';
  return attempt === 2 ? 'ONE MORE TRY. THIS IS NOT SUPPOSED TO BE HARD.' : 'NOT QUITE. TRY AGAIN.';
}
