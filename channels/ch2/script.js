// channels/ch2/script.js — Editorial Portfolio
// Direct-link cards. Just scroll behavior + nav arrows.
(() => {
  function isMobileDevice() {
    return (
      typeof window.orientation !== 'undefined' ||
      /Mobile|Android|iOS|iPhone|iPad/.test(navigator.userAgent)
    );
  }

  function init() {
    const isMobile = window.innerWidth <= 600 || isMobileDevice();

    const container = document.getElementById('section2');
    if (container) {
      container.setAttribute('data-channel', 'ch2');
      if (isMobile) {
        container.setAttribute('data-mobile', 'true');
        container.style.webkitTapHighlightColor = 'transparent';
      }
    }

    setupScroller();
  }

  function setupScroller() {
    const scroller = document.querySelector('.ch2-scroller');
    if (!scroller) return;

    const row = scroller.closest('.ch2-row');
    const leftBtn  = row && row.querySelector('.ch2-nav-left');
    const rightBtn = row && row.querySelector('.ch2-nav-right');

    // One card (240px) + gap (28px), scroll two at a time
    const step = (240 + 28) * 2;

    if (leftBtn) {
      leftBtn.addEventListener('click', e => {
        e.preventDefault();
        scroller.scrollBy({ left: -step, behavior: 'smooth' });
      });
    }
    if (rightBtn) {
      rightBtn.addEventListener('click', e => {
        e.preventDefault();
        scroller.scrollBy({ left: step, behavior: 'smooth' });
      });
    }

    // Visual feedback on arrow availability
    function update() {
      const max = scroller.scrollWidth - scroller.clientWidth;
      const x = scroller.scrollLeft;
      if (leftBtn) {
        leftBtn.style.opacity = x <= 4 ? '0.25' : '1';
        leftBtn.style.pointerEvents = x <= 4 ? 'none' : 'auto';
      }
      if (rightBtn) {
        rightBtn.style.opacity = x >= max - 4 ? '0.25' : '1';
        rightBtn.style.pointerEvents = x >= max - 4 ? 'none' : 'auto';
      }
    }
    scroller.addEventListener('scroll', update, { passive: true });
    update();

    // Wheel: vertical wheel scrolls horizontally when hovering scroller
    scroller.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scroller.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }

  function cleanup() {
    const container = document.getElementById('section2');
    if (container) {
      container.removeAttribute('data-channel');
      container.removeAttribute('data-mobile');
    }
  }

  if (typeof window.CH2_CLEANUP === 'function') window.CH2_CLEANUP();
  window.CH2_CLEANUP = cleanup;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
