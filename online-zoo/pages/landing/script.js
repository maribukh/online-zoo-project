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
