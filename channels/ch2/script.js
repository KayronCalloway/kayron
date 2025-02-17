// channels/ch2/script.js

document.addEventListener('DOMContentLoaded', () => {
  const lookbookContainer = document.getElementById('lookbook-container');
  const pages = lookbookContainer.querySelectorAll('.page');
  const prevBtn = lookbookContainer.querySelector('#prevBtn');
  const nextBtn = lookbookContainer.querySelector('#nextBtn');
  const pageIndicator = lookbookContainer.querySelector('#pageIndicator');
  let currentPage = 0;

  function showPage(index) {
    if (index < 0) index = 0;
    if (index >= pages.length) index = pages.length - 1;
    pages.forEach((page, i) => {
      page.classList.toggle('active', i === index);
    });
    currentPage = index;
    pageIndicator.textContent = `Page ${currentPage + 1} of ${pages.length}`;
  }

  prevBtn.addEventListener('click', () => showPage(currentPage - 1));
  nextBtn.addEventListener('click', () => showPage(currentPage + 1));
});
