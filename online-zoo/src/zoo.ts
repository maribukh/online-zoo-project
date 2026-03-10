import type {
  IPet,
  IPetDetail,
  CameraItem,
  PetAsset,
  LeafletStatic,
} from './types';
import { API } from './api/api';

const DEFAULT_ICON = '/assets/images/map/animals/Panda.svg';
const DEFAULT_ICON_ORANGE = '/assets/icons/zoos/Panda-orange.svg';
const DEFAULT_IMG = '/assets/images/pets/panda.webp';
const DEFAULT_VIDEO = '/assets/images/panda-live.jpg';
const DEFAULT_CAM = '/assets/images/cam/cam-views.jpg';
const CAM_VISIBLE = 3;
const SIDEBAR_VISIBLE = 4;

const petAssets: Record<number, PetAsset> = {
  1: {
    img: '/assets/images/pets/panda.webp',
    icon: '/assets/images/map/animals/Panda.svg',
    iconOrange: '/assets/icons/zoos/Panda-orange.svg',
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
    iconOrange: '/assets/icons/zoos/Lemur-orange.svg',
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
    iconOrange: '/assets/icons/zoos/Gorilla-orange.svg',
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
    icon: '/assets/images/map/animals/Alligator.svg',
    iconOrange: '/assets/icons/zoos/Panda-orange.svg',
    link: 'zoo.html?id=4',
    mainVideo: '/assets/images/cam/alligator-live.jpg',
    cams: [
      '/assets/images/cam/alligator-live.jpg',
      '/assets/images/cam/alligator-live2.jpg',
      '/assets/images/cam/alligator-live3.jpg',
    ],
  },
  5: {
    img: '/assets/images/pets/eagles.webp',
    icon: '/assets/images/map/animals/Eagle.svg',
    iconOrange: '/assets/icons/zoos/Eagle-orange.svg',
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
    icon: '/assets/images/map/animals/Coala.svg',
    iconOrange: '/assets/icons/zoos/Panda-orange.svg',
    link: 'zoo.html?id=6',
    mainVideo: '/assets/images/cam/koala-live.jpg',
    cams: [
      '/assets/images/cam/koala-live.jpg',
      '/assets/images/cam/koala-live2.jpg',
      '/assets/images/cam/koala-live3.jpg',
    ],
  },
  7: {
    img: '/assets/images/pets/lion.webp',
    icon: '/assets/images/map/animals/Lion.svg',
    iconOrange: '/assets/icons/zoos/Panda-orange.svg',
    link: 'zoo.html?id=7',
    mainVideo: '/assets/images/cam/lion-live.jpg',
    cams: [
      '/assets/images/cam/lion-live.jpg',
      '/assets/images/cam/lion-live2.jpg',
      '/assets/images/cam/lion-live3.jpg',
    ],
  },
  8: {
    img: '/assets/images/pets/tiger.jpg',
    icon: '/assets/images/map/animals/tiger.svg',
    iconOrange: '/assets/icons/zoos/Panda-orange.svg',
    link: 'zoo.html?id=8',
    mainVideo: '/assets/images/cam/tiger-live.jpg',
    cams: [
      '/assets/images/cam/tiger-live.jpg',
      '/assets/images/cam/tiger-live2.jpg',
      '/assets/images/cam/tiger-view3.jpg',
    ],
  },
};

function getAsset(petId: number): PetAsset {
  return (
    petAssets[petId] ?? {
      img: DEFAULT_IMG,
      icon: DEFAULT_ICON,
      iconOrange: DEFAULT_ICON_ORANGE,
      link: `zoo.html?id=${petId}`,
      mainVideo: DEFAULT_VIDEO,
      cams: [DEFAULT_CAM, DEFAULT_CAM, DEFAULT_CAM],
    }
  );
}

let camIndex = 0;
let camTotal = 0;
let sidebarOffset = 0;
let allPets: IPet[] = [];
let allCams: CameraItem[] = [];
let mapModal: HTMLElement | null = null;
let camItems: Array<{ text: string; img: string }> = [];

