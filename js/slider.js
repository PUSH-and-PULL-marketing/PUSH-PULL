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

  const viewport = track.parentElement;
  let current = 0;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let tracking = false;
  let dragging = false;
  let suppressClick = false;

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = dotClass;
    dot.setAttribute('aria-label', `Slide ${index + 1}`);
    dot.addEventListener('click', () => show(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(`.${dotClass}`);

  function show(index, animate = true) {
    current = (index + slides.length) % slides.length;
    track.style.transition = animate ? 'transform 0.45s ease' : 'none';
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });

    if (!isVideo) return;

    slides.forEach((slide, i) => {
      const video = slide.querySelector('video');
      if (!video) return;

      if (i === current) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }

  function onVideoControls(event) {
    const video = event.target.closest?.('video');
    if (!video) return false;
    const rect = video.getBoundingClientRect();
    return event.clientY > rect.top + rect.height * 0.82;
  }

  function finishDrag() {
    if (!tracking) return;
    tracking = false;

    if (!dragging) return;
    dragging = false;

    const width = viewport.offsetWidth || 1;
    const threshold = Math.min(70, width * 0.16);

    if (deltaX <= -threshold) show(current + 1);
    else if (deltaX >= threshold) show(current - 1);
    else show(current);

    suppressClick = true;
  }

  next.addEventListener('click', () => show(current + 1));
  prev.addEventListener('click', () => show(current - 1));

  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (onVideoControls(event)) return;

    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    deltaX = 0;
    tracking = true;
    dragging = false;
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!tracking || event.pointerId !== pointerId) return;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (!dragging) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        tracking = false;
        return;
      }
      dragging = true;
      viewport.setPointerCapture(pointerId);
      track.style.transition = 'none';
    }

    deltaX = dx;
    track.style.transform = `translateX(calc(-${current * 100}% + ${dx}px))`;
  });

  viewport.addEventListener('pointerup', (event) => {
    if (event.pointerId !== pointerId) return;
    finishDrag();
  });

  viewport.addEventListener('pointercancel', (event) => {
    if (event.pointerId !== pointerId) return;
    finishDrag();
  });

  viewport.addEventListener(
    'click',
    (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    },
    true
  );

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
