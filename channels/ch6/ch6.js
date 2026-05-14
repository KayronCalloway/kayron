// Channel 5: Sensibility

export async function init() {
  const section5 = document.getElementById('section5');
  if (!section5 || section5.dataset.sensibilityInit === 'true') {
    return;
  }

  const stylesheetId = 'ch6-styles';
  if (!document.getElementById(stylesheetId)) {
    const link = document.createElement('link');
    link.id = stylesheetId;
    link.rel = 'stylesheet';
    link.href = './channels/ch6/styles.css';
    document.head.appendChild(link);
  }

  try {
    const response = await fetch('./channels/ch6/index.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch sensibility content: ${response.status}`);
    }

    const html = await response.text();
    const existingOverlay = section5.querySelector('.channel-number-overlay');
    const overlayHTML = existingOverlay ? existingOverlay.outerHTML : '<div class="channel-number-overlay">CH 05</div>';

    section5.innerHTML = html + overlayHTML;
    section5.dataset.sensibilityInit = 'true';
  } catch (error) {
    // Sensibility channel is optional; leave shell intact if fetch fails.
  }
}