function getUrlPetId(): number | null {
  const raw = new URLSearchParams(window.location.search).get('id');
  return raw !== null ? parseInt(raw, 10) : null;
}

document.addEventListener('DOMContentLoaded', () => {
  void init();
});

async function init(): Promise<void> {
  const sideLoader = document.getElementById('side-loader');
  const sideError = document.getElementById('side-error');
  const panelLarge = document.getElementById('panelLarge');

  document.querySelector('.toggle-open')?.addEventListener('click', () => {
    panelLarge?.classList.add('active');
  });
  document.querySelector('.toggle-close')?.addEventListener('click', () => {
    panelLarge?.classList.remove('active');
  });

  initMapModal();
  attachCamArrowListeners();

  sideLoader?.classList.remove('hidden');

  try {
    const [petsRes, cams] = await Promise.all([API.getPets(), fetchCameras()]);
    allPets = petsRes.data;
    allCams = cams.map((c) => ({ ...c, petId: Number(c.petId) }));

    renderSidebar('small');
    renderSidebar('large');

    const urlId = getUrlPetId();
    const targetPet =
      (urlId !== null
        ? allPets.find((p) => Number(p.id) === urlId)
        : undefined) ?? allPets[0];

    if (targetPet !== undefined) {
      const idx = allPets.findIndex(
        (p) => Number(p.id) === Number(targetPet.id),
      );
      if (idx >= SIDEBAR_VISIBLE) {
        sidebarOffset = idx - SIDEBAR_VISIBLE + 1;
        applySidebarScroll();
      }
      await selectAnimal(targetPet);
    }
  } catch {
    sideLoader?.classList.add('hidden');
    if (sideError !== null) {
      sideError.textContent = 'Something went wrong. Please, refresh the page';
      sideError.classList.remove('hidden');
    }
    showFactsError('Something went wrong. Please, refresh the page');
    return;
  }
  sideLoader?.classList.add('hidden');
}

