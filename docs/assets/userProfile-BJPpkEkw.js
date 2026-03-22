const a="https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod";function d(){return localStorage.getItem("zoo_token")}function c(){const e=localStorage.getItem("zoo_user");try{return e?JSON.parse(e):null}catch{return null}}function s(){localStorage.removeItem("zoo_token"),localStorage.removeItem("zoo_user"),window.location.reload()}function i(e,t){e.innerHTML=`
    <button class="user-profile__btn" id="profileAvatarBtn" aria-label="Profile menu">
      <div class="user-profile__avatar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#f58021">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </div>
      <span class="user-profile__name">${t.name??t.login}</span>
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
          <div class="user-profile__dropdown-name">${t.name??t.login}</div>
          <div class="user-profile__dropdown-login">@${t.login}</div>
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
  `;const n=e.querySelector("#profileAvatarBtn");e.querySelector("#profileDropdown");const o=e.querySelector(".user-profile__chevron");n?.addEventListener("click",r=>{r.stopPropagation();const l=e.classList.toggle("open");o&&(o.style.transform=l?"rotate(180deg)":"")}),document.addEventListener("click",r=>{e.contains(r.target)||(e.classList.remove("open"),o&&(o.style.transform=""))}),document.addEventListener("keydown",r=>{r.key==="Escape"&&(e.classList.remove("open"),o&&(o.style.transform=""))}),e.querySelector("#logoutBtn")?.addEventListener("click",s)}function u(e){e&&(e.style.display="flex")}async function f(e){try{const t=await fetch(`${a}/auth/profile`,{headers:{Authorization:`Bearer ${e}`}});if(!t.ok)return null;const n=await t.json(),o=n.data??n;return localStorage.setItem("zoo_user",JSON.stringify(o)),o.login?o:null}catch{return null}}async function p(){const e=document.getElementById("userProfile"),t=document.querySelector(".header-auth");if(!e)return;const n=d();if(!n){u(t);return}t&&(t.style.display="none");const o=c();o&&i(e,o);const r=await f(n);r?i(e,r):o||s()}export{p as i};
