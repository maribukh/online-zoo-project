const API = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';
function getToken() {
    return localStorage.getItem('zoo_token');
}
function getStoredUser() {
    const raw = localStorage.getItem('zoo_user');
    try {
        return raw ? JSON.parse(raw) : null;
    }
    catch {
        return null;
    }
}
function logout() {
    localStorage.removeItem('zoo_token');
    localStorage.removeItem('zoo_user');
    window.location.reload();
}
function renderLoggedIn(container, user) {
    container.innerHTML = `
    <button class="user-profile__btn" id="profileAvatarBtn" aria-label="Profile menu">
      <div class="user-profile__avatar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#f58021">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </div>
      <span class="user-profile__name">${user.name ?? user.login}</span>
      <svg class="user-profile__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>
    <div class="user-profile__dropdown" id="profileDropdown">
      <div class="user-profile__dropdown-header">
        <div class="user-profile__dropdown-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
        <div class="user-profile__dropdown-info">
          <div class="user-profile__dropdown-name">${user.name ?? user.login}</div>
          <div class="user-profile__dropdown-login">@${user.login}</div>
        </div>
      </div>
      <div class="user-profile__dropdown-body">
        <button class="user-profile__dropdown-item user-profile__dropdown-item--logout" id="logoutBtn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>
    </div>
  `;
    const btn = container.querySelector('#profileAvatarBtn');
    const dropdown = container.querySelector('#profileDropdown');
    const chevron = container.querySelector('.user-profile__chevron');
    btn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = container.classList.toggle('open');
        if (chevron)
            chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
    });
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            container.classList.remove('open');
            if (chevron)
                chevron.style.transform = '';
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            container.classList.remove('open');
            if (chevron)
                chevron.style.transform = '';
        }
    });
    container
        .querySelector('#logoutBtn')
        ?.addEventListener('click', logout);
}
function renderLoggedOut(authContainer) {
    if (authContainer)
        authContainer.style.display = 'flex';
}
async function fetchProfile(token) {
    try {
        const res = await fetch(`${API}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok)
            return null;
        const data = (await res.json());
        const user = data.data ?? data;
        localStorage.setItem('zoo_user', JSON.stringify(user));
        return user.login ? user : null;
    }
    catch {
        return null;
    }
}
export async function initUserProfile() {
    const profileContainer = document.getElementById('userProfile');
    const authContainer = document.querySelector('.header-auth');
    if (!profileContainer)
        return;
    const token = getToken();
    if (!token) {
        renderLoggedOut(authContainer);
        return;
    }
    if (authContainer)
        authContainer.style.display = 'none';
    const user = getStoredUser();
    if (user)
        renderLoggedIn(profileContainer, user);
    const fresh = await fetchProfile(token);
    if (fresh) {
        renderLoggedIn(profileContainer, fresh);
    }
    else if (!user) {
        logout();
    }
}
//# sourceMappingURL=userProfile.js.map