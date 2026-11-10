function initSlider({
  trackSelector,
  slideSelector,
  prevSelector,
  nextSelector,
  dotsSelector,
  dotClass,
  isVideo = false,
}) {
  const track = document.querySelector(trackSelector);
  const slides = document.querySelectorAll(slideSelector);
  const prev = document.querySelector(prevSelector);
  const next = document.querySelector(nextSelector);
  const dotsContainer = document.querySelector(dotsSelector);

  if (!track || !slides.length || !prev || !next || !dotsContainer) {
    return;
  }

  let current = 0;
  let startX = 0;
  let isDragging = false;

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = dotClass;
    dot.setAttribute('aria-label', `Slide ${index + 1}`);
    dot.addEventListener('click', () => show(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(`.${dotClass}`);

  function show(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

    if (!isVideo) return;

    slides.forEach((slide, i) => {
      const video = slide.querySelector('video');
      if (!video) return;

      if (i === current) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  next.addEventListener('click', () => show(current + 1));
  prev.addEventListener('click', () => show(current - 1));

  track.addEventListener('pointerdown', (event) => {
    if (event.target.closest('video')) return;
    isDragging = true;
    startX = event.clientX;
  });

  track.addEventListener('pointerup', (event) => {
    if (!isDragging) return;
    isDragging = false;

    const delta = event.clientX - startX;
    if (Math.abs(delta) < 40) return;

    show(delta < 0 ? current + 1 : current - 1);
  });

  track.addEventListener('pointercancel', () => {
    isDragging = false;
  });

  show(0);
}

document.addEventListener('DOMContentLoaded', () => {
  initSlider({
    trackSelector: '.video-slider__track',
    slideSelector: '.video-slider__slide',
    prevSelector: '.video-slider__arrow--prev',
    nextSelector: '.video-slider__arrow--next',
    dotsSelector: '.video-slider__dots',
    dotClass: 'video-slider__dot',
    isVideo: true,
  });

  initSlider({
    trackSelector: '.photo-slider__track',
    slideSelector: '.photo-slider__slide',
    prevSelector: '.photo-slider__arrow--prev',
    nextSelector: '.photo-slider__arrow--next',
    dotsSelector: '.photo-slider__dots',
    dotClass: 'photo-slider__dot',
  });
});
