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
      currentOffset = currentOffset < maxOffset ? currentOffset + step : 0;
      grid.style.transform = `translateX(-${currentOffset}px)`;
    });

    btnPrev.addEventListener('click', () => {
      currentOffset = currentOffset > 0 ? currentOffset - step : maxOffset;
      grid.style.transform = `translateX(-${currentOffset}px)`;
    });
  }

  const hoverButtons = document.querySelectorAll('[data-hover-src]');
  hoverButtons.forEach((button) => {
    const icon = button.querySelector('img');
    if (!icon) return;
    const defaultSrc = icon.src;
    const hoverSrc = button.dataset.hoverSrc;
    button.addEventListener('mouseenter', () => (icon.src = hoverSrc));
    button.addEventListener('mouseleave', () => (icon.src = defaultSrc));
  });

  const modal1 = document.getElementById('donationModal');
  const modal2 = document.getElementById('stepModal');
  const closeBtn1 = document.getElementById('closeModal');
  const closeBtn2 = document.getElementById('closeStepModal');
  const donateButtons = document.querySelectorAll(
    '.btn-orange, .btn-outline-white, .btn-fav, .feed-link',
  );
  const otherAmountBtn = document.querySelector('.donate-btn_other');

  donateButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal1?.classList.add('open');
      document.body.classList.add('modal-open');
    });
  });

  closeBtn1?.addEventListener('click', () => {
    modal1?.classList.remove('open');
    document.body.classList.remove('modal-open');
  });

  if (otherAmountBtn && modal2) {
    otherAmountBtn.addEventListener('click', () => {
      modal1?.classList.remove('open');
      modal2.classList.add('open');
    });
  }

  closeBtn2?.addEventListener('click', () => {
    modal2?.classList.remove('open');
    document.body.classList.remove('modal-open');
  });

  [modal1, modal2].forEach((m) => {
    m?.addEventListener('click', (e) => {
      if (e.target === m) {
        m.classList.remove('open');
        document.body.classList.remove('modal-open');
      }
    });
  });

  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');

  document.getElementById('toStep2')?.addEventListener('click', () => {
    step1.classList.add('d-none');
    step2.classList.remove('d-none');
  });

  document.getElementById('toStep3')?.addEventListener('click', () => {
    step2.classList.add('d-none');
    step3.classList.remove('d-none');
  });

  document.getElementById('backTo1')?.addEventListener('click', () => {
    step2.classList.add('d-none');
    step1.classList.remove('d-none');
  });

  document.getElementById('backTo2')?.addEventListener('click', () => {
    step3.classList.add('d-none');
    step2.classList.remove('d-none');
  });

  const amountBtns = document.querySelectorAll('.amount-btn');
  amountBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      amountBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const setupDropdown = (container) => {
    const box = container.querySelector('.select-box');
    const list = container.querySelector('.select-list');
    const currentText = container.querySelector('.select-current');

    if (!box || !list) return;

    box.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = container.classList.contains('active');
      document.querySelectorAll('.custom-select-container').forEach((c) => {
        c.classList.remove('active');
        c.querySelector('.select-list').classList.add('select-hide');
      });
      if (!isActive) {
        container.classList.add('active');
        list.classList.remove('select-hide');
      }
    });

    list.querySelectorAll('.select-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        currentText.innerText = item.innerText;
        currentText.style.color = '#000';
        list
          .querySelectorAll('.select-item')
          .forEach((i) => i.classList.remove('selected'));
        item.classList.add('selected');
        list.classList.add('select-hide');
        container.classList.remove('active');
      });
    });
  };

  document.querySelectorAll('.custom-select-container').forEach(setupDropdown);

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.custom-select-container').forEach((c) => {
      c.classList.remove('active');
      c.querySelector('.select-list').classList.add('select-hide');
    });
  });

  const allInputs = document.querySelectorAll(
    'input[required], textarea[required]',
  );
  allInputs.forEach((input) => {
    input.addEventListener('blur', () => {
      if (!input.validity.valid) {
        input.parentElement.classList.add('error');
      } else {
        input.parentElement.classList.remove('error');
      }
    });

    input.addEventListener('input', () => {
      if (input.validity.valid) {
        input.parentElement.classList.remove('error');
      }
    });
  });

  const forms = document.querySelectorAll('.contact-form, .donation-modal');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      let isFormValid = true;
      const inputs = form.querySelectorAll(
        'input[required], textarea[required]',
      );
      inputs.forEach((input) => {
        if (!input.validity.valid) {
          input.parentElement.classList.add('error');
          isFormValid = false;
        }
      });
      if (!isFormValid) {
        e.preventDefault();
      }
    });
  });
});
