import type { IPet, IFeedback } from './types';
import { API } from './api/api';

document.addEventListener('DOMContentLoaded', async () => {
  const petsGrid = document.getElementById(
    'pets-grid',
  ) as HTMLDivElement | null;
  const petsLoader = document.getElementById(
    'pets-loader',
  ) as HTMLElement | null;
  const petsError = document.getElementById('pets-error') as HTMLElement | null;
  const testimonialsGrid = document.getElementById(
    'testimonials-grid',
  ) as HTMLDivElement | null;
  const testimonialsLoader = document.getElementById(
    'testimonials-loader',
  ) as HTMLElement | null;

  async function loadInitialData() {
    if (petsGrid) {
      try {
        petsLoader?.classList.remove('hidden');
        const response = await API.getPets();
        renderPets(response.data, petsGrid);
        initPetsSlider(petsGrid);
      } catch (error) {
        if (petsError) {
          petsError.innerText =
            'Something went wrong. Please, refresh the page';
          petsError.classList.remove('hidden');
        }
      } finally {
        petsLoader?.classList.add('hidden');
      }
    }

    if (testimonialsGrid) {
      try {
        testimonialsLoader?.classList.remove('hidden');
        const response = await API.getFeedbacks();
        renderFeedbacks(response.data, testimonialsGrid);
        initTestimonialsSlider(testimonialsGrid);
      } catch (error) {
        console.error('Testimonials load error:', error);
      } finally {
        testimonialsLoader?.classList.add('hidden');
      }
    }
  }

  loadInitialData();

  function renderPets(pets: IPet[], container: HTMLElement): void {
    container.innerHTML = '';

    const assetMap: Record<number, { img: string; link: string }> = {
      1: { img: '/assets/images/pets/panda.webp', link: 'panda.html' },
      2: { img: '/assets/images/pets/lemur.webp', link: 'lemur.html' },
      3: { img: '/assets/images/pets/gorila.webp', link: 'gorilla.html' },
      4: { img: '/assets/images/pets/aligator.webp', link: 'alligator.html' },
      5: { img: '/assets/images/pets/eagles.webp', link: 'eagle.html' },
      6: { img: '/assets/images/pets/koala.webp', link: 'koala.html' },
      7: { img: '/assets/images/pets/lion.webp', link: 'lion.html' },
      8: { img: '/assets/images/pets/tiger.jpg', link: 'tiger.html' },
    };

    pets.forEach((pet) => {
      const card = document.createElement('div');
      card.className = 'pet-card';

      const id = Number(pet.id);
      const customData = assetMap[id] || {
        img: `/assets/images/pets/panda.webp`,
        link: 'panda.html',
      };

      card.innerHTML = `
        <div class="pet-card__image-wrapper">
          <img src="${customData.img}" alt="${pet.name}" class="pet-card__img">
          <span class="pet-card__name-tag">${pet.name}</span>
        </div>
        <div class="pet-card__content">
          <h3 class="pet-card__title">${pet.name}</h3>
          <p class="pet-card__desc">${pet.description}</p>
          <a href="/pages/zoos/${customData.link}" class="pet-card__link btn">View Live Cam</a>
        </div>`;
      container.appendChild(card);
    });
  }

  function renderFeedbacks(
    feedbacks: IFeedback[],
    container: HTMLElement,
  ): void {
    container.innerHTML = '';
    const cardsPerPage = 4;

    for (let i = 0; i < feedbacks.length; i += cardsPerPage) {
      const page = document.createElement('div');
      page.className = 'testimonials-page';
      const chunk = feedbacks.slice(i, i + cardsPerPage);

      chunk.forEach((fb: any) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        const dateString =
          fb.month && fb.year ? `${fb.month} ${fb.year}` : fb.date || 'Recent';
        card.innerHTML = `
        <div class="content">
          <div class="testimonial-header">
            <img src="/assets/icons/“.svg" alt="icon">
            <span class="testimonial-city">${fb.city || 'Unknown'}, ${dateString}</span>
          </div>
          <p class="testimonial-text">${fb.text}</p>
          <span class="testimonial-author">${fb.name}</span>
        </div>`;
        page.appendChild(card);
      });
      container.appendChild(page);
    }
  }

  function initPetsSlider(grid: HTMLElement) {
    const btnPrev = document.querySelector(
      '.btn-prev',
    ) as HTMLButtonElement | null;
    const btnNext = document.querySelector(
      '.btn-next',
    ) as HTMLButtonElement | null;
    if (!btnPrev || !btnNext) return;

    let currentOffset = 0;
    const getParams = () => {
      const card = grid.querySelector('.pet-card') as HTMLElement;
      if (!card) return { step: 0, max: 0 };
      const step = card.offsetWidth + 40;
      const total = grid.querySelectorAll('.pet-card').length;
      const isMobile = window.innerWidth <= 940;
      const max =
        ((isMobile ? total : Math.ceil(total / 2)) - (isMobile ? 2 : 3)) * step;
      return { step, max };
    };

    btnNext.addEventListener('click', () => {
      const { step, max } = getParams();
      currentOffset = currentOffset < max ? currentOffset + step : 0;
      grid.style.transform = `translateX(-${currentOffset}px)`;
    });

    btnPrev.addEventListener('click', () => {
      const { step, max } = getParams();
      currentOffset = currentOffset > 0 ? currentOffset - step : max;
      grid.style.transform = `translateX(-${currentOffset}px)`;
    });
  }

  function initTestimonialsSlider(grid: HTMLElement) {
    const btnPrev = document.querySelector(
      '.testimonials-nav button:first-child',
    ) as HTMLButtonElement | null;
    const btnNext = document.querySelector(
      '.testimonials-nav button:last-child',
    ) as HTMLButtonElement | null;
    const tDots = document.querySelectorAll('.testimonials-pagination .dot');

    let currentPage = 0;

    const updateTestimonials = (page: number) => {
      const pages = grid.querySelectorAll('.testimonials-page');
      const totalPages = pages.length;
      if (totalPages === 0) return;

      let targetPage = page;
      if (targetPage >= totalPages) targetPage = 0;
      if (targetPage < 0) targetPage = totalPages - 1;

      const pageWidth = grid.parentElement?.offsetWidth || 1060;
      grid.style.transform = `translateX(-${targetPage * (pageWidth + 30)}px)`;

      tDots.forEach((d) => d.classList.remove('active'));
      const dotIndex = targetPage % tDots.length;
      (tDots[dotIndex] as HTMLElement)?.classList.add('active');

      currentPage = targetPage;
    };

    btnNext?.addEventListener('click', () =>
      updateTestimonials(currentPage + 1),
    );
    btnPrev?.addEventListener('click', () =>
      updateTestimonials(currentPage - 1),
    );

    tDots.forEach((dot, i) => {
      dot.addEventListener('click', () => updateTestimonials(i));
    });
  }

  const modal1 = document.getElementById('donationModal');
  const modal2 = document.getElementById('stepModal');
  const burgerMenu = document.getElementById('headerMenu');

  document
    .querySelectorAll(
      '.btn-orange:not(#heroViewBtn), .btn-outline-white, .btn-fav, .feed-link, .btn-box',
    )
    .forEach((btn) =>
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal1?.classList.add('open');
        document.body.classList.add('modal-open');
      }),
    );

  document.querySelector('.donate-btn_other')?.addEventListener('click', () => {
    modal1?.classList.remove('open');
    modal2?.classList.add('open');
  });

  const closeModal = () => {
    modal1?.classList.remove('open');
    modal2?.classList.remove('open');
    burgerMenu?.classList.remove('active');
    document.body.classList.remove('modal-open');
  };

  document
    .querySelectorAll(
      '.modal-close, #closeModal, #closeStepModal, #closeBurger',
    )
    .forEach((btn) => btn.addEventListener('click', closeModal));

  document.getElementById('burgerBtn')?.addEventListener('click', () => {
    burgerMenu?.classList.toggle('active');
    document.body.classList.toggle('modal-open');
  });

  const steps: (HTMLElement | null)[] = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
  ];

  const validate = (el: HTMLElement | null | undefined): boolean => {
    if (!el) return true;
    const inputs = el.querySelectorAll<HTMLInputElement>('input[required]');
    let ok = true;
    inputs.forEach((i) => {
      const isValid = i.validity.valid;
      i.parentElement?.classList.toggle('error', !isValid);
      if (!isValid) ok = false;
    });
    return ok;
  };

  document.getElementById('toStep2')?.addEventListener('click', () => {
    if (validate(steps[0])) {
      steps[0]?.classList.add('d-none');
      steps[1]?.classList.remove('d-none');
    }
  });
  document.getElementById('toStep3')?.addEventListener('click', () => {
    if (validate(steps[1])) {
      steps[1]?.classList.add('d-none');
      steps[2]?.classList.remove('d-none');
    }
  });
  document.getElementById('backTo1')?.addEventListener('click', () => {
    steps[1]?.classList.add('d-none');
    steps[0]?.classList.remove('d-none');
  });
  document.getElementById('backTo2')?.addEventListener('click', () => {
    steps[2]?.classList.add('d-none');
    steps[1]?.classList.remove('d-none');
  });

  document
    .getElementById('completeBtn')
    ?.addEventListener('click', function (this: HTMLButtonElement) {
      if (validate(steps[2])) {
        this.innerHTML = 'SUCCESS! ❤️';
        setTimeout(() => {
          closeModal();
          setTimeout(() => {
            steps[2]?.classList.add('d-none');
            steps[0]?.classList.remove('d-none');
            this.innerHTML = 'COMPLETE DONATION';
          }, 500);
        }, 1500);
      }
    });

  document.querySelectorAll('input[required]').forEach((input) => {
    input.addEventListener('blur', () =>
      (input as HTMLElement).parentElement?.classList.toggle(
        'error',
        !(input as HTMLInputElement).validity.valid,
      ),
    );
  });

  document.querySelectorAll('.custom-select-container').forEach((container) => {
    const box = container.querySelector('.select-box') as HTMLElement;
    const list = container.querySelector('.select-list') as HTMLElement;
    const currentText = container.querySelector(
      '.select-current',
    ) as HTMLElement;
    box?.addEventListener('click', (e) => {
      e.stopPropagation();
      list?.classList.toggle('select-hide');
      container.classList.toggle('active');
    });
    list?.querySelectorAll('.select-item').forEach((item) => {
      item.addEventListener('click', () => {
        currentText.innerText = (item as HTMLElement).innerText;
        currentText.style.color = '#000';
        list.classList.add('select-hide');
        container.classList.remove('active');
      });
    });
  });

  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('modal-overlay'))
      closeModal();
    document
      .querySelectorAll('.select-list')
      .forEach((l) => l.classList.add('select-hide'));
  });

  document.getElementById('heroViewBtn')?.addEventListener('click', () => {
    window.location.href = '/pages/zoos/panda.html';
  });

  document.querySelectorAll('[data-hover-src]').forEach((button) => {
    const btnElement = button as HTMLElement;
    const icon = btnElement.querySelector('img') as HTMLImageElement | null;
    if (!icon) return;
    const defaultSrc = icon.src;
    btnElement.addEventListener(
      'mouseenter',
      () => (icon.src = btnElement.dataset['hoverSrc'] || defaultSrc),
    );
    btnElement.addEventListener('mouseleave', () => (icon.src = defaultSrc));
  });
});
