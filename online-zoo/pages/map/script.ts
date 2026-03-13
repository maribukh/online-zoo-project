import { initUserProfile } from '../../src/auth/userProfile';

void initUserProfile();

document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burgerBtn');
  const headerMenu = document.getElementById('headerMenu');
  const closeBurger = document.getElementById('closeBurger');

  burgerBtn?.addEventListener('click', () => {
    headerMenu?.classList.add('active');
    document.body.classList.add('modal-open');
  });

  const closeMobileMenu = () => {
    headerMenu?.classList.remove('active');
    document.body.classList.remove('modal-open');
  };

  closeBurger?.addEventListener('click', closeMobileMenu);
  headerMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      closeMobileMenu();
    }
  });
});
