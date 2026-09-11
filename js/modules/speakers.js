export function initSpeakerCarousel(carousel) {
  if (!carousel) return;

  const speakers = [...carousel.querySelectorAll('[data-speaker]')];
  const grid = carousel.querySelector('[data-speaker-grid]');
  const previous = carousel.querySelector('.speaker-nav--prev');
  const next = carousel.querySelector('.speaker-nav--next');
  if (!speakers.length || !grid || !previous || !next) return;

  let center = 0;
  let autoAdvance;
  let hoveredSpeaker = null;

  const render = () => {
    speakers.forEach((speaker, index) => {
      const offset = (index - center + speakers.length) % speakers.length;
      let position = 'far-right';

      if (offset === 0) position = 'center';
      else if (offset === 1) position = 'right';
      else if (offset === speakers.length - 1) position = 'left';
      else if (offset === speakers.length - 2) position = 'far-left';

      speaker.dataset.pos = position;
    });

    if (hoveredSpeaker?.dataset.pos !== 'center') hoveredSpeaker = null;
  };

  previous.addEventListener('click', () => {
    center = (center - 1 + speakers.length) % speakers.length;
    render();
    stopAutoAdvance();
    startAutoAdvance();
  });

  next.addEventListener('click', () => {
    center = (center + 1) % speakers.length;
    render();
    stopAutoAdvance();
    startAutoAdvance();
  });

  const stopAutoAdvance = () => {
    clearInterval(autoAdvance);
    autoAdvance = undefined;
  };

  const startAutoAdvance = () => {
    stopAutoAdvance();
    if (!hoveredSpeaker && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      autoAdvance = setInterval(() => next.click(), 3500);
    }
  };

  speakers.forEach((speaker) => {
    speaker.addEventListener('pointerenter', () => {
      if (speaker.dataset.pos !== 'center') return;
      hoveredSpeaker = speaker;
      stopAutoAdvance();
    });
    speaker.addEventListener('pointerleave', () => {
      if (hoveredSpeaker !== speaker) return;
      hoveredSpeaker = null;
      startAutoAdvance();
    });
  });

  render();
  startAutoAdvance();
}