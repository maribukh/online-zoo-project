import type { IPet } from './types';
import { API } from './api/api';

interface IPetDetail {
  id: number;
  commonName: string;
  scientificName: string;
  type: string;
  size: string;
  diet: string;
  habitat: string;
  range: string;
  latitude: string;
  longitude: string;
  description: string;
  detailedDescription: string;
}

interface CameraItem {
  id: number;
  petId: number;
  text: string;
}

const petAssets: Record<
  number,
  { img: string; icon: string; link: string; mainVideo: string; cams: string[] }
> = {
  1: {
    img: '/assets/images/pets/panda.webp',
    icon: '/assets/images/map/animals/Panda.svg',
    link: 'panda.html',
    mainVideo: '/assets/images/panda-live.jpg',
    cams: [
      '/assets/images/cam/cam-views.jpg',
      '/assets/images/cam/cam-view2.jpg',
      '/assets/images/cam/cam-view3.jpg',
    ],
  },
  2: {
    img: '/assets/images/pets/lemur.webp',
    icon: '/assets/images/map/animals/Lemur.svg',
    link: 'lemur.html',
    mainVideo: '/assets/images/lemur-backgorund.jpg',
    cams: [
      '/assets/images/cam/lemur-live.jpg',
      '/assets/images/cam/lemur-live2.jpg',
      '/assets/images/cam/lemur-live3.jpg',
    ],
  },
  3: {
    img: '/assets/images/pets/gorila.webp',
    icon: '/assets/images/map/animals/Gorilla.svg',
    link: 'gorilla.html',
    mainVideo: '/assets/images/gorilla-background.jpg',
    cams: [
      '/assets/images/cam/gorilla-live.jpg',
      '/assets/images/cam/gorilla-live2.jpg',
      '/assets/images/cam/gorilla-live3.jpg',
    ],
  },
  4: {
    img: '/assets/images/pets/aligator.webp',
    icon: '/assets/images/map/animals/Panda.svg',
    link: 'alligator.html',
    mainVideo: '/assets/images/panda-live.jpg',
    cams: [
      '/assets/images/cam/cam-views.jpg',
      '/assets/images/cam/cam-view2.jpg',
      '/assets/images/cam/cam-view3.jpg',
    ],
  },
  5: {
    img: '/assets/images/pets/eagles.webp',
    icon: '/assets/images/map/animals/Eagle.svg',
    link: 'eagle.html',
    mainVideo: '/assets/images/eagle-background.jpg',
    cams: [
      '/assets/images/cam/Eagles-live.jpg',
      '/assets/images/cam/Eagle-live2.jpg',
      '/assets/images/cam/Eagle-live3.jpg',
    ],
  },
  6: {
    img: '/assets/images/pets/koala.webp',
    icon: '/assets/images/map/animals/Panda.svg',
    link: 'koala.html',
    mainVideo: '/assets/images/panda-live.jpg',
    cams: [
      '/assets/images/cam/cam-views.jpg',
      '/assets/images/cam/cam-view2.jpg',
      '/assets/images/cam/cam-view3.jpg',
    ],
  },
  7: {
    img: '/assets/images/pets/lion.webp',
    icon: '/assets/images/map/animals/Panda.svg',
    link: 'lion.html',
    mainVideo: '/assets/images/panda-live.jpg',
    cams: [
      '/assets/images/cam/cam-views.jpg',
      '/assets/images/cam/cam-view2.jpg',
      '/assets/images/cam/cam-view3.jpg',
    ],
  },
  8: {
    img: '/assets/images/pets/tiger.jpg',
    icon: '/assets/images/map/animals/Panda.svg',
    link: 'tiger.html',
    mainVideo: '/assets/images/panda-live.jpg',
    cams: [
      '/assets/images/cam/cam-views.jpg',
      '/assets/images/cam/cam-view2.jpg',
      '/assets/images/cam/cam-view3.jpg',
    ],
  },
};

const DEFAULT_ICON = '/assets/images/map/animals/Panda.svg';
const DEFAULT_IMG = '/assets/images/pets/panda.webp';
const DEFAULT_VIDEO = '/assets/images/panda-live.jpg';
const DEFAULT_CAM = '/assets/images/cam/cam-views.jpg';

const CAM_VISIBLE = 3;
const SIDEBAR_VISIBLE = 4;

let camIndex = 0;
let camTotal = 0;
let sidebarOffset = 0;
let allPets: IPet[] = [];
let allCams: CameraItem[] = [];

