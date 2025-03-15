// channels/ch4/ch4.js
function createModals() {
  // Create the Warren Buffett modal
  const warrenModalHTML = `
    <div id="warrenModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="modal-box" tabindex="-1">
        <button id="closeWarren" class="close-modal" aria-label="Close Warren Modal">&times;</button>
        <div class="modal-static" id="warrenStatic"></div>
        <div class="modal-content">
          <h2>Under The Influence</h2>
          <h3>Warren Buffett</h3>
          <div class="role-model-description">
            <p>I admire Warren Buffett not for his extraordinary wealth, but for his unwavering commitment to integrity and ethical principles. His philosophy transcends business, offering profound wisdom on continuous learning, long-term thinking, and living with purpose. He embodies what it means to succeed while remaining principled—a rare quality that inspires me to pursue both excellence and character in everything I do.</p>
          </div>
          <div class="role-model-quotes">
            <div class="role-model-quote">
              <p>"You can't make a good deal with a bad person."</p>
              <p class="quote-author">— Warren Buffett</p>
            </div>
            <div class="role-model-quote">
              <p>"It takes 20 years to build a reputation and five minutes to ruin it. If you think about that, you'll do things differently."</p>
              <p class="quote-author">— Warren Buffett</p>
            </div>
            <div class="role-model-quote">
              <p>"The most important investment you can make is in yourself."</p>
              <p class="quote-author">— Warren Buffett</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Create the Charlie Munger modal
  const charlieModalHTML = `
    <div id="charlieModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="modal-box" tabindex="-1">
        <button id="closeCharlie" class="close-modal" aria-label="Close Charlie Modal">&times;</button>
        <div class="modal-static" id="charlieStatic"></div>
        <div class="modal-content">
          <h2>Under The Influence</h2>
          <h3>Charlie Munger</h3>
          <div class="role-model-description">
            <p>Charlie Munger's mental models approach to decision-making has profoundly influenced how I think about problems. His emphasis on multidisciplinary learning and avoiding cognitive biases serves as a north star for my own intellectual development. I strive to emulate his clarity of thought, rigorous rationality, and willingness to admit mistakes - qualities that made him not just a successful investor but a truly wise individual.</p>
          </div>
          <div class="role-model-quotes">
            <div class="role-model-quote">
              <p>"The best way to get what you want is to deserve what you want. How could it be otherwise?"</p>
              <p class="quote-author">— Charlie Munger</p>
            </div>
            <div class="role-model-quote">
              <p>"Someone will always be getting richer faster than you. This is not a tragedy."</p>
              <p class="quote-author">— Charlie Munger</p>
            </div>
            <div class="role-model-quote">
              <p>"Knowing what you don't know is more useful than being brilliant."</p>
              <p class="quote-author">— Charlie Munger</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Create the Annual Letter modal
  const annualLetterModalHTML = `
    <div id="annualLetterModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="modal-box" tabindex="-1">
        <button id="closeAnnualLetter" class="close-modal" aria-label="Close Annual Letter Modal">&times;</button>
        <div class="modal-static" id="letterStatic"></div>
        <div class="modal-content">
          <h2>Berkshire Hathaway Annual Letter</h2>
          <div class="role-model-description">
            <p>Warren Buffett's annual letter to Berkshire Hathaway shareholders is a masterclass in clear communication, business principles, and investment wisdom. For over 50 years, these letters have provided invaluable insights not just for investors, but for anyone interested in business, leadership, and decision-making.</p>
            <p>The letters combine financial reports with Buffett's straightforward explanations of complex concepts, all delivered with his characteristic wit and wisdom.</p>
          </div>
          <div class="annual-letter-link">
            <p>Read the latest annual letter:</p>
            <a href="https://www.berkshirehathaway.com/letters/2023ltr.pdf" target="_blank" rel="noopener noreferrer" class="letter-button">2023 Annual Letter</a>
            <p>Or visit the <a href="https://www.berkshirehathaway.com/letters/letters.html" target="_blank" rel="noopener noreferrer">complete archive</a> of letters dating back to 1977.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append all modals to the body
  const container = document.createElement('div');
  container.innerHTML = warrenModalHTML + charlieModalHTML + annualLetterModalHTML;
  document.body.appendChild(container);
}

function setupModalEventListeners() {
  // GSAP Animation: "Coming Out of the Box"
  const animateModalIn = modal => {
    gsap.fromTo(
      modal,
      { 
        opacity: 0, 
        scale: 0.8, 
        y: 20, 
        rotationX: 5,
        transformOrigin: "top center" // makes it look like it's emerging from the top edge
      },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        rotationX: 0, 
        duration: 0.6, 
        ease: "power2.out" 
      }
    );
  };

  const animateModalOut = modal => {
    gsap.to(modal, {
      opacity: 0,
      scale: 0.8,
      y: 20,
      rotationX: 5,
      duration: 0.5,
      ease: "power2.in",
      transformOrigin: "top center",
      onComplete: () => {
        modal.classList.add('hidden');
      }
    });
  };

  // Setup Warren Buffett modal
  const warrenButton = document.getElementById('warrenButton');
  const warrenModal = document.getElementById('warrenModal');
  const closeWarrenButton = document.getElementById('closeWarren');
  
  if (warrenButton && warrenModal && closeWarrenButton) {
    warrenButton.addEventListener('click', () => {
      warrenModal.classList.remove('hidden');
      warrenModal.style.display = 'flex';
      animateModalIn(warrenModal);
    });
    
    closeWarrenButton.addEventListener('click', () => {
      animateModalOut(warrenModal);
    });
  }
  
  // Setup Charlie Munger modal
  const charlieButton = document.getElementById('charlieButton');
  const charlieModal = document.getElementById('charlieModal');
  const closeCharlieButton = document.getElementById('closeCharlie');
  
  if (charlieButton && charlieModal && closeCharlieButton) {
    charlieButton.addEventListener('click', () => {
      charlieModal.classList.remove('hidden');
      charlieModal.style.display = 'flex';
      animateModalIn(charlieModal);
    });
    
    closeCharlieButton.addEventListener('click', () => {
      animateModalOut(charlieModal);
    });
  }
  
  // Setup Annual Letter modal
  const annualLetterButton = document.getElementById('annualLetterButton');
  const annualLetterModal = document.getElementById('annualLetterModal');
  const closeAnnualLetterButton = document.getElementById('closeAnnualLetter');
  
  if (annualLetterButton && annualLetterModal && closeAnnualLetterButton) {
    annualLetterButton.addEventListener('click', () => {
      annualLetterModal.classList.remove('hidden');
      annualLetterModal.style.display = 'flex';
      animateModalIn(annualLetterModal);
    });
    
    closeAnnualLetterButton.addEventListener('click', () => {
      animateModalOut(annualLetterModal);
    });
  }

  // Close all modals on Escape key press
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const allModals = [warrenModal, charlieModal, annualLetterModal];
      allModals.forEach(modal => {
        if (modal && !modal.classList.contains('hidden')) {
          animateModalOut(modal);
        }
      });
    }
  });
}

export async function init() {
  const container = document.getElementById('section4');
  if (!container) {
    console.error("Channel 4 container not found");
    return;
  }
  // Prevent duplicate initialization
  if (container.querySelector('#youtube-player-4')) {
    console.log("Channel 4 already loaded; skipping initialization.");
    return;
  }
  
  try {
    const response = await fetch('./channels/ch4/index.html');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error("Failed to load Channel 4 markup:", error);
    container.innerHTML = `<div class="error">Error loading video content.</div>`;
    return;
  }
  
  // Dynamically load CSS if not already loaded
  if (!document.querySelector('link[href="./channels/ch4/styles.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './channels/ch4/styles.css';
    document.head.appendChild(link);
  }
  
  // Force header to be visible by notifying MenuManager
  setTimeout(() => {
    import('../../menu-manager.js').then(({ notifyChannelChanged }) => {
      notifyChannelChanged();
      console.log("Notified MenuManager to ensure header and guide button visibility on channel 4");
    }).catch(err => console.error("Error importing MenuManager:", err));
  }, 300);
  
  // Ensure TV Guide has correct positioning and accessibility
  const tvGuide = document.getElementById('tvGuide');
  if (tvGuide) {
    console.log("CH4: Found TV Guide element:", tvGuide);
    tvGuide.style.position = 'fixed';
    tvGuide.style.top = '0';
    tvGuide.style.left = '0';
    tvGuide.style.width = '100%';
    tvGuide.style.height = '100%';
    tvGuide.style.zIndex = '10000000';
    
    // Ensure the TV Guide is in the right place in the DOM
    // Moving it to the body to ensure it's accessible globally
    document.body.appendChild(tvGuide);
    console.log("CH4: Moved TV Guide to body for global access");
    
    // Set up menu button click handler directly
    const menuButton = document.getElementById('menuButton');
    if (menuButton) {
      console.log("CH4: Setting up direct click handler for Guide button");
      menuButton.addEventListener('click', () => {
        console.log("CH4: Menu button clicked, checking TV Guide state");
        const isCurrentlyVisible = tvGuide.style.display === 'flex' && parseFloat(tvGuide.style.opacity || 0) === 1;
        
        if (!isCurrentlyVisible) {
          // Show the guide
          tvGuide.style.display = 'flex';
          tvGuide.style.opacity = '1';
          tvGuide.style.zIndex = '10000000';
          tvGuide.setAttribute('aria-hidden', 'false');
          console.log("CH4: TV Guide opened directly");
        } else {
          // Hide the guide
          tvGuide.style.opacity = '0';
          tvGuide.setAttribute('aria-hidden', 'true');
          setTimeout(() => { 
            tvGuide.style.display = 'none';
            console.log("CH4: TV Guide closed directly");
          }, 500);
        }
      });
    }
  } else {
    console.error("CH4: TV Guide element not found!");
  }
  
  // Create and set up the modals
  createModals();
  setTimeout(setupModalEventListeners, 500);
  
  // Use the YouTube IFrame API to create a player in Channel 4.
  // We wait a short delay to ensure the HTML is in place.
  setTimeout(() => {
    if (typeof YT !== 'undefined' && YT.Player) {
      // Create the player and assign it to a global variable so it can be controlled from main.js.
      window.channel4Player = new YT.Player('youtube-player-4', {
        videoId: 'OFlnSoPm7x4', // New video ID
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: 'OFlnSoPm7x4', // Required for looping the same video
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          fs: 0,
          showinfo: 0
          // We start muted by default; the observer in main.js will unmute if the channel is active.
        },
        events: {
          onReady: event => {
            event.target.mute();
            event.target.playVideo();
            console.log("Channel 4 YouTube Player ready, starting muted.");
          }
        }
      });
    } else {
      console.error("YouTube API not available for Channel 4.");
    }
  }, 500);
}
