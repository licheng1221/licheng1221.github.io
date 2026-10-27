document.getElementById('year').textContent = new Date().getFullYear();


const photoTrack = document.getElementById('photo-track');
if (photoTrack) {
  const originalSlides = [...photoTrack.querySelectorAll('.photo-slide')];
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');
  photoTrack.append(firstClone);
  photoTrack.prepend(lastClone);
  const slides = [...photoTrack.querySelectorAll('.photo-slide')];
  let activeIndex = 1;
  let loopTimer;
  const centerSlide = (index, behavior = 'smooth') => {
    if (!slides[index]) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) behavior = 'instant';
    slides[index].scrollIntoView({behavior, block: 'nearest', inline: 'center'});
  };
  const nearestIndex = () => {
    const trackCenter = photoTrack.scrollLeft + photoTrack.clientWidth / 2;
    return slides.reduce((best, slide, index) => {
      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - trackCenter);
      const bestDistance = Math.abs(slides[best].offsetLeft + slides[best].offsetWidth / 2 - trackCenter);
      return distance < bestDistance ? index : best;
    }, 0);
  };
  const settleLoop = () => {
    clearTimeout(loopTimer);
    loopTimer = setTimeout(() => {
      const index = nearestIndex();
      if (index === 0) { activeIndex = originalSlides.length; centerSlide(activeIndex, 'instant'); }
      else if (index === slides.length - 1) { activeIndex = 1; centerSlide(activeIndex, 'instant'); }
      else activeIndex = index;
    }, 450);
  };
  const moveSlide = (direction) => {
    activeIndex = nearestIndex();
    centerSlide(activeIndex + direction);
    settleLoop();
  };
  document.getElementById('slide-prev').addEventListener('click', () => moveSlide(-1));
  document.getElementById('slide-next').addEventListener('click', () => moveSlide(1));
  photoTrack.addEventListener('scroll', settleLoop, {passive: true});
  window.addEventListener('resize', () => centerSlide(activeIndex, 'instant'));
  requestAnimationFrame(() => centerSlide(activeIndex, 'instant'));
}
