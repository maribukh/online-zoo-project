document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('pets-grid');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');

  if (grid && btnPrev && btnNext) {
    let currentOffset = 0;
    const updateSlider = () => {
      const firstCard = grid.querySelector('.pet-card');
      if (!firstCard) return { step: 0, maxOffset: 0 };
      const cardWidth = firstCard.offsetWidth;
      const gap = parseInt(window.getComputedStyle(grid).gap) || 0;
      const step = cardWidth + gap;
      const cards = grid.querySelectorAll('.pet-card');
      const isMobile = window.innerWidth <= 940;
      const totalSteps = isMobile ? cards.length : Math.ceil(cards.length / 2);
      const visibleSteps = isMobile ? 2 : 3;
      const maxOffset = (totalSteps - visibleSteps) * step;
      return { step, maxOffset };
    };

    btnNext.addEventListener('click', () => {
      const { step, maxOffset } = updateSlider();
      currentOffset = currentOffset < maxOffset ? currentOffset + step : 0;
      grid.style.transform = `translateX(-${currentOffset}px)`;
    });

    btnPrev.addEventListener('click', () => {
      const { step, maxOffset } = updateSlider();
      currentOffset = currentOffset > 0 ? currentOffset - step : maxOffset;
      grid.style.transform = `translateX(-${currentOffset}px)`;
    });

    window.addEventListener('resize', () => {
      currentOffset = 0;
      grid.style.transform = `translateX(0px)`;
    });
  }

  document.querySelectorAll('[data-hover-src]').forEach((button) => {
    const icon = button.querySelector('img');
    if (!icon) return;
    const defaultSrc = icon.src;
    button.addEventListener(
      'mouseenter',
      () => (icon.src = button.dataset.hoverSrc),
    );
    button.addEventListener('mouseleave', () => (icon.src = defaultSrc));
  });

  const modal1 = document.getElementById('donationModal');
  const modal2 = document.getElementById('stepModal');
  const otherBtn = document.querySelector('.donate-btn_other');
  const donateButtons = document.querySelectorAll(
    '.btn-orange, .btn-outline-white, .btn-fav, .feed-link, .btn-box',
  );

  donateButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal1?.classList.add('open');
      document.body.classList.add('modal-open');
    });
  });

  otherBtn?.addEventListener('click', () => {
    modal1?.classList.remove('open');
    modal2?.classList.add('open');
  });

  const closeModal = () => {
    document
      .querySelectorAll('.modal-overlay')
      .forEach((m) => m.classList.remove('open'));
    document.body.classList.remove('modal-open');
  };

  document
    .querySelectorAll('.modal-close, #closeModal, #closeStepModal')
    .forEach((btn) => {
      btn.addEventListener('click', closeModal);
    });

  const steps = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
  ];

  const validateStep = (stepElement) => {
    if (!stepElement) return true;
    const inputs = stepElement.querySelectorAll('input[required]');
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

  document.querySelectorAll('.custom-select-container').forEach((container) => {
    const box = container.querySelector('.select-box');
    const list = container.querySelector('.select-list');
    const currentText = container.querySelector('.select-current');

    box?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = container.classList.contains('active');
      document.querySelectorAll('.custom-select-container').forEach((c) => {
        c.classList.remove('active');
        c.querySelector('.select-list')?.classList.add('select-hide');
      });
      if (!isActive) {
        container.classList.add('active');
        list?.classList.remove('select-hide');
      }
    });

    list?.querySelectorAll('.select-item').forEach((item) => {
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
  });

  document
    .querySelectorAll('input[required], textarea[required]')
    .forEach((input) => {
      input.addEventListener('blur', () => {
        input.parentElement.classList.toggle('error', !input.validity.valid);
      });
      input.addEventListener('input', () => {
        if (input.validity.valid) input.parentElement.classList.remove('error');
      });
    });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
    document
      .querySelectorAll('.select-list')
      .forEach((l) => l.classList.add('select-hide'));
    document
      .querySelectorAll('.custom-select-container')
      .forEach((c) => c.classList.remove('active'));
  });

  document.getElementById('heroViewBtn')?.addEventListener('click', () => {
    window.location.href = '../zoos/panda.html';
  });

  const burgerBtn = document.getElementById('burgerBtn');
  const headerMenu = document.getElementById('headerMenu');
  const closeBurger = document.getElementById('closeBurger');

  burgerBtn?.addEventListener('click', () => {
    headerMenu.classList.toggle('active');
    burgerBtn.classList.toggle('open');
    if (headerMenu.classList.contains('active')) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  });

  closeBurger?.addEventListener('click', () => {
    headerMenu.classList.remove('active');
    burgerBtn.classList.remove('open');
    document.body.classList.remove('modal-open');
  });

  const testimonialGrid = document.querySelector('.testimonials-grid');
  const testBtnPrev = document.querySelector(
    '.testimonials-nav button:first-child',
  );
  const testBtnNext = document.querySelector(
    '.testimonials-nav button:last-child',
  );

  if (testimonialGrid && testBtnPrev && testBtnNext) {
    let testOffset = 0;
    testBtnNext.addEventListener('click', () => {
      const card = testimonialGrid.querySelector('.testimonial-card');
      const stepWidth = card.offsetWidth + 20;
      const max = testimonialGrid.scrollWidth - testimonialGrid.offsetWidth;
      testOffset = testOffset < max ? testOffset + stepWidth : 0;
      testimonialGrid.scrollTo({ left: testOffset, behavior: 'smooth' });
    });

    testBtnPrev.addEventListener('click', () => {
      const card = testimonialGrid.querySelector('.testimonial-card');
      const stepWidth = card.offsetWidth + 20;
      testOffset =
        testOffset > 0 ? testOffset - stepWidth : testimonialGrid.scrollWidth;
      testimonialGrid.scrollTo({ left: testOffset, behavior: 'smooth' });
    });
  }

  const careTrack = document.getElementById('careTrack640');
  const careDots = document.querySelectorAll('.care-pagination .dot');

  careDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const slideIndex = dot.getAttribute('data-slide');
      if (careTrack) {
        careTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
      }
      careDots.forEach((d) => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
});

const tDots = document.querySelectorAll('.testimonials-pagination .dot');
const tGrid = document.querySelector('.testimonials-grid');

tDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    if (tGrid) {
      const step = tGrid.offsetWidth;
      tGrid.scrollTo({
        left: step * index,
        behavior: 'smooth',
      });
    }
    tDots.forEach((d) => d.classList.remove('active'));
    dot.classList.add('active');
  });
});
