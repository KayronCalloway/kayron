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

function appendText(parent, className, text, tagName = 'span') {
  const el = document.createElement(tagName);
  el.className = className;
  el.textContent = text || '';
  parent.appendChild(el);
  return el;
}

function renderInstagram(section, instagram) {
  const mount = section.querySelector('[data-instagram-preview]');
  if (!mount || !instagram) return;

  const parentLink = mount.closest('a');
  if (parentLink && instagram.post?.url) {
    parentLink.href = instagram.post.url;
  }

  mount.textContent = '';

  if (instagram.post?.imageLocal) {
    const frame = document.createElement('figure');
    frame.className = 'instagram-post-frame';

    const img = document.createElement('img');
    img.src = instagram.post.imageLocal;
    img.alt = instagram.post.caption || 'Instagram post preview';
    img.loading = 'lazy';
    frame.appendChild(img);

    const caption = document.createElement('figcaption');
    appendText(caption, 'instagram-post-copy', instagram.post.caption || '');
    frame.appendChild(caption);
    mount.appendChild(frame);
  }

  const date = document.createElement('span');
  date.className = 'instagram-post-date';
  date.textContent = instagram.post?.date || '';
  mount.appendChild(date);
}

function renderLetterboxd(section, letterboxd) {
  const mount = section.querySelector('[data-letterboxd-preview]');
  if (!mount || !letterboxd?.films?.length) return;

  mount.textContent = '';

  // Featured film (most recent)
  const featured = letterboxd.films[0];
  const featuredWrap = document.createElement('div');
  featuredWrap.className = 'featured-film';

  if (featured.poster || featured.posterLocal) {
    const img = document.createElement('img');
    img.src = featured.posterLocal || featured.poster;
    img.alt = `${featured.title}${featured.year ? ` (${featured.year})` : ''}`;
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';
    featuredWrap.appendChild(img);
  }

  const caption = document.createElement('span');
  caption.className = 'film-caption';
  caption.textContent = featured.title || '';
  featuredWrap.appendChild(caption);

  const yearEl = document.createElement('span');
  yearEl.className = 'film-year';
  yearEl.textContent = featured.year ? `${featured.year}` : '';
  featuredWrap.appendChild(yearEl);
  mount.appendChild(featuredWrap);

  // Strip of remaining films
  if (letterboxd.films.length > 1) {
    const strip = document.createElement('div');
    strip.className = 'film-strip';
    letterboxd.films.slice(1, 5).forEach((film) => {
      if (film.poster || film.posterLocal) {
        const img = document.createElement('img');
        img.src = film.posterLocal || film.poster;
        img.alt = film.title || '';
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        strip.appendChild(img);
      }
    });
    mount.appendChild(strip);
  }
}

function renderTidal(section, tidal) {
  const mount = section.querySelector('[data-tidal-preview]');
  if (!mount || !tidal) return;

  const parentLink = mount.closest('a');
  if (parentLink && tidal.url) {
    parentLink.href = tidal.url;
  }

  mount.textContent = '';

  const cover = document.createElement('img');
  cover.className = 'tidal-cover';
  cover.src = tidal.coverLocal || tidal.cover;
  cover.alt = `${tidal.title || 'TIDAL playlist'} cover`;
  cover.loading = 'lazy';
  mount.appendChild(cover);

  const details = document.createElement('div');
  details.className = 'tidal-details';
  appendText(details, 'tidal-title', tidal.title || 'TIDAL playlist');
  appendText(details, 'tidal-note', 'Playlist');
  mount.appendChild(details);
}
