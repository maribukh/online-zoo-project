import type { IPet, IFeedback } from './types';
import { API } from './api/api';
import { initUserProfile } from './auth/userProfile';
void initUserProfile();

document.addEventListener('DOMContentLoaded', async () => {
  const petAssets: Record<number, { img: string; link: string }> = {
    1: { img: '/assets/images/pets/panda.webp', link: 'panda.html' },
    2: { img: '/assets/images/pets/lemur.webp', link: 'lemur.html' },
    3: { img: '/assets/images/pets/gorila.webp', link: 'gorilla.html' },
    4: { img: '/assets/images/pets/aligator.webp', link: 'alligator.html' },
    5: { img: '/assets/images/pets/eagles.webp', link: 'eagle.html' },
    6: { img: '/assets/images/pets/koala.webp', link: 'koala.html' },
    7: { img: '/assets/images/pets/lion.webp', link: 'lion.html' },
    8: { img: '/assets/images/pets/tiger.jpg', link: 'tiger.html' },
  };

  const petsGrid = document.getElementById(
    'pets-grid',
  ) as HTMLDivElement | null;
  const petsLoader = document.getElementById('pets-loader');
  const petsError = document.getElementById('pets-error');
  const testimonialsGrid = document.getElementById(
    'testimonials-grid',
  ) as HTMLDivElement | null;

  async function loadData(): Promise<void> {
    if (petsGrid) {
      try {
        petsLoader?.classList.remove('hidden');
        const res = await API.getPets();
        renderPets(res.data, petsGrid);
        initPetsSlider(petsGrid);
      } catch {
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
        const res = await API.getFeedbacks();
        renderFeedbacks(res.data, testimonialsGrid);
        initTestimonialsSlider(testimonialsGrid);
      } catch {
        console.error('Testimonials load error');
      }
    }
  }

  loadData();

  function renderPets(pets: IPet[], container: HTMLElement): void {
    container.innerHTML = '';
    pets.forEach((pet) => {
      const id = Number(pet.id);
      const assets = petAssets[id] ?? {
        img: '/assets/images/pets/panda.webp',
        link: 'panda.html',
      };
      const card = document.createElement('div');
      card.className = 'pet-card';
      card.innerHTML = `
        <div class="pet-card__image-wrapper">
          <img src="${assets.img}" alt="${pet.name}" class="pet-card__img">
          <span class="pet-card__name-tag">${pet.name}</span>
        </div>
        <div class="pet-card__content">
          <h3 class="pet-card__title">${pet.name}</h3>
          <p class="pet-card__desc">${pet.description}</p>
          <a href="/pages/zoos/${assets.link}" class="pet-card__link btn">View Live Cam</a>
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

      chunk.forEach((fb) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        const fbRecord = fb as unknown as Record<string, unknown>;
        const dateString =
          fbRecord['month'] && fbRecord['year']
            ? `${String(fbRecord['month'])} ${String(fbRecord['year'])}`
            : String(fbRecord['date'] ?? 'Recent');

        card.innerHTML = `
          <div class="content">
            <div class="testimonial-header">
              <img src="../../assets/icons/“.svg" alt="">
              <span class="testimonial-city">${String(fbRecord['city'] ?? 'Unknown')}, ${dateString}</span>
            </div>
            <p class="testimonial-text">${String(fbRecord['text'] ?? '')}</p>
            <span class="testimonial-author">${String(fbRecord['name'] ?? '')}</span>
          </div>`;
        page.appendChild(card);
      });

      container.appendChild(page);
    }
  }

  function initPetsSlider(grid: HTMLElement): void {
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    let offset = 0;

    const update = () => {
      const card = grid.querySelector('.pet-card') as HTMLElement | null;
      if (!card) return;
      const step = card.offsetWidth + 40;
      const total = grid.children.length;
      const max = (Math.ceil(total / 2) - 3) * step;
      if (offset > max) offset = 0;
      if (offset < 0) offset = max;
      grid.style.transform = `translateX(-${offset}px)`;
    };

    btnNext?.addEventListener('click', () => {
      offset += 480;
      update();
    });
    btnPrev?.addEventListener('click', () => {
      offset -= 480;
      update();
    });
  }

  function initTestimonialsSlider(grid: HTMLElement): void {
    const btnPrev = document.querySelector(
      '.testimonials-nav button:first-child',
    ) as HTMLButtonElement | null;
    const btnNext = document.querySelector(
      '.testimonials-nav button:last-child',
    ) as HTMLButtonElement | null;
    const tDots = document.querySelectorAll('.testimonials-pagination .dot');
    let currentPage = 0;

    const update = (page: number) => {
      const pages = grid.querySelectorAll('.testimonials-page');
      const totalPages = pages.length;
      if (totalPages === 0) return;

      let target = page;
      if (target >= totalPages) target = 0;
      if (target < 0) target = totalPages - 1;

      const pageWidth = 1060;
      grid.style.transform = `translateX(-${target * pageWidth}px)`;

      tDots.forEach((d) => d.classList.remove('active'));
      const dotIndex = target % tDots.length;
      (tDots[dotIndex] as HTMLElement | undefined)?.classList.add('active');

      currentPage = target;
    };

    btnNext?.addEventListener('click', () => update(currentPage + 1));
    btnPrev?.addEventListener('click', () => update(currentPage - 1));
    tDots.forEach((dot, i) => dot.addEventListener('click', () => update(i)));
  }

  const modal1 = document.getElementById('donationModal');
  const modal2 = document.getElementById('stepModal');
  const headerMenu = document.getElementById('headerMenu');

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
    headerMenu?.classList.remove('active');
    document.body.classList.remove('modal-open');
  };

  document
    .querySelectorAll(
      '.modal-close, #closeModal, #closeStepModal, #closeBurger',
    )
    .forEach((b) => b.addEventListener('click', closeModal));

  document.getElementById('burgerBtn')?.addEventListener('click', () => {
    headerMenu?.classList.add('active');
    document.body.classList.add('modal-open');
  });

  const steps = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
  ];

  const validate = (el: HTMLElement | null | undefined): boolean => {
    if (!el) return true;
    let ok = true;
    el.querySelectorAll<HTMLInputElement>('input[required]').forEach((i) => {
      const v = i.validity.valid;
      i.parentElement?.classList.toggle('error', !v);
      if (!v) ok = false;
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
        this.innerText = 'SUCCESS! ❤️';
        setTimeout(() => {
          closeModal();
          setTimeout(() => {
            steps[2]?.classList.add('d-none');
            steps[0]?.classList.remove('d-none');
            this.innerText = 'COMPLETE DONATION';
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
    const current = container.querySelector('.select-current') as HTMLElement;
    box?.addEventListener('click', (e) => {
      e.stopPropagation();
      list.classList.toggle('select-hide');
      container.classList.toggle('active');
    });
    list?.querySelectorAll('.select-item').forEach((item) =>
      item.addEventListener('click', () => {
        current.innerText = (item as HTMLElement).innerText;
        current.style.color = '#000';
        list.classList.add('select-hide');
        container.classList.remove('active');
      }),
    );
  });

  document.addEventListener('click', () =>
    document
      .querySelectorAll('.select-list')
      .forEach((l) => l.classList.add('select-hide')),
  );

  document.getElementById('heroViewBtn')?.addEventListener('click', () => {
    window.location.href = '/pages/zoos/panda.html';
  });

  document.querySelectorAll('[data-hover-src]').forEach((btn) => {
    const icon = btn.querySelector('img') as HTMLImageElement | null;
    if (icon) {
      const def = icon.src;
      btn.addEventListener(
        'mouseenter',
        () => (icon.src = (btn as HTMLElement).dataset['hoverSrc'] ?? def),
      );
      btn.addEventListener('mouseleave', () => (icon.src = def));
    }
  });

  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('modal-overlay'))
      closeModal();
  });
});
