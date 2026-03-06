import  type { IPet } from './types';
import { API } from './api/api';

document.addEventListener('DOMContentLoaded', async () => {
  const petsGrid = document.getElementById(
    'pets-grid',
  ) as HTMLDivElement | null;
  const loader = document.querySelector('.loader') as HTMLElement | null;

  if (petsGrid) {
    try {
      loader?.classList.remove('hidden');

      const pets: IPet[] = await API.getPets();

      renderPets(pets, petsGrid);
    } catch (error) {
      petsGrid.innerHTML =
        '<p class="error-text">Something went wrong. Please, refresh the page</p>';
    } finally {
      loader?.classList.add('hidden');
    }
  }
});

function renderPets(pets: IPet[], container: HTMLElement): void {
  container.innerHTML = '';

  pets.forEach((pet: IPet) => {
    const card = document.createElement('div');
    card.className = 'pet-card';

    card.innerHTML = `
        <img src="${pet.image}" alt="${pet.name}">
        <h3>${pet.name}</h3>
        <p>${pet.description}</p>
        `;

    container.appendChild(card);
  });
}
