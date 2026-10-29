const slides = [
  {
    number: '01',
    title: 'Slide 1 — Project Overview & Problem Identification',
    points: [
      'Team name, members, project title',
      'Existing software selected for analysis',
      'Problem or limitation identified',
      'Why this problem needs to be solved',
    ],
  },
  {
    number: '02',
    title: 'Slide 2 — Reverse Engineering & Analysis',
    points: [
      'How the existing software or selected feature works',
      'Analysis of its workflow, functionality, or technical design',
      'Evidence supporting the identified limitation',
      'Diagrams or screenshots illustrating findings',
    ],
  },
  {
    number: '03',
    title: 'Slide 3 — Proposed Solution & Implementation',
    points: [
      'Your innovative solution to the identified problem',
      'How it improves upon the existing system',
      'Technologies, tools, and frameworks used',
      'Implementation architecture or workflow',
    ],
  },
  {
    number: '04',
    title: 'Slide 4 — Working Prototype & Results',
    points: [
      'Screenshots of the actual working prototype',
      'Demonstration of implemented features',
      'Before-and-after comparison or measurable improvement',
      'GitHub repository link and current limitations',
    ],
  },
] as const;

export function PresentationDeckReference() {
  return <section className="participant-guide__section presentation-deck" aria-labelledby="presentation-deck-title">
    <p className="eyebrow">06 / PRESENTATION SUPPORT</p>
    <h3 id="presentation-deck-title">PRESENTATION DECK REFERENCE</h3>
    <p>Use this four-slide structure to organize your presentation, if helpful.</p>
    <ol className="presentation-deck__slides">
      {slides.map(slide => <li className="presentation-deck__slide" key={slide.number}>
        <div className="presentation-deck__slide-heading">
          <span className="presentation-deck__number" aria-hidden="true">{slide.number}</span>
          <h4>{slide.title}</h4>
        </div>
        <ul>{slide.points.map(point => <li key={point}>{point}</li>)}</ul>
      </li>)}
    </ol>
  </section>;
}