async function fetchCameras(): Promise<CameraItem[]> {
  const res = await fetch(
    'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/cameras',
  );
  if (!res.ok) throw new Error(`Cameras ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data ?? []);
}

async function fetchPetDetail(id: number): Promise<IPetDetail> {
  const res = await fetch(
    `https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets/${id}`,
  );
  if (!res.ok) throw new Error(`Pet ${id}: ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

async function selectAnimal(pet: IPet): Promise<void> {
  const petId = Number(pet.id);
  ['sidebar-list-small', 'sidebar-list-large'].forEach((listId) => {
    document
      .getElementById(listId)
      ?.querySelectorAll('.animal-item')
      .forEach((el) => {
        el.classList.toggle(
          'active',
          Number((el as HTMLElement).dataset['petId']) === petId,
        );
      });
  });

  const url = new URL(window.location.href);
  url.searchParams.set('id', String(petId));
  window.history.replaceState(null, '', url.toString());

  updateMainVideo(petId, pet.name);
  buildCamSlider(
    allCams.filter((c) => c.petId === petId),
    petId,
  );

  showDetailLoader(true);
  clearFactsError();
  try {
    const detail = await fetchPetDetail(petId);
    updateDidYouKnow(detail, petId);
  } catch {
    showFactsError('Something went wrong. Please, refresh the page');
  } finally {
    showDetailLoader(false);
  }
}

function updateMainVideo(petId: number, petName: string): void {
  const asset = getAsset(petId);
  const mainImg = document.querySelector(
    '#main-video-img',
  ) as HTMLImageElement | null;
  if (mainImg) {
    mainImg.src = asset.mainVideo;
    mainImg.alt = petName;
  }
  const titleEl = document.querySelector('.video-title-overlay');
  if (titleEl) titleEl.textContent = `${petName}, cam 1`;
  const zooTitle = document.querySelector('.zoos-title');
  if (zooTitle) zooTitle.textContent = `LIVE ${petName.toUpperCase()} CAMS`;
  document.title = `Online-zoo — ${petName}`;
}

function updateDidYouKnow(detail: IPetDetail, petId: number): void {
  const asset = getAsset(petId);
  const intro = document.getElementById('did-you-know-content');
  if (intro) intro.textContent = detail.description;
  const factImg = document.getElementById(
    'fact-image',
  ) as HTMLImageElement | null;
  if (factImg) {
    factImg.src = asset.img;
    factImg.alt = detail.commonName;
  }
  const list = document.getElementById('facts-list');
  if (list) {
    const rows = [
      ['Common name', detail.commonName],
      ['Scientific name', detail.scientificName],
      ['Type', detail.type],
      ['Size', detail.size],
      ['Diet', detail.diet],
      ['Habitat', detail.habitat],
      ['Range', detail.range],
    ];
    list.innerHTML = rows
      .map(([label, value], i) => {
        const isLast = i === rows.length - 1;
        return `<li${isLast ? ' class="position"' : ''}>
        <strong>${label}:</strong> ${value}
        ${isLast ? `<button class="view-map-link btn view-map-btn">VIEW MAP <img src="/assets/icons/union-orange.svg" alt=""></button>` : ''}
      </li>`;
      })
      .join('');
    list
      .querySelector('.view-map-btn')
      ?.addEventListener('click', () => openMapModal(detail));
  }
  const desc = document.getElementById('pet-full-desc');
  if (desc) desc.textContent = detail.detailedDescription;
}

function showDetailLoader(show: boolean): void {
  const loader = document.getElementById('detail-loader');
  const facts = document.querySelector('.facts') as HTMLElement | null;
  loader?.classList.toggle('hidden', !show);
  if (facts) facts.style.opacity = show ? '0.4' : '1';
}

function showFactsError(msg: string): void {
  const list = document.getElementById('facts-list');
  const intro = document.getElementById('did-you-know-content');
  if (list) list.innerHTML = `<li class="facts-error">${msg}</li>`;
  if (intro) intro.textContent = msg;
}

function clearFactsError(): void {
  const list = document.getElementById('facts-list');
  if (list) list.innerHTML = '';
}

function renderSidebar(panel: 'small' | 'large'): void {
  const listId =
    panel === 'small' ? 'sidebar-list-small' : 'sidebar-list-large';
  const container = document.getElementById(listId) as HTMLUListElement | null;
  if (!container) return;
  container.innerHTML = '';
  allPets.forEach((pet, i) => {
    const petId = Number(pet.id);
    const asset = getAsset(petId);
    const li = document.createElement('li');
    li.className = `animal-item${i >= SIDEBAR_VISIBLE ? ' sidebar-hidden' : ''}`;
    li.dataset['petId'] = String(petId);
    if (panel === 'small') {
      li.innerHTML = `<a href="#" class="animal-icon-link"><div class="icon-circle"><img src="${asset.icon}" alt="${pet.name}"></div></a>`;
    } else {
      li.innerHTML = `<div class="animal-content"><a href="#" class="animal-icon-link"><img class="icon-default" src="${asset.iconOrange}"><img class="icon-active" src="${asset.icon}"></a><div class="animal-desc"><p>${pet.description}</p></div></div>`;
    }
    li.addEventListener('click', (e) => {
      e.preventDefault();
      void selectAnimal(pet);
    });
    container.appendChild(li);
  });
}

function applySidebarScroll(): void {
  ['small', 'large'].forEach((p) => {
    const listId = p === 'small' ? 'sidebar-list-small' : 'sidebar-list-large';
    document
      .getElementById(listId)
      ?.querySelectorAll('.animal-item')
      .forEach((item, i) => {
        item.classList.toggle(
          'sidebar-hidden',
          i < sidebarOffset || i >= sidebarOffset + SIDEBAR_VISIBLE,
        );
      });
  });
}

function scrollSidebar(panel: 'small' | 'large'): void {
  sidebarOffset = Math.min(sidebarOffset + 1, allPets.length - SIDEBAR_VISIBLE);
  applySidebarScroll();
}

function buildCamSlider(cams: CameraItem[], petId: number): void {
  const carousel = document.querySelector(
    '.more-live__carousel',
  ) as HTMLElement | null;
  if (!carousel) return;
  carousel.style.transition = 'none';
  carousel.style.transform = 'translateX(0)';
  void carousel.offsetWidth;
  camIndex = 0;
  camSliderReady = false;

  const asset = getAsset(petId);
  const baseCams = asset.cams;

  const items: Array<{ text: string; img: string }> =
    cams.length > 0
      ? cams.map((cam, i) => ({
          text: cam.text,
          img: asset.cams[i % asset.cams.length] ?? DEFAULT_CAM,
        }))
      : baseCams.map((img, i) => ({ text: `Cam ${i + 1}`, img }));

  while (items.length < CAM_VISIBLE) {
    items.push({
      text: `Cam ${items.length + 1}`,
      img: baseCams[items.length % baseCams.length] ?? DEFAULT_CAM,
    });
  }

  camTotal = items.length;
  camSliderReady = true;

  carousel.innerHTML = items
    .map(
      (item, i) => `
    <div class="live-card${i === 0 ? ' live-card_active' : ''}" data-index="${i}">
      <img src="${item.img}" class="live-card__img" onerror="this.src='${DEFAULT_CAM}'">
      <div class="live-card__badge">CAM ${i + 1} <img src="/assets/icons/cam.svg"></div>
      <button class="live-card__play"><img src="/assets/icons/play-button.svg"></button>
    </div>`,
    )
    .join('');
  carousel.querySelectorAll('.live-card').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = Number((card as HTMLElement).dataset['index']);
      const mainImg = document.querySelector(
        '#main-video-img',
      ) as HTMLImageElement | null;
      if (mainImg !== null) mainImg.src = items[idx]?.img ?? DEFAULT_CAM;
      carousel.querySelectorAll('.live-card').forEach((c) => {
        c.classList.remove('live-card_active');
      });
      card.classList.add('live-card_active');
    });
  });
  updateCamArrows();
}

