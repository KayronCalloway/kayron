const pages = document.querySelectorAll('.page');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');
let currentPage = 0;

function showPage(index) {
  // Clamp the index
  if (index < 0) index = 0;
  if (index >= pages.length) index = pages.length - 1;
  
  pages.forEach((page, i) => {
    page.classList.toggle('active', i === index);
  });
  
  currentPage = index;
  pageIndicator.textContent = `Page ${currentPage + 1} of ${pages.length}`;
}

prevBtn.addEventListener('click', () => {
  showPage(currentPage - 1);
});

nextBtn.addEventListener('click', () => {
  showPage(currentPage + 1);
});
