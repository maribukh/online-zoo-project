document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('pets-grid');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');

  if (grid && btnPrev && btnNext) {
    let currentOffset = 0;
    const step = 440 + 40;
    const cards = grid.querySelectorAll('.pet-card');
    const totalColumns = Math.ceil(cards.length / 2);
    const maxOffset = (totalColumns - 3) * step;

    btnNext.addEventListener('click', () => {
      currentOffset = currentOffset < maxOffset ? currentOffset + step : 0;
      grid.style.transform = `translateX(-${currentOffset}px)`;
    });

    btnPrev.addEventListener('click', () => {
      currentOffset = currentOffset > 0 ? currentOffset - step : maxOffset;
      grid.style.transform = `translateX(-${currentOffset}px)`;
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

  document
    .querySelectorAll('.btn-orange, .btn-outline-white, .btn-fav, .feed-link')
    .forEach((btn) => {
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

  document.getElementById('completeBtn')?.addEventListener('click', () => {
    if (validateStep(steps[2])) {
      alert('Thank you for your donation!');
      closeModal();
      setTimeout(() => {
        steps[2].classList.add('d-none');
        steps[1].classList.add('d-none');
        steps[0].classList.remove('d-none');
        document
          .querySelectorAll('.donation-modal input')
          .forEach((i) => (i.value = ''));
      }, 500);
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
        c.querySelector('.select-list').classList.add('select-hide');
      });
      if (!isActive) {
        container.classList.add('active');
        list.classList.remove('select-hide');
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
});

document.getElementById('heroViewBtn')?.addEventListener('click', () => {
  window.location.href = '../zoos/panda.html';
});

const burgerBtn = document.getElementById('burgerBtn');
const headerMenu = document.getElementById('headerMenu');

burgerBtn?.addEventListener('click', () => {
  headerMenu.classList.toggle('active');
  burgerBtn.classList.toggle('open'); 
});