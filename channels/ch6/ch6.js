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

    hydrateSensibility(section5);
  } catch (error) {
    // Sensibility channel is optional; leave shell intact if fetch fails.
  }
}

async function hydrateSensibility(section) {
  try {
    const response = await fetch('./channels/ch6/sensibility-data.json', { cache: 'no-cache' });
    if (!response.ok) return;
    const data = await response.json();

    renderInstagram(section, data.instagram);
    renderLetterboxd(section, data.letterboxd);
    renderTidal(section, data.tidal);
  } catch (error) {
    // Keep static links usable if preview data cannot load.
  }
}

function appendText(parent, className, text) {
  const el = document.createElement('span');
  el.className = className;
  el.textContent = text || '';
  parent.appendChild(el);
  return el;
}

function renderInstagram(section, instagram) {
  const mount = section.querySelector('[data-instagram-preview]');
  if (!mount || !instagram) return;

  mount.textContent = '';
  const badge = document.createElement('div');
  badge.className = 'instagram-badge';
  badge.textContent = '@';
  mount.appendChild(badge);

  const stats = document.createElement('div');
  stats.className = 'instagram-stats';
  [
    ['posts', instagram.stats?.posts],
    ['followers', instagram.stats?.followers],
    ['following', instagram.stats?.following]
  ].forEach(([label, value]) => {
    const item = document.createElement('span');
    appendText(item, 'stat-value', value || '—');
    appendText(item, 'stat-label', label);
    stats.appendChild(item);
  });
  mount.appendChild(stats);
}

function renderLetterboxd(section, letterboxd) {
  const mount = section.querySelector('[data-letterboxd-preview]');
  if (!mount || !letterboxd?.films?.length) return;

  mount.textContent = '';
  letterboxd.films.slice(0, 5).forEach((film) => {
    const poster = document.createElement('span');
    poster.className = 'film-poster';

    if (film.poster) {
      const img = document.createElement('img');
      img.src = film.posterLocal || film.poster;
      img.alt = `${film.title}${film.year ? ` (${film.year})` : ''}`;
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      poster.appendChild(img);
    }

    const caption = document.createElement('span');
    caption.className = 'film-caption';
    caption.textContent = film.rating ? `${film.rating} ★` : film.year || '';
    poster.appendChild(caption);
    mount.appendChild(poster);
  });
}

function renderTidal(section, tidal) {
  const mount = section.querySelector('[data-tidal-preview]');
  if (!mount || !tidal) return;

  mount.textContent = '';
  const waveform = document.createElement('div');
  waveform.className = 'tidal-waveform';
  [22, 48, 70, 38, 88, 56, 32, 62].forEach((height, index) => {
    const bar = document.createElement('span');
    bar.style.setProperty('--bar-height', `${height}%`);
    if (index === 2 || index === 4) bar.classList.add('gold');
    waveform.appendChild(bar);
  });

  mount.appendChild(waveform);
  appendText(mount, 'tidal-note', 'TIDAL needs a direct playlist URL to expose tracks here.');
}
