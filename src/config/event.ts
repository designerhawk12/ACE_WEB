export type Domain = { id: string; name: string; description?: string };

type EventConfig = {
  registrationUrl: string;
  whatsappUrl: string;
  domains: readonly Domain[];
};

// Public event links and participant-facing domain details.
export const eventConfig: EventConfig = {
  // LAUNCH BLOCKER: replace this placeholder with the real initial registration form.
  registrationUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSd19CzZZ30af_LDPY54VTQPymOe7A_tALptnVRXTBgC6MFTYA/viewform',
  // Verify the invitation in WhatsApp before publishing; syntax alone cannot confirm it is active.
  whatsappUrl: 'https://chat.whatsapp.com/IlVGvqCeiSN7LM8VBNl43n',
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

export const timelineMilestones = [
  {
    number: '01',
    name: 'Register Your Team',
    note: 'Start with event registration.',
    details: ['Complete the event registration form and follow its instructions.'],
    state: 'REGISTER',
  },
  {
    number: '02',
    name: 'Explore the Domains',
    note: 'Choose a system worth understanding.',
    details: [
      'Explore the available Domains and understand the event rules.',
      'Choose a suitable closed-source software product and identify a feature or limitation to work on.',
    ],
    state: 'EXPLORE',
  },
  {
    number: '03',
    name: 'Reverse Engineer & Build',
    note: 'Trace the logic, then make it work.',
    details: [
      'Analyze the selected software and understand how the chosen feature works.',
      'Develop a working prototype that recreates, improves, or reimagines the feature.',
      'Prepare a PPT to support your final presentation.',
    ],
    state: 'PROTOTYPE',
  },
  {
    number: '04',
    name: 'Present Your Prototype',
    note: 'Every registered team moves directly to presentations.',
    details: [
      'All registered teams proceed directly to the presentation round.',
      'Demonstrate the working prototype and explain your analysis, implementation, and improvements.',
      'Use a PPT as supporting material during the presentation, if required.',
      'There is no preliminary PPT submission or shortlisting round.',
    ],
    state: 'ALL TEAMS',
  },
] as const;
