// Channel 3: Music — full-screen TV-style player
const tracks = [
  { id: 'ftp_QMl9BgU', title: 'Field Trippin', year: '2024' },
  { id: 'tpeUkuGCzOU', title: 'date', year: '2023' },
  { id: 'ptNBEZ6pPp4', title: 'Shibuya Subway Slide', year: '2023' },
  { id: '_z0Xf5W3jyg', title: 'Hit the Curve Slow (No Faking)', year: '2024' }
];

let currentIndex = 0;
let player = null;
let playerReady = false;
let sectionVisible = false;
let userPaused = false;
let initPromise = null;

export async function init() {
  const section3 = document.getElementById('section3');
  if (!section3) return;

  if (section3.dataset.ch3Ready === 'true') {
    syncAudioState();
    return;
  }

  if (initPromise) return initPromise;

  initPromise = (async () => {
    const res = await fetch('./channels/ch3/index.html');
    if (!res.ok) throw new Error(String(res.status));

    const existingOverlay = section3.querySelector('.channel-number-overlay');
    const overlayHTML = existingOverlay ? existingOverlay.outerHTML : '<div class="channel-number-overlay">CH 03</div>';

    section3.innerHTML = await res.text();
    if (!section3.querySelector('.channel-number-overlay')) {
      section3.insertAdjacentHTML('beforeend', overlayHTML);
    }

    if (!document.querySelector('link[href="./channels/ch3/styles.css"]')) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = './channels/ch3/styles.css';
      document.head.appendChild(css);
    }

    section3.dataset.ch3Ready = 'true';
    wireControls();
    observeVisibility(section3);
    await createPlayer();
  })().catch(() => {
    initPromise = null;
  });

  return initPromise;
}

function wireControls() {
  document.getElementById('prevTrack')?.addEventListener('click', () => switchTrack(currentIndex - 1));
  document.getElementById('nextTrack')?.addEventListener('click', () => switchTrack(currentIndex + 1));
  document.getElementById('playPause')?.addEventListener('click', () => togglePlay());
  updateNowPlaying();
}

function observeVisibility(section3) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      sectionVisible = entry.isIntersecting && entry.intersectionRatio >= 0.55;
      syncAudioState();
    },
    { threshold: [0, 0.25, 0.55, 0.8] }
  );

  observer.observe(section3);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      mutePlayer();
    } else {
      syncAudioState();
    }
  });
}

function waitForYouTube() {
  if (window.YT?.Player) return Promise.resolve();

  return new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReadyPatched() {
      if (typeof previousReady === 'function') previousReady();
      resolve();
    };

    const timer = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(timer);
        resolve();
      }
    }, 100);
  });
}

async function createPlayer() {
  await waitForYouTube();

  if (player || !document.getElementById('music-video-player')) return;

  player = new YT.Player('music-video-player', {
    videoId: tracks[currentIndex].id,
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      loop: 0,
      mute: 1,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
      fs: 0,
      showinfo: 0,
      iv_load_policy: 3,
      disablekb: 1,
      cc_load_policy: 0,
      enablejsapi: 1,
      origin: window.location.origin,
      vq: window.innerWidth <= 768 ? 'medium' : 'hd720'
    },
    events: {
      onReady: (event) => {
        playerReady = true;
        window.channel3Player = event.target;
        event.target.mute();
        event.target.playVideo();
        syncAudioState();
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          switchTrack(currentIndex + 1);
        }
      }
    }
  });
}

function switchTrack(index) {
  if (index < 0) index = tracks.length - 1;
  if (index >= tracks.length) index = 0;
  currentIndex = index;
  userPaused = false;
  updateNowPlaying();

  if (playerReady && player?.loadVideoById) {
    player.loadVideoById(tracks[currentIndex].id);
    syncAudioState();
  }
}

function togglePlay() {
  if (!playerReady || !player) return;

  const state = player.getPlayerState?.();
  if (state === YT.PlayerState.PLAYING) {
    userPaused = true;
    player.pauseVideo();
    updatePlayButton(false);
  } else {
    userPaused = false;
    player.playVideo();
    syncAudioState();
    updatePlayButton(true);
  }
}

function syncAudioState() {
  if (!playerReady || !player) return;

  if (!userPaused && player.getPlayerState?.() !== YT.PlayerState.PLAYING) {
    player.playVideo();
  }

  if (sectionVisible && window.soundAllowed) {
    unmutePlayer();
  } else {
    mutePlayer();
  }

  updatePlayButton(!userPaused);
}

function mutePlayer() {
  if (player?.mute) player.mute();
}

function unmutePlayer() {
  if (player?.unMute) player.unMute();
}

function updateNowPlaying() {
  const track = tracks[currentIndex];
  const title = document.getElementById('nowPlayingTitle');
  if (title) title.textContent = `${track.title} · ${track.year}`;
}

function updatePlayButton(isPlaying) {
  const button = document.getElementById('playPause');
  if (button) button.textContent = isPlaying ? '⏸' : '▶';
}
