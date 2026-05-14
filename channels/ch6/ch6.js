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
    appendText(caption, 'instagram-post-type', instagram.post.type || 'post');
    appendText(caption, 'instagram-post-copy', instagram.post.caption || '');
    frame.appendChild(caption);
    mount.appendChild(frame);
  }

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

    if (film.poster || film.posterLocal) {
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
  appendText(details, 'tidal-note', [tidal.trackCount, tidal.duration].filter(Boolean).join(' · '));

  if (tidal.tracks?.length) {
    const list = document.createElement('ol');
    list.className = 'tidal-tracks';
    tidal.tracks.slice(0, 6).forEach((track) => {
      const item = document.createElement('li');
      const main = document.createElement('span');
      main.className = 'track-main';
      appendText(main, 'track-title', track.title);
      appendText(main, 'track-artist', track.artist);
      item.appendChild(main);
      appendText(item, 'track-time', track.duration);
      list.appendChild(item);
    });
    details.appendChild(list);
  }

  mount.appendChild(details);
}
