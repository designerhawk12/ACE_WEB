export type Domain = { id: string; name: string; description?: string };

type EventConfig = {
  registrationUrl: string;
  whatsappUrl: string;
  submissionUrl: string | null;
  domains: readonly Domain[];
};

// Public event links and participant-facing domain details.
export const eventConfig: EventConfig = {
  // LAUNCH BLOCKER: replace this placeholder with the real initial registration form.
  registrationUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSd19CzZZ30af_LDPY54VTQPymOe7A_tALptnVRXTBgC6MFTYA/viewform',
  // Verify the invitation in WhatsApp before publishing; syntax alone cannot confirm it is active.
  whatsappUrl: 'https://chat.whatsapp.com/IlVGvqCeiSN7LM8VBNl43n',
  // LAUNCH BLOCKER: add the second-stage PPT form separately; never reuse initial registration.
  submissionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdG48YxOZh6ZK9DNZx3a44zI1bTS-SC1-3zbAoEHXdhEIGCmQ/viewform',
  domains: [
    { id: 'finance', name: 'Finance', description: 'Payments, personal finance, banking, investing, budgeting, lending, and other financial workflows.' },
    { id: 'agriculture', name: 'Agriculture', description: 'Digital tools for farming, crop planning, field monitoring, agricultural operations, marketplaces, and farm productivity.' },
    { id: 'health-fitness', name: 'Health and Fitness', description: 'Tools for workouts, fitness tracking, wellness routines, nutrition, health habits, and personal performance.' },
    { id: 'education-student-productivity', name: 'Education and Student Productivity', description: 'Software for learning, studying, note-taking, collaboration, scheduling, assignments, research, and student workflows.' },
    { id: 'environmental-sustainability', name: 'Environmental Sustainability', description: 'Applications for reducing waste, using resources efficiently, tracking environmental impact, recycling, conservation, or sustainable habits.' },
    { id: 'cybersecurity-digital-forensics', name: 'Cybersecurity and Digital Forensics', description: 'Tools for protecting systems, monitoring security events, investigating incidents, identity and privacy, or analyzing digital evidence.' },
    { id: 'transportation-mobility', name: 'Transportation and Mobility', description: 'Software for navigation, commuting, public transport, ride services, traffic, routing, parking, and vehicle experiences.' },
    { id: 'digital-media-content', name: 'Digital Media and Content Platforms', description: 'Applications for creating, publishing, organizing, recommending, viewing, or interacting with video, audio, images, and written content.' },
    { id: 'industrial-automation', name: 'Industrial Automation', description: 'Software for monitoring or controlling machines, production, industrial processes, maintenance, and operational workflows.' },
    { id: 'ai-algorithm-transparency', name: 'AI and Algorithm Transparency', description: 'Applications involving AI decisions, recommendations, automation, or tools that explain model behavior, fairness, and algorithmic systems.' },
    { id: 'ecommerce-supply-chain-logistics', name: 'E-commerce — Supply Chain and Logistics', description: 'Software for online commerce, inventory, fulfillment, delivery, warehousing, procurement, tracking, or supply-chain coordination.' },
    { id: 'smart-buildings-energy', name: 'Smart Buildings and Energy', description: 'Applications for building automation, energy use, smart infrastructure, lighting, climate control, and facility management.' },
    { id: 'everyday-computing-system-utilities', name: 'Everyday Computing & System Utilities', description: 'Utilities for file management, system monitoring, device management, backup, search, productivity, and everyday computer workflows.' },
  ],
};

export function getPublicEventUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    if (url.hostname === 'example.com' || url.hostname.endsWith('.example.com')) return null;
    if (/placeholder|replace[-_]?me/i.test(url.pathname + url.search)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function getSubmissionUrl(): string | null {
  const url = getPublicEventUrl(eventConfig.submissionUrl);
  if (!url || url === getPublicEventUrl(eventConfig.registrationUrl)) return null;
  return url;
}

export const timelineMilestones = [
  { number: '01', name: 'Registration', note: 'Teams are welcome' },
  { number: '02', name: 'Domains', note: 'Choose your system' },
  { number: '03', name: 'PPT Submission', note: 'Show your process' },
  { number: '04', name: 'Shortlisting', note: 'Final review' },
  { number: '05', name: 'Presentations', note: 'Present your prototype' },
  { number: '06', name: 'Winner Announcement', note: 'Final result' },
] as const;
