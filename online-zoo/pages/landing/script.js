document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('pets-grid');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');

  if (grid && btnPrev && btnNext) {
    let currentOffset = 0;
    const cardWidth = 440;
    const gap = 40;
    const step = cardWidth + gap;

    const cards = grid.querySelectorAll('.pet-card');
    const totalColumns = Math.ceil(cards.length / 2);
    const visibleColumns = 3;
    const maxOffset = (totalColumns - visibleColumns) * step;

    btnNext.addEventListener('click', () => {
      if (currentOffset < maxOffset) {
        currentOffset += step;
      } else {
        currentOffset = 0;
      }
      grid.style.transform = `translateX(-${currentOffset}px)`;
    });

    btnPrev.addEventListener('click', () => {
      if (currentOffset > 0) {
        currentOffset -= step;
      } else {
        currentOffset = maxOffset;
      }
      grid.style.transform = `translateX(-${currentOffset}px)`;
    });
  }

  const hoverButtons = document.querySelectorAll('[data-hover-src]');
  hoverButtons.forEach((button) => {
    const icon = button.querySelector('img');
    if (!icon) return;
    const defaultSrc = icon.src;
    const hoverSrc = button.dataset.hoverSrc;
    button.addEventListener('mouseenter', () => {
      icon.src = hoverSrc;
    });
    button.addEventListener('mouseleave', () => {
      icon.src = defaultSrc;
    });
  });
});
