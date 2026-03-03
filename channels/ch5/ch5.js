// Channel 5: UATP Archive
// Loads the standalone archive into the main site

export async function init() {
  console.log('Channel 5 UATP Archive init started');

  const section5 = document.getElementById('section5');
  if (!section5) {
    console.error('Section 5 not found');
    return;
  }

  // Check if already initialized - look for our event listener marker
  if (section5.dataset.archiveInit === 'true') {
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

    // Get references to elements
    const archiveView = section5.querySelector('#archiveView');
    const readerView = section5.querySelector('#readerView');
    const readerContent = section5.querySelector('#readerContent');
    const readerTitle = section5.querySelector('#readerTitle');
    const backBtn = section5.querySelector('#backBtn');

    if (!archiveView || !readerView) {
      console.error('Archive elements not found');
      return;
    }

    // Show document function
    function showDocument(docId) {
      const docEl = section5.querySelector('#' + docId);
      if (!docEl) {
        console.error('Document not found:', docId);
        return;
      }

      const title = docEl.dataset.title;
      const type = docEl.dataset.type;
      const file = docEl.dataset.file;

      console.log('Opening document:', docId, 'type:', type, 'file:', file);

      // Update title
      if (readerTitle) readerTitle.textContent = title;

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

      // Scroll to top - multiple methods for reliability
      readerView.scrollTop = 0;
      section5.scrollTop = 0;
      readerView.scrollIntoView({ behavior: 'instant', block: 'start' });
    }

    // Back to archive function
    function backToArchive() {
      readerView.classList.remove('active');
      archiveView.classList.remove('hidden');
      // Scroll to top - multiple methods for reliability
      archiveView.scrollTop = 0;
      section5.scrollTop = 0;
      archiveView.scrollIntoView({ behavior: 'instant', block: 'start' });
    }

    // Event: Click on archive items (event delegation)
    section5.addEventListener('click', function(e) {
      const item = e.target.closest('.archive-item');
      if (item && item.dataset.doc) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Archive item clicked:', item.dataset.doc);
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
    section5.dataset.archiveInit = 'true';

    console.log('UATP Archive fully initialized');

  } catch (err) {
    console.error('Failed to load UATP Archive:', err);
  }
}
