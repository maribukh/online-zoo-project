import { initUserProfile } from './auth/userProfile';
import { API } from './api/api';
import type { IPet } from './types';

void initUserProfile();

interface ZooEvent {
  id: string;
  title: string;
  description: string;
  type: 'feeding' | 'enrichment' | 'veterinary' | 'special';
  time: string;
  date: Date;
  animalId: number;
  animalName: string;
  duration: number;
}

interface Highlight {
  id: string;
  title: string;
  description: string;
  date: Date;
  image: string;
  animalId: number;
}

let currentDate = new Date();
let selectedDate = new Date();
let allPets: IPet[] = [];
let allEvents: ZooEvent[] = [];
const reminders: Map<string, number> = new Map();

const animalAssets: Record<
  number,
  { icon: string; image: string; link: string }
> = {
  1: {
    icon: '../../assets/images/map/animals/Panda.svg',
    image: '../../assets/images/pets/panda.webp',
    link: 'panda.html',
  },
  2: {
    icon: '../../assets/images/map/animals/Lemur.svg',
    image: '../../assets/images/pets/lemur.webp',
    link: 'lemur.html',
  },
  3: {
    icon: '../../assets/images/map/animals/Gorilla.svg',
    image: '../../assets/images/pets/gorila.webp',
    link: 'gorilla.html',
  },
  4: {
    icon: '../../assets/images/map/animals/Alligator.svg',
    image: '../../assets/images/pets/aligator.webp',
    link: 'zoo.html?id=4',
  },
  5: {
    icon: '../../assets/images/map/animals/Eagle.svg',
    image: '../../assets/images/pets/eagles.webp',
    link: 'eagle.html',
  },
  6: {
    icon: '../../assets/images/map/animals/Coala.svg',
    image: '../../assets/images/pets/koala.webp',
    link: 'zoo.html?id=6',
  },
  7: {
    icon: '../../assets/images/map/animals/Lion.svg',
    image: '../../assets/images/pets/lion.webp',
    link: 'zoo.html?id=7',
  },
  8: {
    icon: '../../assets/images/map/animals/tiger.svg',
    image: '../../assets/images/pets/tiger.jpg',
    link: 'zoo.html?id=8',
  },
};

const defaultAsset = {
  icon: '../../assets/images/map/animals/Panda.svg',
  image: '../../assets/images/pets/panda.webp',
  link: 'zoo.html',
};

function getAnimalAsset(petId: number) {
  return animalAssets[petId] ?? defaultAsset;
}

