const buttons = document.querySelectorAll('.btn, .pet-card__link');

buttons.forEach((button) => {
  const icon = button.querySelector('img');
  if (!icon) return;

  const defaultSrc = icon.src;
  const hoverSrc = '../../assets/icons/Union.svg';

  button.addEventListener('mouseenter', () => {
    icon.src = hoverSrc;
  });

  button.addEventListener('mouseleave', () => {
    icon.src = defaultSrc;
  });
});