function attachCamArrowListeners(): void {
  document.querySelector('.slider-btn_left')?.addEventListener('click', () => {
    if (!camSliderReady || camIndex <= 0) return;
    camIndex--;
    moveCamSlider();
  });
  document.querySelector('.slider-btn_right')?.addEventListener('click', () => {
    if (!camSliderReady || camIndex >= Math.max(0, camTotal - CAM_VISIBLE))
      return;
    camIndex++;
    moveCamSlider();
  });
}

function moveCamSlider(): void {
  const carousel = document.querySelector(
    '.more-live__carousel',
  ) as HTMLElement | null;
  const card = carousel?.querySelector('.live-card') as HTMLElement | null;
  if (carousel && card) {
    const gap = 30;
    carousel.style.transition = 'transform 0.4s ease';
    carousel.style.transform = `translateX(-${camIndex * (card.offsetWidth + gap)}px)`;
    updateCamArrows();
  }
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

function initMapModal(): void {
  mapModal = document.createElement('div');
  mapModal.id = 'mapModal';
  mapModal.className = 'map-modal-overlay hidden';
  mapModal.innerHTML = `<div class="map-modal-window"><button class="map-modal-close" id="mapModalClose"><img src="/assets/icons/x-mark.svg"></button><div id="leaflet-map" class="leaflet-map-container"></div></div>`;
  document.body.appendChild(mapModal);
  document
    .getElementById('mapModalClose')
    ?.addEventListener('click', closeMapModal);
}

function openMapModal(detail: IPetDetail): void {
  if (!mapModal) return;
  mapModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const L = (window as any).L;
    if (!L) return;
    const map = L.map('leaflet-map').setView(
      [parseFloat(detail.latitude), parseFloat(detail.longitude)],
      5,
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      map,
    );
    L.marker([parseFloat(detail.latitude), parseFloat(detail.longitude)])
      .addTo(map)
      .bindPopup(detail.commonName)
      .openPopup();
  }, 100);
}

function closeMapModal(): void {
  if (mapModal) mapModal.classList.add('hidden');
  document.body.style.overflow = '';
}