document.addEventListener('DOMContentLoaded', async () => {
  const sideLoader = document.getElementById('side-loader');
  const sideError = document.getElementById('side-error');
  const panelLarge = document.getElementById('panelLarge');

  document
    .querySelector('.toggle-open')
    ?.addEventListener('click', () => panelLarge?.classList.add('active'));
  document
    .querySelector('.toggle-close')
    ?.addEventListener('click', () => panelLarge?.classList.remove('active'));

  sideLoader?.classList.remove('hidden');

  try {
    const [petsRes, cams] = await Promise.all([API.getPets(), fetchCameras()]);
    allPets = petsRes.data;
    allCams = cams;

    renderSmallSidebar();
    renderLargeSidebar();

    const first = allPets[0];
    if (first) await selectAnimal(first);
  } catch {
    if (sideError) {
      sideError.innerText = 'Something went wrong. Please, refresh the page';
      sideError.classList.remove('hidden');
    }
  } finally {
    sideLoader?.classList.add('hidden');
  }

  initCamSlider();
});

async function fetchCameras(): Promise<CameraItem[]> {
  try {
    const res = await fetch(
      'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/cameras',
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { data?: CameraItem[] } | CameraItem[];
    return Array.isArray(data)
      ? data
      : ((data as { data?: CameraItem[] }).data ?? []);
  } catch {
    return [];
  }
}

async function fetchPetDetail(id: number): Promise<IPetDetail | null> {
  try {
    const res = await fetch(
      `https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets/${id}`,
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: IPetDetail } | IPetDetail;
    return (json as { data?: IPetDetail }).data ?? (json as IPetDetail);
  } catch {
    return null;
  }
}

// SELECT ANIMAL
async function selectAnimal(pet: IPet): Promise<void> {
  const petId = Number(pet.id);

  ['sidebar-list-small', 'sidebar-list-large'].forEach((id) => {
    document
      .getElementById(id)
      ?.querySelectorAll('.animal-item')
      .forEach((el) =>
        el.classList.toggle(
          'active',
          (el as HTMLElement).dataset['petId'] === String(pet.id),
        ),
      );
  });

  updateMainVideo(petId, pet.name);

  const petCams = allCams.filter((c) => c.petId === petId);
  buildCamSlider(petCams, petId);

  // Load detailed info
  const detail = await fetchPetDetail(petId);
  if (detail) {
    updateDidYouKnow(detail, petId);
  } else {
    // fallback to basic pet data
    updateDidYouKnowFallback(pet, petId);
  }
}

// MAIN VIDEO
function updateMainVideo(petId: number, petName: string): void {
  const assets = petAssets[petId];
  const src = assets?.mainVideo ?? DEFAULT_VIDEO;

  const mainImg = document.querySelector(
    '.video-bg-img',
  ) as HTMLImageElement | null;
  if (mainImg) {
    mainImg.src = src;
    mainImg.alt = petName;
  }

  const overlay = document.querySelector('.video-title-overlay');
  if (overlay) overlay.textContent = `${petName}, cam 1`;

  const zooTitle = document.querySelector('.zoos-title');
  if (zooTitle) zooTitle.textContent = `LIVE ${petName.toUpperCase()} CAMS`;
}

// DID YOU KNOW — from API detail
function updateDidYouKnow(detail: IPetDetail, petId: number): void {
  const factsSection = document.querySelector('.facts') as HTMLElement | null;
  if (factsSection) {
    factsSection.style.opacity = '0.4';
    factsSection.style.transition = 'opacity 0.3s';
  }

  const img = petAssets[petId]?.img ?? DEFAULT_IMG;

  const introText = document.getElementById('did-you-know-content');
  if (introText) introText.textContent = detail.description ?? '';

  const factImg = document.getElementById(
    'fact-image',
  ) as HTMLImageElement | null;
  if (factImg) {
    factImg.src = img;
    factImg.alt = detail.commonName;
  }

  const factsList = document.getElementById('facts-list');
  if (factsList) {
    const rows: Array<[string, string]> = [
      ['Common name', detail.commonName ?? '—'],
      ['Scientific name', detail.scientificName ?? '—'],
      ['Type', detail.type ?? '—'],
      ['Size', detail.size ?? '—'],
      ['Diet', detail.diet ?? '—'],
      ['Habitat', detail.habitat ?? '—'],
      ['Range', detail.range ?? '—'],
    ];
    factsList.innerHTML = rows
      .map(([label, value], i) => {
        const isLast = i === rows.length - 1;
        return `<li${isLast ? ' class="position"' : ''}>
        <strong>${label}:</strong> ${value}
        ${isLast ? `<a href="/pages/map/index.html" class="view-map-link btn">VIEW MAP <img src="/assets/icons/union-orange.svg" alt=""></a>` : ''}
      </li>`;
      })
      .join('');
  }

  const fullDesc = document.getElementById('pet-full-desc');
  if (fullDesc)
    fullDesc.textContent =
      detail.detailedDescription ?? detail.description ?? '';

  if (factsSection) factsSection.style.opacity = '1';
}

// DID YOU KNOW — fallback (no detail API)
function updateDidYouKnowFallback(pet: IPet, petId: number): void {
  const factsSection = document.querySelector('.facts') as HTMLElement | null;
  if (factsSection) {
    factsSection.style.opacity = '0.4';
    factsSection.style.transition = 'opacity 0.3s';
  }

  const img = petAssets[petId]?.img ?? DEFAULT_IMG;

  const introText = document.getElementById('did-you-know-content');
  if (introText) introText.textContent = pet.description ?? '';

  const factImg = document.getElementById(
    'fact-image',
  ) as HTMLImageElement | null;
  if (factImg) {
    factImg.src = img;
    factImg.alt = pet.name;
  }

  const factsList = document.getElementById('facts-list');
  if (factsList) {
    factsList.innerHTML = `
      <li><strong>Common name:</strong> ${pet.name}</li>
      <li class="position"><strong>Range:</strong> —
        <a href="/pages/map/index.html" class="view-map-link btn">VIEW MAP <img src="/assets/icons/union-orange.svg" alt=""></a>
      </li>`;
  }

  const fullDesc = document.getElementById('pet-full-desc');
  if (fullDesc) fullDesc.textContent = pet.description ?? '';

  if (factsSection) factsSection.style.opacity = '1';
}

// SIDEBARS
function renderSmallSidebar(): void {
  const container = document.getElementById(
    'sidebar-list-small',
  ) as HTMLUListElement | null;
  if (!container) return;
  container.innerHTML = '';

  allPets.forEach((pet, i) => {
    const id = Number(pet.id);
    const icon = petAssets[id]?.icon ?? DEFAULT_ICON;
    const li = document.createElement('li');
    li.className = `animal-item${i === 0 ? ' active' : ''}${i >= SIDEBAR_VISIBLE ? ' sidebar-hidden' : ''}`;
    li.dataset['petId'] = String(pet.id);
    li.innerHTML = `
      <a href="#" class="animal-icon-link">
        <div class="icon-circle">
          <img src="${icon}" alt="${pet.name}">
        </div>
      </a>`;
    li.addEventListener('click', async (e) => {
      e.preventDefault();
      await selectAnimal(pet);
    });
    container.appendChild(li);
  });

  const navBottom = document.querySelector('#panelSmall .animal-nav-bottom');
  if (navBottom) {
    navBottom.classList.toggle(
      'sidebar-hidden',
      allPets.length <= SIDEBAR_VISIBLE,
    );
    navBottom.addEventListener('click', () => scrollSidebar('small'));
  }
}

function renderLargeSidebar(): void {
  const container = document.getElementById(
    'sidebar-list-large',
  ) as HTMLUListElement | null;
  if (!container) return;
  container.innerHTML = '';

  allPets.forEach((pet, i) => {
    const id = Number(pet.id);
    const icon = petAssets[id]?.icon ?? DEFAULT_ICON;
    const li = document.createElement('li');
    li.className = `animal-item${i === 0 ? ' active' : ''}${i >= SIDEBAR_VISIBLE ? ' sidebar-hidden' : ''}`;
    li.dataset['petId'] = String(pet.id);
    li.innerHTML = `
      <div class="animal-content">
        <a href="#" class="animal-icon-link">
          <img src="${icon}" alt="${pet.name}">
        </a>
        <div class="animal-desc"><p>${pet.description}</p></div>
      </div>`;
    li.addEventListener('click', async (e) => {
      e.preventDefault();
      await selectAnimal(pet);
    });
    container.appendChild(li);
  });

  const navBottom = document.querySelector('#panelLarge .animal-nav-bottom');
  if (navBottom) {
    navBottom.classList.toggle(
      'sidebar-hidden',
      allPets.length <= SIDEBAR_VISIBLE,
    );
    navBottom.addEventListener('click', () => scrollSidebar('large'));
  }
}

function scrollSidebar(panel: 'small' | 'large'): void {
  const containerId =
    panel === 'small' ? 'sidebar-list-small' : 'sidebar-list-large';
  const container = document.getElementById(containerId);
  if (!container) return;

  sidebarOffset = Math.min(sidebarOffset + 1, allPets.length - SIDEBAR_VISIBLE);

  container.querySelectorAll('.animal-item').forEach((item, i) => {
    const inView = i >= sidebarOffset && i < sidebarOffset + SIDEBAR_VISIBLE;
    item.classList.toggle('sidebar-hidden', !inView);
    if (inView && i === sidebarOffset + SIDEBAR_VISIBLE - 1) {
      item.classList.add('sliding-in');
      setTimeout(() => item.classList.remove('sliding-in'), 400);
    }
  });

  const panelId = panel === 'small' ? 'panelSmall' : 'panelLarge';
  const navBottom = document.querySelector(`#${panelId} .animal-nav-bottom`);
  navBottom?.classList.toggle(
    'sidebar-hidden',
    sidebarOffset >= allPets.length - SIDEBAR_VISIBLE,
  );
}

// CAM SLIDER
function buildCamSlider(cams: CameraItem[], petId: number): void {
  const carousel = document.querySelector(
    '.more-live__carousel',
  ) as HTMLElement | null;
  if (!carousel) return;

  camIndex = 0;
  const baseCams = petAssets[petId]?.cams ?? [
    DEFAULT_CAM,
    DEFAULT_CAM,
    DEFAULT_CAM,
  ];

  const items =
    cams.length > 0
      ? cams.map((cam, i) => ({
          text: cam.text,
          img: baseCams[i % baseCams.length] ?? DEFAULT_CAM,
        }))
      : baseCams.map((img, i) => ({ text: `Cam ${i + 1}`, img }));

  while (items.length < CAM_VISIBLE)
    items.push({ text: `Cam ${items.length + 1}`, img: DEFAULT_CAM });

  camTotal = items.length;
  carousel.style.transition = 'none';
  carousel.style.transform = 'translateX(0)';

  carousel.innerHTML = items
    .map(
      (item, i) => `
    <div class="live-card${i === 0 ? ' live-card_active' : ''}" data-index="${i}">
      <img src="${item.img}" alt="${item.text}" class="live-card__img" onerror="this.src='${DEFAULT_CAM}'">
      <div class="live-card__badge">CAM ${i + 1} <img src="/assets/icons/cam.svg" alt=""></div>
      <button class="live-card__play"><img src="/assets/icons/play-button.svg" alt="play"></button>
    </div>`,
    )
    .join('');

  carousel.querySelectorAll('.live-card').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = Number((card as HTMLElement).dataset['index']);
      const mainImg = document.querySelector(
        '.video-bg-img',
      ) as HTMLImageElement | null;
      if (mainImg) mainImg.src = items[idx]?.img ?? DEFAULT_CAM;
      carousel
        .querySelectorAll('.live-card')
        .forEach((c) => c.classList.remove('live-card_active'));
      card.classList.add('live-card_active');
    });
  });

  updateCamArrows();
}

