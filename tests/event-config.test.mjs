import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

test('central links and seven-stage timeline keep forms distinct', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { eventConfig, getPublicEventUrl, getSubmissionUrl, timelineMilestones } = await server.ssrLoadModule('/src/config/event.ts');
    assert.equal(eventConfig.eventPhase, 'teaser');
    assert.deepEqual(timelineMilestones.map(({ name }) => name), [
      'Registration', 'Decoding Challenge', 'Domains', 'PPT Submission',
      'Shortlisting', 'Presentations', 'Winner Announcement',
    ]);
    assert.equal(getPublicEventUrl('https://example.com/register'), null);
    assert.equal(getPublicEventUrl('http://forms.example.org/form'), null);
    assert.equal(getPublicEventUrl('not a url'), null);
    assert.ok(getPublicEventUrl(eventConfig.registrationUrl)?.startsWith('https://docs.google.com/forms/'), 'configured registration form must stay actionable');
    assert.ok(getPublicEventUrl(eventConfig.whatsappUrl)?.startsWith('https://chat.whatsapp.com/'));
    assert.equal(getSubmissionUrl(), null, 'missing final form must stay disabled');

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
