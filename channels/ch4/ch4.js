// Channel 6: UATP Archive
// Embedded document reader - click to read

(function() {
  'use strict';

  const archiveView = document.getElementById('archiveView');
  const readerView = document.getElementById('readerView');
  const readerContent = document.getElementById('readerContent');
  const readerTitle = document.querySelector('.reader-title');
  const backBtn = document.getElementById('backBtn');
  const archiveItems = document.querySelectorAll('.archive-item');

  // Show document
  function showDocument(docId) {
    const docEl = document.getElementById(docId);
    if (!docEl) return;

    const title = docEl.dataset.title;
    const type = docEl.dataset.type;
    const file = docEl.dataset.file;

    // Update title
    readerTitle.textContent = title;

    // Show reader view
    archiveView.classList.add('hidden');
    readerView.classList.add('active');

    // Load content
    if (type === 'pdf' && file) {
      readerContent.innerHTML = `<iframe src="${file}" title="${title}"></iframe>`;
    } else {
      readerContent.innerHTML = docEl.innerHTML;
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Update URL
    history.pushState({ doc: docId }, title, `#${docId}`);
  }

  // Back to archive
  function backToArchive() {
    readerView.classList.remove('active');
    archiveView.classList.remove('hidden');
    history.pushState({}, 'UATP Archive', '#');
    window.scrollTo(0, 0);
  }

  // Event: Click archive item
  archiveItems.forEach(item => {
    item.addEventListener('click', () => {
      const docId = item.dataset.doc;
      showDocument(docId);
    });
  });

  // Event: Back button
  backBtn.addEventListener('click', backToArchive);

  // Event: Browser back/forward
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.doc) {
      showDocument(e.state.doc);
    } else {
      backToArchive();
    }
  });

  // Event: Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && readerView.classList.contains('active')) {
      backToArchive();
    }
  });

  // Check URL hash on load
  if (window.location.hash) {
    const docId = window.location.hash.slice(1);
    if (document.getElementById(docId)) {
      setTimeout(() => showDocument(docId), 100);
    }
  }

})();
