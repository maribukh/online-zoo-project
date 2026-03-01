document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burgerBtn');
  const headerMenu = document.getElementById('headerMenu');
  const closeBurger = document.getElementById('closeBurger');

  burgerBtn?.addEventListener('click', () => {
    headerMenu?.classList.add('active');
    document.body.classList.add('modal-open');
  });

  closeBurger?.addEventListener('click', () => {
    headerMenu?.classList.remove('active');
    document.body.classList.remove('modal-open');
  });

  headerMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      headerMenu.classList.remove('active');
      document.body.classList.remove('modal-open');
    });
  });

  const sidePanel = document.getElementById('sidePanel');
  const sideToggle = document.getElementById('toggleBtn');
  const sideIcon = document.getElementById('toggleIcon');

  sideToggle?.addEventListener('click', () => {
    sidePanel.classList.toggle('side-panel-hidden');
    if (sideIcon) {
      sideIcon.src = sidePanel.classList.contains('side-panel-hidden')
        ? '../../assets/icons/arrows-left.svg'
        : '../../assets/icons/arrows-right.svg';
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      headerMenu?.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  });
});
