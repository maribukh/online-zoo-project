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
    '.btn-orange:not(#heroViewBtn), .btn-outline-white, .btn-fav, .feed-link, .btn-box',
  );
  const otherAmountBtn = document.querySelector('.donate-btn_other');

  donateButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal1?.classList.add('open');
      document.body.classList.add('modal-open');
    });
  });

  otherAmountBtn?.addEventListener('click', () => {
    modal1?.classList.remove('open');
    modal2?.classList.add('open');
  });

  const closeModal = () => {
    document
      .querySelectorAll('.modal-overlay')
      .forEach((m) => m.classList.remove('open'));
    document.body.classList.remove('modal-open');
  };

  [closeBtn1, closeBtn2].forEach((btn) =>
    btn?.addEventListener('click', closeModal),
  );

  [modal1, modal2].forEach((m) => {
    m?.addEventListener('click', (e) => {
      if (e.target === m) closeModal();
    });
  });

  const steps = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
  ];

  const validateStep = (stepElement) => {
    if (!stepElement) return true;
    const inputs = stepElement.querySelectorAll(
      'input[required], textarea[required]',
    );
    let isValid = true;
    inputs.forEach((input) => {
      const parent = input.parentElement;
      if (!input.validity.valid) {
        parent.classList.add('error');
        isValid = false;
      } else {
        parent.classList.remove('error');
      }
    });
    return isValid;
  };

  document.getElementById('toStep2')?.addEventListener('click', () => {
    if (validateStep(steps[0])) {
      steps[0].classList.add('d-none');
      steps[1].classList.remove('d-none');
    }
  });

  document.getElementById('toStep3')?.addEventListener('click', () => {
    if (validateStep(steps[1])) {
      steps[1].classList.add('d-none');
      steps[2].classList.remove('d-none');
    }
  });

  document
    .getElementById('completeBtn')
    ?.addEventListener('click', function () {
      if (validateStep(steps[2])) {
        const originalText = this.innerHTML;
        this.innerHTML = 'SUCCESS! ❤️';
        setTimeout(() => {
          closeModal();
          setTimeout(() => {
            steps[2].classList.add('d-none');
            steps[1].classList.add('d-none');
            steps[0].classList.remove('d-none');
            this.innerHTML = originalText;
            document
              .querySelectorAll('.donation-modal input')
              .forEach((i) => (i.value = ''));
          }, 500);
        }, 1500);
      }
    });

  document.getElementById('backTo1')?.addEventListener('click', () => {
    steps[1].classList.add('d-none');
    steps[0].classList.remove('d-none');
  });

  document.getElementById('backTo2')?.addEventListener('click', () => {
    steps[2].classList.add('d-none');
    steps[1].classList.remove('d-none');
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
        c.querySelector('.select-list')?.classList.add('select-hide');
      });
      if (!isActive) {
        container.classList.add('active');
        list.classList.remove('select-hide');
      }
    });
    list.querySelectorAll('.select-item').forEach((item) => {
      item.addEventListener('click', () => {
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

  document.addEventListener('click', () => {
    document
      .querySelectorAll('.select-list')
      .forEach((l) => l.classList.add('select-hide'));
    document
      .querySelectorAll('.custom-select-container')
      .forEach((c) => c.classList.remove('active'));
  });
});
