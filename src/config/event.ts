export type EventPhase = 'teaser' | 'quiz' | 'problems' | 'submission' | 'closed';

export const eventConfig: {
  eventPhase: EventPhase;
  registrationUrl: string;
  whatsappUrl: string;
} = {
  eventPhase: 'teaser',
  registrationUrl: 'https://example.com/register',
  whatsappUrl: 'https://chat.whatsapp.com/placeholder',
};
