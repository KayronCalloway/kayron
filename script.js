// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const powerButton = document.getElementById('powerButton');
  const landing = document.getElementById('landing');
  const flash = document.getElementById('flash');
  const nameEl = document.getElementById('name');
  const mainContent = document.getElementById('mainContent');

  powerButton.addEventListener('click', () => {
    // 1. Trigger the Flash Effect
    flash.style.opacity = 1;
    setTimeout(() => {
      flash.style.transition = "opacity 0.5s ease-out";
      flash.style.opacity = 0;
    }, 50);

    // 2. Animate the Name (simulate TV turning on)
    setTimeout(() => {
      nameEl.style.animation = "slideIn 3s forwards";
    }, 200); // slight delay to let the flash start

    // 3. After the animations, hide the landing overlay and show the main content
    setTimeout(() => {
      landing.style.display = 'none';
      mainContent.style.display = 'block';
      document.body.classList.add('active'); // re-enable scrolling
    }, 3500); // adjust this timing to match the animations
  });
});
