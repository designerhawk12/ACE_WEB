import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('central registration links and four-stage event process remain configured', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { eventConfig, getPublicEventUrl, timelineMilestones } = await server.ssrLoadModule('/src/config/event.ts');
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
      'Register Your Team', 'Explore the Domains', 'Reverse Engineer & Build', 'Present Your Prototype',
    ]);
    assert.equal(timelineMilestones.length, 4);
    assert.ok(timelineMilestones[0].details.some(detail => detail.includes('registration form')));
    assert.ok(timelineMilestones[1].details.some(detail => detail.includes('closed-source')));
    assert.ok(timelineMilestones[2].details.some(detail => detail.includes('Prepare a PPT')));
    assert.ok(timelineMilestones[3].details.some(detail => detail.includes('All registered teams')));
    assert.ok(timelineMilestones[3].details.some(detail => detail.includes('supporting material')));
    assert.ok(timelineMilestones[3].details.some(detail => detail.includes('no preliminary PPT submission or shortlisting')));
    assert.equal(getPublicEventUrl('https://example.com/register'), null);
    assert.equal(getPublicEventUrl('http://forms.example.org/form'), null);
    assert.equal(getPublicEventUrl('not a url'), null);
    assert.ok(getPublicEventUrl(eventConfig.registrationUrl)?.startsWith('https://docs.google.com/forms/'), 'configured registration form must stay actionable');
    assert.ok(getPublicEventUrl(eventConfig.whatsappUrl)?.startsWith('https://chat.whatsapp.com/'));
    assert.equal('submissionUrl' in eventConfig, false, 'there is no online PPT submission form in event config');
  } finally {
    await server.close();
  }
});

test('participant content and configured actions render without puzzle or date gates', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ default: App }, { eventConfig }, { FloatingRegistrationAction }] = await Promise.all([
      server.ssrLoadModule('/src/App.tsx'),
      server.ssrLoadModule('/src/config/event.ts'),
      server.ssrLoadModule('/src/components/FloatingRegistrationAction.tsx'),
    ]);
    const html = renderToStaticMarkup(React.createElement(App));
    const floatingRegistration = renderToStaticMarkup(React.createElement(FloatingRegistrationAction));

    assert.equal((html.match(/class="participant-guide__domain-index"/g) ?? []).length, 13);
    assert.equal((html.match(/class="timeline__item"/g) ?? []).length, 4);
    assert.match(html, /A process,<br\/><em>in four stages\.<\/em>/);
    assert.match(html, /All registered teams proceed directly to the presentation round\./);
    assert.match(html, /Every registered team presents directly to the judges/);
    assert.match(html, /Demonstrate the working prototype and explain your analysis, implementation, and improvements\./);
    assert.match(html, /Use a PPT as supporting material during the presentation, if required\./);
    assert.match(html, /There is no preliminary PPT submission or shortlisting round\./);
    assert.match(html, /PRESENTATION DECK REFERENCE/);
    assert.match(html, /Use this four-slide structure to organize your presentation, if helpful\./);
    assert.doesNotMatch(html, /THE HUMAN TEST|How many E's|COUNTDOWN|REGISTRATION CLOSES|SUBMISSIONS ENDED/i);
    assert.doesNotMatch(html, /SUBMIT (?:YOUR )?PPT|PPT SUBMISSION FORMAT|final PPT form|upload a PPT/i);
    assert.equal(html.split(`href="${eventConfig.registrationUrl}"`).length - 1, 1, 'the registration action uses the configured URL');
    assert.equal(html.split(`href="${eventConfig.whatsappUrl}"`).length - 1, 1, 'the WhatsApp action uses the configured URL');
    assert.match(floatingRegistration, new RegExp(eventConfig.registrationUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.doesNotMatch(floatingRegistration, /SUBMIT|PPT/i);
  } finally {
    await server.close();
  }
});
