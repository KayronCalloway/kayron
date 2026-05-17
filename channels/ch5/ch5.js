// Channel 6: UATP Archive
// Loads the standalone archive into the main site

export async function init() {

  const section6 = document.getElementById('section6');
  if (!section6) {
    return;
  }

  // Check if already initialized - look for our event listener marker
  if (section6.dataset.archiveInit === 'true') {
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

    // Extract and scope styles to #section6 only (prevents global style leakage)
    const styles = doc.querySelector('style');
    if (styles && !document.getElementById('ch5-styles')) {
      let cssText = styles.textContent;

      // Remove global selectors that would affect the whole page
      cssText = cssText.replace(/\*\s*\{[^}]*\}/g, ''); // Remove * { }
      cssText = cssText.replace(/body\s*\{[^}]*\}/g, ''); // Remove body { }
      cssText = cssText.replace(/html\s*\{[^}]*\}/g, ''); // Remove html { }

      // Scope all remaining selectors to #section6
      cssText = cssText.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, (match, selector, suffix) => {
        // Skip if already scoped or is a @rule
        if (selector.trim().startsWith('@') || selector.trim().startsWith('#section6')) {
          return match;
        }
        return `#section6 ${selector.trim()}${suffix}`;
      });

      const styleEl = document.createElement('style');
      styleEl.id = 'ch5-styles';
      styleEl.textContent = cssText;
      document.head.appendChild(styleEl);
    }

    // Extract body content
    const bodyContent = doc.body.innerHTML;

    // Preserve channel overlay
    const existingOverlay = section6.querySelector('.channel-number-overlay');
    const overlayHTML = existingOverlay ? existingOverlay.outerHTML : '<div class="channel-number-overlay" aria-label="Channel 06 Archive"><span class="channel-code">CH 06</span><span class="channel-label">Archive</span></div>';

    // Insert content
    section6.innerHTML = bodyContent + overlayHTML;

    // Get references to elements
    const archiveView = section6.querySelector('#archiveView');
    const readerView = section6.querySelector('#readerView');
    const readerContent = section6.querySelector('#readerContent');
    const readerTitle = section6.querySelector('#readerTitle');
    const backBtn = section6.querySelector('#backBtn');

    if (!archiveView || !readerView) {
      return;
    }

    // Show document function
    function showDocument(docId) {
      const docEl = section6.querySelector('#' + docId);
      if (!docEl) {
        return;
      }

      const title = docEl.dataset.title;
      const type = docEl.dataset.type;
      const file = docEl.dataset.file;

      // Update title
      if (readerTitle) readerTitle.textContent = title;

      // Save scroll position, lock main content, and clear transform so fixed overlay is viewport-relative
      const mainContent = document.getElementById('mainContent');
      if (mainContent) {
        section6.dataset.savedScroll = String(mainContent.scrollTop);
        section6.dataset.savedTransform = mainContent.style.transform;
        mainContent.style.overflow = 'hidden';
        mainContent.style.transform = '';
      }

      // Show reader view
      archiveView.classList.add('hidden');
      readerView.classList.add('active');

      // Load content
      if (type === 'pdf' && file) {
        // For PDFs, embed with object tag as fallback
        readerContent.innerHTML = `
          <object data="./channels/ch5/${file}" type="application/pdf" width="100%" height="100%">
            <iframe src="./channels/ch5/${file}" title="${title}" style="width:100%;height:80vh;border:none;">
              <p>Your browser doesn't support PDF viewing. <a href="./channels/ch5/${file}" target="_blank">Download the PDF</a></p>
            </iframe>
          </object>`;
      } else {
        readerContent.innerHTML = docEl.innerHTML;
      }

      // Scroll reader to top
      readerView.scrollTop = 0;
    }

    // Back to archive function
    function backToArchive() {
      readerView.classList.remove('active');
      archiveView.classList.remove('hidden');

      // Unlock main content and restore scroll + transform
      const mainContent = document.getElementById('mainContent');
      if (mainContent) {
        mainContent.style.overflow = '';
        const saved = section6.dataset.savedScroll;
        if (saved) {
          mainContent.scrollTop = parseFloat(saved);
        }
        const savedTransform = section6.dataset.savedTransform;
        if (savedTransform !== undefined) {
          mainContent.style.transform = savedTransform;
        }
      }
    }

    // Event: Click on archive items (event delegation)
    section6.addEventListener('click', function(e) {
      const item = e.target.closest('.archive-item');
      if (item && item.dataset.doc) {
        e.preventDefault();
        e.stopPropagation();
        showDocument(item.dataset.doc);
      }

      // Back button
      if (e.target.closest('#backBtn')) {
        e.preventDefault();
        backToArchive();
      }
    });

    // Event: Keyboard escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && readerView.classList.contains('active')) {
        backToArchive();
      }
    });

    // Mark as initialized
    section6.dataset.archiveInit = 'true';

  } catch (err) {
    // Archive section not yet available
  }
}
