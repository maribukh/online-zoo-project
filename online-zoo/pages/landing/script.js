const buttons = document.querySelectorAll('.btn, .pet-card__link, .arrow-btn');

buttons.forEach((button) => {
  const icon = button.querySelector('img');
  if (!icon) return;

  const defaultSrc = icon.src;
  const hoverSrc = button.getAttribute('data-hover-src') || '../../assets/icons/Union.svg';

  button.addEventListener('mouseenter', () => {
    icon.src = hoverSrc;
  });

  button.addEventListener('mouseleave', () => {
    icon.src = defaultSrc;
  });
});