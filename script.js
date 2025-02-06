document.addEventListener('DOMContentLoaded', function() {
  const powerButton = document.getElementById('powerButton');
  const landing = document.getElementById('landing');
  const flash = document.getElementById('flash');
  const nameEl = document.getElementById('name');
  const mainContent = document.getElementById('mainContent');

  powerButton.addEventListener('click', () => {
    // 1. Trigger the flash effect
    flash.style.opacity = 1;
    setTimeout(() => {
      flash.style.transition = "opacity 0.5s ease-out";
      flash.style.opacity = 0;
    }, 50);

    // 2. The name animation is triggered via CSS automatically on page load.
    // (Ensure the animation has finished before repositioning.)

    // 3. After a delay (match to your animation duration), hide landing and reposition name
    setTimeout(() => {
      // Hide the landing overlay and show main content
      landing.style.display = 'none';
      mainContent.style.display = 'block';
      document.body.classList.add('active'); // Enable scrolling

      // Reposition and shrink the name element to create a persistent header
      nameEl.style.position = 'fixed';
      nameEl.style.top = '10px';
      nameEl.style.bottom = ''; // Clear any previous bottom positioning
      nameEl.style.left = '50%';
      nameEl.style.transform = 'translateX(-50%) scale(0.5)';
      nameEl.style.fontSize = '1.5rem';
    }, 3500); // Adjust this timing to match your desired sequence
  });
});