function initCamSlider(): void {
  document.querySelector('.slider-btn_left')?.addEventListener('click', () => {
    if (camIndex <= 0) return;
    camIndex--;
    moveCamSlider();
  });
  document.querySelector('.slider-btn_right')?.addEventListener('click', () => {
    if (camIndex >= camTotal - CAM_VISIBLE) return;
    camIndex++;
    moveCamSlider();
  });
}

function moveCamSlider(): void {
  const carousel = document.querySelector(
    '.more-live__carousel',
  ) as HTMLElement | null;
  const viewport = document.querySelector(
    '.more-live__carousel-viewport',
  ) as HTMLElement | null;
  if (!carousel) return;
  const gap = 30;
  const vw = viewport?.offsetWidth ?? carousel.offsetWidth;
  const cardWidth = (vw - gap * (CAM_VISIBLE - 1)) / CAM_VISIBLE;
  carousel.style.transition = 'transform 0.4s ease';
  carousel.style.transform = `translateX(-${camIndex * (cardWidth + gap)}px)`;
  updateCamArrows();
}

function updateCamArrows(): void {
  const btnLeft = document.querySelector(
    '.slider-btn_left',
  ) as HTMLElement | null;
  const btnRight = document.querySelector(
    '.slider-btn_right',
  ) as HTMLElement | null;
  if (btnLeft) btnLeft.style.opacity = camIndex <= 0 ? '0.3' : '1';
  if (btnRight)
    btnRight.style.opacity = camIndex >= camTotal - CAM_VISIBLE ? '0.3' : '1';
}
