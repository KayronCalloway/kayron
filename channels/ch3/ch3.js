// Channel 3: Music — TV-style player
export async function init() {
  const section3 = document.getElementById('section3');
  if (section3?.querySelector('#music-video-player iframe')) return;

  try {
    const res = await fetch('./channels/ch3/index.html');
    if (!res.ok) throw new Error(String(res.status));
    if (!section3) return;

    section3.innerHTML = await res.text();

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = './channels/ch3/styles.css';
    document.head.appendChild(css);

    initPlayer(section3);
  } catch {
    /* channel deferred */
  }
}

const tracks = [
  { id: 'ftp_QMl9BgU', title: 'Field Trippin', year: '2024' },
  { id: 'tpeUkuGCzOU', title: 'date', year: '2023' },
  { id: 'ptNBEZ6pPp4', title: 'Shibuya Subway Slide', year: '2023' }
];

let currentIndex = 0;
let iframe = null;
let wasPlaying = false;

function initPlayer(section3) {
  const container = document.getElementById('music-video-player');
  if (!container) return;

  iframe = document.createElement('iframe');
  iframe.id = 'ch3-player';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  container.appendChild(iframe);

  const prevBtn = document.getElementById('prevTrack');
  const nextBtn = document.getElementById('nextTrack');
  const playBtn = document.getElementById('playPause');

  prevBtn?.addEventListener('click', () => play(currentIndex - 1));
  nextBtn?.addEventListener('click', () => play(currentIndex + 1));
  playBtn?.addEventListener('click', () => togglePlay(playBtn));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.3;
        if (visible && !wasPlaying) {
          play(currentIndex);
          wasPlaying = true;
        } else if (!visible && wasPlaying) {
          iframe.src = '';
          wasPlaying = false;
          if (playBtn) playBtn.textContent = '▶';
        }
      });
    },
    { threshold: [0, 0.3, 0.5] }
  );

  observer.observe(section3);
}

function play(index) {
  if (index < 0) index = tracks.length - 1;
  if (index >= tracks.length) index = 0;
  currentIndex = index;

  const t = tracks[currentIndex];
  const titleEl = document.getElementById('nowPlayingTitle');
  if (titleEl) titleEl.textContent = `${t.title} · ${t.year}`;

  if (iframe) {
    iframe.src = `https://www.youtube.com/embed/${t.id}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
  }

  const playBtn = document.getElementById('playPause');
  if (playBtn) playBtn.textContent = '⏸';
}

function togglePlay(btn) {
  if (!iframe) return;
  if (iframe.src) {
    iframe.src = '';
    btn.textContent = '▶';
    wasPlaying = false;
  } else {
    play(currentIndex);
    btn.textContent = '⏸';
  }
}
