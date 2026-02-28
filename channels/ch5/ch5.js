// Channel 5: UATP Archive
// Loads the standalone archive into the main site

export async function init() {
  console.log('Channel 5 UATP Archive init started');

  const section5 = document.getElementById('section5');
  if (!section5) {
    console.error('Section 5 not found');
    return;
  }

  // Check if already initialized
  if (section5.querySelector('.archive-view')) {
    console.log('Channel 5 already initialized, skipping...');
    return;
  }

  try {
    // Load the archive HTML
    const response = await fetch('./channels/ch5/index.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch archive content: ${response.status}`);
    }
    const html = await response.text();

    // Parse the HTML to extract body content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract and scope styles to #section5 only (prevents global style leakage)
    const styles = doc.querySelector('style');
    if (styles && !document.getElementById('ch5-styles')) {
      let cssText = styles.textContent;

      // Remove global selectors that would affect the whole page
      cssText = cssText.replace(/\*\s*\{[^}]*\}/g, ''); // Remove * { }
      cssText = cssText.replace(/body\s*\{[^}]*\}/g, ''); // Remove body { }
      cssText = cssText.replace(/html\s*\{[^}]*\}/g, ''); // Remove html { }

      // Scope all remaining selectors to #section5
      cssText = cssText.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, (match, selector, suffix) => {
        // Skip if already scoped or is a @rule
        if (selector.trim().startsWith('@') || selector.trim().startsWith('#section5')) {
          return match;
        }
        return `#section5 ${selector.trim()}${suffix}`;
      });

      const styleEl = document.createElement('style');
      styleEl.id = 'ch5-styles';
      styleEl.textContent = cssText;
      document.head.appendChild(styleEl);
      console.log('Channel 5 styles injected (scoped to #section5)');
    }

    // Extract body content
    const bodyContent = doc.body.innerHTML;

    // Preserve channel overlay
    const existingOverlay = section5.querySelector('.channel-number-overlay');
    const overlayHTML = existingOverlay ? existingOverlay.outerHTML : '<div class="channel-number-overlay">CH 05</div>';

    // Insert content
    section5.innerHTML = bodyContent + overlayHTML;

    console.log('Channel 5 archive content loaded');

    // Initialize the archive functionality
    setTimeout(() => {
      initArchive();
    }, 100);

  } catch (err) {
    console.error('Failed to load UATP Archive:', err);
  }
}

function initArchive() {
  const section5 = document.getElementById('section5');
  const archiveView = document.getElementById('archiveView');
  const readerView = document.getElementById('readerView');
  const readerContent = document.getElementById('readerContent');
  const readerTitle = document.getElementById('readerTitle');
  const backBtn = document.getElementById('backBtn');
  const archiveItems = document.querySelectorAll('.archive-item');

  if (!archiveView || !readerView) {
    console.error('Archive elements not found');
    return;
  }

  // No scroll isolation needed - ch5 is the last channel so users can scroll back up

  // Show document
  function showDocument(docId) {
    const docEl = document.getElementById(docId);
    if (!docEl) return;

    const title = docEl.dataset.title;
    const type = docEl.dataset.type;
    const file = docEl.dataset.file;

    // Update title
    if (readerTitle) readerTitle.textContent = title;

    // Show reader view
    archiveView.classList.add('hidden');
    readerView.classList.add('active');

    // Load content
    if (type === 'pdf' && file) {
      readerContent.innerHTML = `<iframe src="./channels/ch5/${file}" title="${title}"></iframe>`;
    } else {
      readerContent.innerHTML = docEl.innerHTML;
    }

    // Scroll section into view
    const section5 = document.getElementById('section5');
    if (section5) section5.scrollTo(0, 0);
  }

  // Back to archive
  function backToArchive() {
    readerView.classList.remove('active');
    archiveView.classList.remove('hidden');
    const section5 = document.getElementById('section5');
    if (section5) section5.scrollTo(0, 0);
  }

  // Event: Click archive item
  archiveItems.forEach(item => {
    item.addEventListener('click', () => {
      const docId = item.dataset.doc;
      showDocument(docId);
    });
  });

  // Event: Back button
  if (backBtn) {
    backBtn.addEventListener('click', backToArchive);
  }

  // Event: Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && readerView && readerView.classList.contains('active')) {
      backToArchive();
    }
  });

  console.log('UATP Archive initialized with', archiveItems.length, 'documents');
}
