import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('central links and six-stage timeline keep forms distinct', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { eventConfig, getPublicEventUrl, getSubmissionUrl, timelineMilestones } = await server.ssrLoadModule('/src/config/event.ts');
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
      'Registration', 'Domains', 'PPT Submission', 'Shortlisting', 'Presentations', 'Winner Announcement',
    ]);
    assert.equal(getPublicEventUrl('https://example.com/register'), null);
    assert.equal(getPublicEventUrl('http://forms.example.org/form'), null);
    assert.equal(getPublicEventUrl('not a url'), null);
    assert.ok(getPublicEventUrl(eventConfig.registrationUrl)?.startsWith('https://docs.google.com/forms/'), 'configured registration form must stay actionable');
    assert.ok(getPublicEventUrl(eventConfig.whatsappUrl)?.startsWith('https://chat.whatsapp.com/'));
    assert.equal(getSubmissionUrl(), eventConfig.submissionUrl, 'configured final form must stay actionable');

    const originalRegistration = eventConfig.registrationUrl;
    const originalSubmission = eventConfig.submissionUrl;
    try {
      eventConfig.registrationUrl = 'https://forms.example.org/initial';
      eventConfig.submissionUrl = eventConfig.registrationUrl;
      assert.equal(getSubmissionUrl(), null, 'final form cannot reuse initial registration');
      eventConfig.submissionUrl = 'https://forms.example.org/final';
      assert.equal(getSubmissionUrl(), eventConfig.submissionUrl);
    } finally {
      eventConfig.registrationUrl = originalRegistration;
      eventConfig.submissionUrl = originalSubmission;
    }
  } finally {
    await server.close();
  }
});

test('participant content and configured actions render without puzzle or date gates', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ default: App }, { eventConfig }, { FloatingRegistrationAction }, { SubmissionAction }] = await Promise.all([
      server.ssrLoadModule('/src/App.tsx'),
      server.ssrLoadModule('/src/config/event.ts'),
      server.ssrLoadModule('/src/components/FloatingRegistrationAction.tsx'),
      server.ssrLoadModule('/src/components/SubmissionAction.tsx'),
    ]);
    const html = renderToStaticMarkup(React.createElement(App));
    const floatingActions = renderToStaticMarkup(React.createElement(React.Fragment, null,
      React.createElement(FloatingRegistrationAction),
      React.createElement(SubmissionAction, { floating: true }),
    ));

    assert.equal((html.match(/class="participant-guide__domain-index"/g) ?? []).length, 13);
    assert.match(html, /PPT SUBMISSION FORMAT/);
    assert.doesNotMatch(html, /THE HUMAN TEST|How many E's|COUNTDOWN|REGISTRATION CLOSES|SUBMISSIONS ENDED/i);
    assert.equal(html.split(`href="${eventConfig.registrationUrl}"`).length - 1, 1, 'the primary registration action uses the configured URL');
    assert.equal(html.split(`href="${eventConfig.submissionUrl}"`).length - 1, 2, 'the primary and final submission actions use the configured URL');
    assert.match(floatingActions, new RegExp(eventConfig.registrationUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(floatingActions, new RegExp(eventConfig.submissionUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  } finally {
    await server.close();
  }
});