function generateEvents(pets: IPet[]): ZooEvent[] {
  const events: ZooEvent[] = [];
  const eventTypes: Array<'feeding' | 'enrichment' | 'veterinary' | 'special'> =
    ['feeding', 'enrichment', 'veterinary', 'special'];

  const descriptions: Record<
    'feeding' | 'enrichment' | 'veterinary' | 'special',
    string[]
  > = {
    feeding: [
      'Morning feeding time with fresh fruits and vegetables',
      'Specialized diet serving with nutritional supplements',
      'Enrichment feeding with puzzle feeders',
      'Afternoon snack time with favorite treats',
    ],
    enrichment: [
      'Interactive play session with new toys',
      'Puzzle solving activities for mental stimulation',
      'Scent enrichment exploration',
      'Social interaction time with caretakers',
    ],
    veterinary: [
      'Routine health checkup and examination',
      'Weight monitoring and assessment',
      'Dental health inspection',
      'Vaccination and preventive care',
    ],
    special: [
      'Birthday celebration with special treats',
      'Meet the Keeper educational talk',
      'Live Q&A session with zookeeper',
      'Behind the scenes tour streaming',
    ],
  };

  for (let dayOffset = -3; dayOffset < 14; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(0, 0, 0, 0);

    pets.slice(0, 8).forEach((pet) => {
      const numEvents = 2 + Math.floor(Math.random() * 3);
      const usedTimes = new Set<number>();

      for (let i = 0; i < numEvents; i++) {
        let hour = 7 + Math.floor(Math.random() * 12);
        while (usedTimes.has(hour)) {
          hour = 7 + Math.floor(Math.random() * 12);
        }
        usedTimes.add(hour);

        const typeIndex =
          i === 0 ? 0 : Math.floor(Math.random() * eventTypes.length);
        const type = eventTypes[typeIndex] as
          | 'feeding'
          | 'enrichment'
          | 'veterinary'
          | 'special';
        const typeDescriptions = descriptions[type];
        const description =
          typeDescriptions[
            Math.floor(Math.random() * typeDescriptions.length)
          ] ?? '';

        const eventDate = new Date(date);
        eventDate.setHours(hour, Math.random() > 0.5 ? 30 : 0);

        events.push({
          id: `event-${pet.id}-${dayOffset}-${i}`,
          title: `${pet.name} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          description,
          type,
          time: formatTime(eventDate),
          date: eventDate,
          animalId: Number(pet.id),
          animalName: pet.name,
          duration: 15 + Math.floor(Math.random() * 30),
        });
      }
    });
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

function getWeekDates(centerDate: Date): Date[] {
  const dates: Date[] = [];
  const startOfWeek = new Date(centerDate);
  startOfWeek.setDate(centerDate.getDate() - centerDate.getDay());

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }

  return dates;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getEventsForDate(date: Date): ZooEvent[] {
  return allEvents.filter((event) => isSameDay(event.date, date));
}

function getEventCountForDate(date: Date): number {
  return getEventsForDate(date).length;
}

function renderCalendarWeek(): void {
  const container = document.getElementById('calendarWeek');
  const weekLabel = document.getElementById('currentWeekLabel');
  if (!container || !weekLabel) return;

  const weekDates = getWeekDates(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  weekLabel.textContent = monthYear;

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  container.innerHTML = weekDates
    .map((date) => {
      const dayIndex = date.getDay();
      const isToday = isSameDay(date, today);
      const isSelected = isSameDay(date, selectedDate);
      const eventCount = getEventCountForDate(date);

      return `
        <div class="day-card${isToday ? ' today' : ''}${isSelected ? ' active' : ''}" 
             data-date="${date.toISOString()}">
          <div class="day-name">${dayNames[dayIndex]}</div>
          <div class="day-number">${date.getDate()}</div>
          <div class="event-count">${eventCount} events</div>
        </div>
      `;
    })
    .join('');

  container.querySelectorAll('.day-card').forEach((card) => {
    card.addEventListener('click', () => {
      const dateStr = (card as HTMLElement).dataset.date;
      if (dateStr) {
        selectedDate = new Date(dateStr);
        renderCalendarWeek();
        renderEvents();
      }
    });
  });
}

function renderEvents(): void {
  const container = document.getElementById('eventsList');
  const noEvents = document.getElementById('noEvents');
  if (!container || !noEvents) return;

  const events = getEventsForDate(selectedDate);

  const activeTypeFilters = getActiveFilters('typeFilters');
  const activeTimeFilters = getActiveFilters('timeFilters');
  const activeAnimalFilters = getActiveFilters('animalFilters');

  const filteredEvents = events.filter((event) => {
    if (
      !activeTypeFilters.includes('all') &&
      !activeTypeFilters.includes(event.type)
    ) {
      return false;
    }

    if (!activeTimeFilters.includes('all')) {
      const hour = event.date.getHours();
      const timeOfDay =
        hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
      if (!activeTimeFilters.includes(timeOfDay)) {
        return false;
      }
    }

    if (
      !activeAnimalFilters.includes('all') &&
      !activeAnimalFilters.includes(String(event.animalId))
    ) {
      return false;
    }

    return true;
  });

  if (filteredEvents.length === 0) {
    container.innerHTML = '';
    noEvents.classList.remove('hidden');
    return;
  }

  noEvents.classList.add('hidden');

  filteredEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

  container.innerHTML = filteredEvents
    .map((event) => {
      const asset = getAnimalAsset(event.animalId);
      const timeParts = event.time.split(' ');
      const timeValue = timeParts[0] ?? '';
      const timePeriod = timeParts[1] ?? '';
      const hasReminder = reminders.has(event.id);

      return `
        <div class="event-card event-card--${event.type}" data-event-id="${event.id}">
          <div class="event-time">
            <span class="event-time-value">${timeValue}</span>
            <span class="event-time-period">${timePeriod}</span>
          </div>
          <div class="event-details">
            <div class="event-header">
              <img src="${asset.icon}" alt="${event.animalName}" class="event-animal-icon" 
                   onerror="this.src='${defaultAsset.icon}'">
              <div class="event-info">
                <h4>${event.title}</h4>
                <span class="event-animal-name">${event.animalName}</span>
              </div>
              <span class="event-type-badge event-type-badge--${event.type}">${event.type}</span>
            </div>
            <p class="event-description">${event.description}</p>
            <div class="event-actions">
              <a href="../zoos/${asset.link}" class="btn-watch">
                Watch Live
                <img src="../../assets/icons/play-button.svg" alt="">
              </a>
              <button class="btn-remind${hasReminder ? ' active' : ''}" data-event-id="${event.id}">
                ${hasReminder ? 'Reminder Set' : 'Set Reminder'}
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  container.querySelectorAll('.btn-remind').forEach((btn) => {
    btn.addEventListener('click', () => {
      const eventId = (btn as HTMLElement).dataset.eventId;
      if (eventId) {
        openReminderModal(eventId);
      }
    });
  });
}

function getActiveFilters(containerId: string): string[] {
  const container = document.getElementById(containerId);
  if (!container) return ['all'];

  const checked = container.querySelectorAll('input:checked');
  const values = Array.from(checked).map(
    (input) => (input as HTMLInputElement).value,
  );

  return values.length > 0 ? values : ['all'];
}

function renderAnimalFilters(): void {
  const container = document.getElementById('animalFilters');
  if (!container) return;

  const uniqueAnimals = allPets.slice(0, 8);

  container.innerHTML = `
    <label class="filter-option">
      <input type="checkbox" value="all" checked />
      <span class="checkbox-custom"></span>
      <span>All Animals</span>
    </label>
    ${uniqueAnimals
      .map(
        (pet) => `
      <label class="filter-option">
        <input type="checkbox" value="${pet.id}" />
        <span class="checkbox-custom"></span>
        <span>${pet.name}</span>
      </label>
    `,
      )
      .join('')}
  `;

  setupFilterListeners(container);
}

function setupFilterListeners(container: HTMLElement): void {
  const allCheckbox = container.querySelector(
    'input[value="all"]',
  ) as HTMLInputElement;
  const otherCheckboxes = container.querySelectorAll(
    'input:not([value="all"])',
  ) as NodeListOf<HTMLInputElement>;

  allCheckbox?.addEventListener('change', () => {
    if (allCheckbox.checked) {
      otherCheckboxes.forEach((cb) => (cb.checked = false));
    }
    renderEvents();
  });

  otherCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const anyChecked = Array.from(otherCheckboxes).some((c) => c.checked);
      if (allCheckbox) {
        allCheckbox.checked = !anyChecked;
      }
      renderEvents();
    });
  });
}

function renderHighlights(): void {
  const container = document.getElementById('highlightsGrid');
  if (!container) return;

  const now = new Date();
  const specialEvents = allEvents
    .filter(
      (event) =>
        event.type === 'special' && event.date.getTime() > now.getTime(),
    )
    .slice(0, 3);

  if (specialEvents.length === 0) {
    const highlights: Highlight[] = [
      {
        id: 'h1',
        title: 'Panda Birthday Celebration',
        description:
          'Join us to celebrate Lucas the Pandas 5th birthday with special treats and activities!',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        image: '../../assets/images/pets/panda.webp',
        animalId: 1,
      },
      {
        id: 'h2',
        title: 'Meet the Zookeeper',
        description:
          'Live Q&A session with our eagle caretakers. Learn about eagle conservation efforts!',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        image: '../../assets/images/pets/eagles.webp',
        animalId: 5,
      },
      {
        id: 'h3',
        title: 'Gorilla Family Day',
        description:
          'Watch our gorilla family interact and enjoy enrichment activities together.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        image: '../../assets/images/pets/gorila.webp',
        animalId: 3,
      },
    ];

    container.innerHTML = highlights
      .map((highlight) => {
        const asset = getAnimalAsset(highlight.animalId);
        return `
          <div class="highlight-card">
            <img src="${highlight.image}" alt="${highlight.title}" class="highlight-image"
                 onerror="this.src='${defaultAsset.image}'">
            <div class="highlight-content">
              <span class="highlight-date">${formatDate(highlight.date)}</span>
              <h3 class="highlight-title">${highlight.title}</h3>
              <p class="highlight-description">${highlight.description}</p>
              <a href="../zoos/${asset.link}" class="highlight-cta">
                Learn More <img src="../../assets/icons/union-blue-right.svg" alt="">
              </a>
            </div>
          </div>
        `;
      })
      .join('');
  } else {
    container.innerHTML = specialEvents
      .map((event) => {
        const asset = getAnimalAsset(event.animalId);
        return `
          <div class="highlight-card">
            <img src="${asset.image}" alt="${event.title}" class="highlight-image"
                 onerror="this.src='${defaultAsset.image}'">
            <div class="highlight-content">
              <span class="highlight-date">${formatDate(event.date)}</span>
              <h3 class="highlight-title">${event.title}</h3>
              <p class="highlight-description">${event.description}</p>
              <a href="../zoos/${asset.link}" class="highlight-cta">
                Learn More <img src="../../assets/icons/union-blue-right.svg" alt="">
              </a>
            </div>
          </div>
        `;
      })
      .join('');
  }
}

let currentReminderEventId: string | null = null;

function openReminderModal(eventId: string): void {
  const modal = document.getElementById('reminderModal');
  const eventInfo = document.getElementById('reminderEventInfo');
  if (!modal || !eventInfo) return;

  const event = allEvents.find((e) => e.id === eventId);
  if (!event) return;

  currentReminderEventId = eventId;

  eventInfo.innerHTML = `
    <h4>${event.title}</h4>
    <p>${formatDate(event.date)} at ${event.time}</p>
  `;

  modal.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeReminderModal(): void {
  const modal = document.getElementById('reminderModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  }
  currentReminderEventId = null;
}

function setReminder(): void {
  if (!currentReminderEventId) return;

  const selectedTime = document.querySelector(
    'input[name="reminderTime"]:checked',
  ) as HTMLInputElement;
  const minutes = selectedTime ? parseInt(selectedTime.value, 10) : 15;

  reminders.set(currentReminderEventId, minutes);

  showToast(`Reminder set for ${minutes} minutes before the event!`);

  closeReminderModal();
  renderEvents();
}

function showToast(message: string): void {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function navigateWeek(direction: number): void {
  currentDate.setDate(currentDate.getDate() + direction * 7);
  renderCalendarWeek();
}

function goToToday(): void {
  currentDate = new Date();
  selectedDate = new Date();
  renderCalendarWeek();
  renderEvents();
}

async function init(): Promise<void> {
  const loader = document.getElementById('eventsLoader');

  try {
    loader?.classList.remove('hidden');

    const petsRes = await API.getPets();
    allPets = petsRes.data;

    allEvents = generateEvents(allPets);

    loader?.classList.add('hidden');

    renderAnimalFilters();
    renderCalendarWeek();
    renderEvents();
    renderHighlights();

    const typeFilters = document.getElementById('typeFilters');
    const timeFilters = document.getElementById('timeFilters');
    if (typeFilters) setupFilterListeners(typeFilters);
    if (timeFilters) setupFilterListeners(timeFilters);

    document
      .getElementById('prevWeek')
      ?.addEventListener('click', () => navigateWeek(-1));
    document
      .getElementById('nextWeek')
      ?.addEventListener('click', () => navigateWeek(1));
    document.getElementById('todayBtn')?.addEventListener('click', goToToday);

    document
      .getElementById('closeReminderModal')
      ?.addEventListener('click', closeReminderModal);
    document
      .getElementById('cancelReminder')
      ?.addEventListener('click', closeReminderModal);
    document
      .getElementById('setReminder')
      ?.addEventListener('click', setReminder);

    document.getElementById('reminderModal')?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
        closeReminderModal();
      }
    });

    const burgerBtn = document.getElementById('burgerBtn');
    const headerMenu = document.getElementById('headerMenu');
    const closeBurger = document.getElementById('closeBurger');

    burgerBtn?.addEventListener('click', () => {
      headerMenu?.classList.add('active');
    });

    closeBurger?.addEventListener('click', () => {
      headerMenu?.classList.remove('active');
    });
  } catch {
    loader?.classList.add('hidden');
    const errorEl = document.getElementById('eventsError');
    if (errorEl) {
      errorEl.textContent = 'Failed to load events. Please refresh the page.';
      errorEl.classList.remove('hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  void init();
});
