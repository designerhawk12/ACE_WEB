import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

test('central links and seven-stage timeline keep forms distinct', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { eventConfig, getPublicEventUrl, getSubmissionUrl, timelineMilestones, phasePresentation } = await server.ssrLoadModule('/src/config/event.ts');
    assert.equal(eventConfig.eventPhase, 'teaser');
    assert.deepEqual(eventConfig.domains.map(({ id, name }) => [id, name]), [
      ['finance', 'Finance'],
      ['agriculture', 'Agriculture'],
      ['health-fitness', 'Health and Fitness'],
      ['education-student-productivity', 'Education and Student Productivity'],
      ['environmental-sustainability', 'Environmental Sustainability'],
      ['cybersecurity-digital-forensics', 'Cybersecurity and Digital Forensics'],
      ['transportation-mobility', 'Transportation and Mobility'],
      ['digital-media-content', 'Digital Media and Content Platforms'],
      ['industrial-automation', 'Industrial Automation'],
      ['ai-algorithm-transparency', 'AI and Algorithm Transparency'],
      ['ecommerce-supply-chain-logistics', 'E-commerce — Supply Chain and Logistics'],
      ['smart-buildings-energy', 'Smart Buildings and Energy'],
      ['everyday-computing-system-utilities', 'Everyday Computing & System Utilities'],
    ]);
    assert.ok(eventConfig.domains.every(({ description }) => description?.length > 30), 'each Domain needs a useful participant description');
    assert.deepEqual(timelineMilestones.map(({ name }) => name), [
      'Registration', 'Human Test', 'Domains', 'PPT Submission',
      'Shortlisting', 'Presentations', 'Winner Announcement',
    ]);
    assert.equal(timelineMilestones[1].note, 'Complete the quick check to access the Domains');
    assert.equal(eventConfig.puzzle?.question, 'How many E\'s are in "SEVENTEEN"?');
    assert.deepEqual(eventConfig.puzzle?.intro, ['We were going to make you decrypt Enigma.', 'Then we remembered you have classes.']);
    assert.equal(phasePresentation.puzzle.challenge.headline, 'THE HUMAN TEST');
    assert.equal(getPublicEventUrl('https://example.com/register'), null);
    assert.equal(getPublicEventUrl('http://forms.example.org/form'), null);
    assert.equal(getPublicEventUrl('not a url'), null);
    assert.ok(getPublicEventUrl(eventConfig.registrationUrl)?.startsWith('https://docs.google.com/forms/'), 'configured registration form must stay actionable');
    assert.ok(getPublicEventUrl(eventConfig.whatsappUrl)?.startsWith('https://chat.whatsapp.com/'));
    assert.equal(getSubmissionUrl(), eventConfig.submissionUrl, 'configured final form must stay actionable');

    const originalRegistration = eventConfig.registrationUrl;
    const originalSubmission = eventConfig.submissionUrl;
    const originalDeadline = eventConfig.submissionDeadline;
    try {
      eventConfig.registrationUrl = 'https://forms.example.org/initial';
      eventConfig.submissionUrl = eventConfig.registrationUrl;
      assert.equal(getSubmissionUrl(), null, 'final form cannot reuse initial registration');
      eventConfig.submissionUrl = 'https://forms.example.org/final';
      assert.equal(getSubmissionUrl(), eventConfig.submissionUrl);
      eventConfig.submissionDeadline = null;
      assert.equal(getSubmissionUrl(), null, 'missing deadline cannot enable the final form');
      eventConfig.submissionDeadline = '2026-10-29T18:30:00';
      assert.equal(getSubmissionUrl(), null, 'deadline without timezone cannot enable the final form');
    } finally {
      eventConfig.registrationUrl = originalRegistration;
      eventConfig.submissionUrl = originalSubmission;
      eventConfig.submissionDeadline = originalDeadline;
    }
  } finally {
    await server.close();
  }
});
