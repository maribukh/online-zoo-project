const API = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';

interface UserProfile {
  login: string;
  name?: string;
  email?: string;
}

interface ApiResponse {
  data?: UserProfile;
  token?: string;
}

function getToken(): string | null {
  return localStorage.getItem('zoo_token');
}

function getStoredUser(): UserProfile | null {
  const raw = localStorage.getItem('zoo_user');
  try {
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

function logout(): void {
  localStorage.removeItem('zoo_token');
  localStorage.removeItem('zoo_user');
  window.location.reload();
}

function buildDropdown(user: UserProfile): string {
  return `
    <div class="user-profile__dropdown" id="profileDropdown">
      <div class="user-profile__dropdown-header">
        <div class="user-profile__dropdown-login">${user.name ?? user.login}</div>
        <div class="user-profile__dropdown-email">@${user.login}</div>
      </div>
      <button class="user-profile__dropdown-item user-profile__dropdown-item--logout" id="logoutBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sign Out
      </button>
    </div>`;
}

function renderLoggedIn(container: HTMLElement, user: UserProfile): void {
  container.innerHTML = `
    <span class="user-profile__name">${user.name ?? user.login}</span>
    <button class="user-profile__avatar" id="profileAvatarBtn" aria-label="Profile menu">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    </button>
    ${buildDropdown(user)}
  `;

  const btn = container.querySelector<HTMLButtonElement>('#profileAvatarBtn');
  const dropdown = container.querySelector<HTMLElement>('#profileDropdown');

  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown?.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    dropdown?.classList.remove('open');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dropdown?.classList.remove('open');
  });

  container
    .querySelector<HTMLButtonElement>('#logoutBtn')
    ?.addEventListener('click', logout);
}

function renderLoggedOut(authContainer: HTMLElement | null): void {
  if (authContainer) authContainer.style.display = 'flex';
}

async function fetchProfile(token: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${API}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ApiResponse;
    const user: UserProfile = data.data ?? (data as unknown as UserProfile);
    localStorage.setItem('zoo_user', JSON.stringify(user));
    return user.login ? user : null;
  } catch {
    return null;
  }
}

export async function initUserProfile(): Promise<void> {
  const profileContainer = document.getElementById('userProfile');
  const authContainer = document.querySelector<HTMLElement>('.header-auth');

  if (!profileContainer) return;

  const token = getToken();

  if (!token) {
    renderLoggedOut(authContainer);
    return;
  }

  if (authContainer) authContainer.style.display = 'none';

  const user = getStoredUser();
  if (user) {
    renderLoggedIn(profileContainer, user);
  }

  const fresh = await fetchProfile(token);
  if (fresh) {
    renderLoggedIn(profileContainer, fresh);
  } else if (!user) {
    logout();
  }
}
