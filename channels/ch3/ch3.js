// Channel 3: Sound JavaScript

export async function init() {
  try {
    const response = await fetch('./channels/ch3/index.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch music interface: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();

    const section3 = document.getElementById('section3');
    if (section3) {
      section3.innerHTML = html;

      const musicStylesheet = document.createElement('link');
      musicStylesheet.rel = 'stylesheet';
      musicStylesheet.href = './channels/ch3/styles.css';
      document.head.appendChild(musicStylesheet);

      setupMusicPlayer();

      setTimeout(() => {
        if (typeof window.ensureTVGuideStandardStyling === 'function') {
          window.ensureTVGuideStandardStyling();
        }
      }, 100);
    }
  } catch (err) {
    // Music player not yet available
  }
}

const tracks = [
  { id: 'ftp_QMl9BgU', title: 'Field Trippin', year: '2024' },
  { id: 'tpeUkuGCzOU', title: 'date', year: '2023' },
  { id: 'ptNBEZ6pPp4', title: 'Shibuya Subway Slide', year: '2023' }
];

let currentTrackIndex = 0;

function setupMusicPlayer() {
  const isMobile = window.innerWidth <= 768;

  setTimeout(() => {
    if (typeof YT !== 'undefined' && YT.Player && !window.channel3Player) {
      window.channel3Player = new YT.Player('youtube-player-3', {
        videoId: tracks[0].id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: tracks.map(t => t.id).join(','),
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          fs: 0,
          showinfo: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          vq: isMobile ? 'medium' : 'hd720',
          mute: 1
        },
        events: {
          onReady: event => {
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: event => {
            if (event.data === YT.PlayerState.ENDED) {
              currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
              event.target.loadVideoById(tracks[currentTrackIndex].id);
            }
          },
          onError: () => {
            setTimeout(() => {
              if (window.channel3Player && window.channel3Player.playVideo) {
                window.channel3Player.playVideo();
              }
            }, 1000);
          }
        }
      });
    }
  }, 500);

  const buttonIds = ['track1Button', 'track2Button', 'track3Button'];
  buttonIds.forEach((id, i) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener('click', () => {
      currentTrackIndex = i;
      if (window.channel3Player && window.channel3Player.loadVideoById) {
        window.channel3Player.loadVideoById(tracks[i].id);
        window.channel3Player.playVideo();
      }
    });
  });
}
