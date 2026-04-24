import type { IDonation, IPet } from './types';

const API_BASE =
  'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';

interface SavedCard {
  cardNum: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

interface StoredUser {
  name?: string;
  email?: string;
}

interface PetsResponse {
  data: IPet[];
}

function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem('zoo_user');
  try {
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

function isLoggedIn(): boolean {
  return !!localStorage.getItem('zoo_token');
}

function getSavedCards(): SavedCard[] {
  const raw = localStorage.getItem('zoo_saved_cards');
  try {
    return raw ? (JSON.parse(raw) as SavedCard[]) : [];
  } catch {
    return [];
  }
}

function saveCard(card: SavedCard): void {
  const cards = getSavedCards();
  if (!cards.find((c) => c.cardNum === card.cardNum)) {
    cards.push(card);
    localStorage.setItem('zoo_saved_cards', JSON.stringify(cards));
  }
}

function maskCard(num: string): string {
  return num.slice(0, 4) + ' **** **** ' + num.slice(12);
}

function showNotification(message: string, isError = false): void {
  document.getElementById('donationNotification')?.remove();
  const el = document.createElement('div');
  el.id = 'donationNotification';
  el.style.cssText = `
    position:fixed; bottom:30px; left:50%; transform:translateX(-50%);
    background:${isError ? '#e53935' : '#00a092'};
    color:#fff; padding:16px 32px; border-radius:8px;
    font-size:15px; font-weight:600; z-index:10000;
    box-shadow:0 4px 20px rgba(0,0,0,0.2); text-align:center; max-width:500px;
  `;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

export function initDonation(): void {
  const stepModal = document.getElementById('stepModal');
  const donationModal = document.getElementById('donationModal');
  if (!stepModal) return;

  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const toStep2Btn = document.getElementById(
    'toStep2',
  ) as HTMLButtonElement | null;
  const toStep3Btn = document.getElementById(
    'toStep3',
  ) as HTMLButtonElement | null;
  const completeBtn = document.getElementById(
    'completeBtn',
  ) as HTMLButtonElement | null;
  const nameInput = document.getElementById(
    'bill-name',
  ) as HTMLInputElement | null;
  const emailInput = document.getElementById(
    'bill-email',
  ) as HTMLInputElement | null;
  const cardInput = document.getElementById(
    'card-num',
  ) as HTMLInputElement | null;
  const cvvInput = document.getElementById('cvv') as HTMLInputElement | null;
  const selectCurrent = document.querySelector<HTMLElement>(
    '#step1 .select-current',
  );
  const selectList = document.getElementById('selectList');
  const selectBox = document.getElementById('selectBox');
  const otherInput = document.querySelector<HTMLInputElement>('.other-input');
  const amountBtns =
    document.querySelectorAll<HTMLButtonElement>('#step1 .amount-btn');

  let selectedAmount = 0;
  let selectedPetId = 0;
  let selectedPetName = '';
  let selectedMonth = '';
  let selectedYear = '';

  if (toStep2Btn) toStep2Btn.disabled = true;
  if (toStep3Btn) toStep3Btn.disabled = true;
  if (completeBtn) completeBtn.disabled = true;

  function openStepModal(amount?: number): void {
    donationModal?.classList.remove('open');
    stepModal?.classList.add('open');
    document.body.classList.add('modal-open');
    if (amount && amount > 0) {
      selectedAmount = amount;
      amountBtns.forEach((b) => {
        const btnAmount = parseInt(b.textContent?.replace('$', '') ?? '0', 10);
        b.classList.toggle('active', btnAmount === amount);
      });
      const matchedBtn = Array.from(amountBtns).find(
        (b) => parseInt(b.textContent?.replace('$', '') ?? '0', 10) === amount,
      );
      if (!matchedBtn && otherInput) {
        amountBtns.forEach((b) => b.classList.remove('active'));
        otherInput.value = String(amount);
      }
      checkStep1Valid();
    }
  }

  donationModal
    ?.querySelectorAll<HTMLButtonElement>('.donate-btn:not(.donate-btn_other)')
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        const amount = parseInt(btn.textContent?.replace('$', '') ?? '0', 10);
        openStepModal(amount);
      });
    });

  donationModal
    ?.querySelector('.donate-btn_other')
    ?.addEventListener('click', () => {
      openStepModal();
    });

  async function loadPetsIntoDropdown(): Promise<void> {
    if (!selectList) return;
    try {
      const res = await fetch(`${API_BASE}/pets`);
      const json = (await res.json()) as PetsResponse;
      selectList.innerHTML = '';
      json.data.forEach((pet) => {
        const li = document.createElement('li');
        li.className = 'select-item';
        li.textContent = pet.name;
        li.addEventListener('click', () => {
          selectedPetId = Number(pet.id);
          selectedPetName = pet.name;
          if (selectCurrent) {
            selectCurrent.textContent = pet.name;
            selectCurrent.style.color = '#000';
          }
          selectList.classList.add('select-hide');
          selectBox
            ?.closest('.custom-select-container')
            ?.classList.remove('active');
          checkStep1Valid();
        });
        selectList.appendChild(li);
      });
    } catch {
      console.error('Failed to load pets for donation dropdown');
    }
  }

  void loadPetsIntoDropdown();

  function checkStep1Valid(): void {
    if (toStep2Btn)
      toStep2Btn.disabled = !(selectedAmount > 0 && selectedPetId > 0);
  }

  amountBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      amountBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (otherInput) otherInput.value = '';
      otherInput?.parentElement?.classList.remove('error');
      selectedAmount = parseInt(btn.textContent?.replace('$', '') ?? '0', 10);
      checkStep1Valid();
    });
  });

  otherInput?.addEventListener('keydown', (e) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-')
      e.preventDefault();
  });

  otherInput?.addEventListener('input', () => {
    const val = otherInput.value;
    const num = parseFloat(val);
    const valid = !isNaN(num) && num > 0 && !/e/i.test(val);
    otherInput.parentElement?.classList.toggle('error', val !== '' && !valid);
    if (valid) {
      amountBtns.forEach((b) => b.classList.remove('active'));
      selectedAmount = num;
    } else {
      selectedAmount = 0;
    }
    checkStep1Valid();
  });

  selectBox?.addEventListener('click', (e) => {
    e.stopPropagation();
    selectList?.classList.toggle('select-hide');
    selectBox.closest('.custom-select-container')?.classList.toggle('active');
  });

  const nameRegex = /^[a-zA-Z\s]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function checkStep2Valid(): void {
    const nameOk = nameRegex.test(nameInput?.value ?? '');
    const emailOk = emailRegex.test(emailInput?.value ?? '');
    if (toStep3Btn) toStep3Btn.disabled = !(nameOk && emailOk);
  }

  nameInput?.addEventListener('input', () => {
    const ok = nameRegex.test(nameInput.value);
    nameInput.parentElement?.classList.toggle(
      'error',
      nameInput.value.length > 0 && !ok,
    );
    const err = nameInput.parentElement?.querySelector('.error-message');
    if (err)
      err.textContent = ok ? '' : 'Only letters and spaces, min 3 characters';
    checkStep2Valid();
  });

  emailInput?.addEventListener('input', () => {
    const ok = emailRegex.test(emailInput.value);
    emailInput.parentElement?.classList.toggle(
      'error',
      emailInput.value.length > 0 && !ok,
    );
    const err = emailInput.parentElement?.querySelector('.error-message');
    if (err) err.textContent = ok ? '' : 'Enter a valid email address';
    checkStep2Valid();
  });

  nameInput?.addEventListener('focus', () =>
    nameInput.parentElement?.classList.remove('error'),
  );
  emailInput?.addEventListener('focus', () =>
    emailInput.parentElement?.classList.remove('error'),
  );

  function isValidExpiry(): boolean {
    if (!selectedMonth || !selectedYear) return false;
    const now = new Date();
    const exp = new Date(
      parseInt(selectedYear, 10),
      parseInt(selectedMonth, 10) - 1,
      1,
    );
    return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
  }

  function checkStep3Valid(): void {
    if (!completeBtn) return;
    const cardOk = /^\d{16}$/.test(cardInput?.value ?? '');
    const cvvOk = /^\d{3}$/.test(cvvInput?.value ?? '');
    completeBtn.disabled = !(cardOk && cvvOk && isValidExpiry());
  }

  cardInput?.addEventListener('input', () => {
    cardInput.value = cardInput.value.replace(/\D/g, '').slice(0, 16);
    const ok = /^\d{16}$/.test(cardInput.value);
    cardInput.parentElement?.classList.toggle(
      'error',
      cardInput.value.length > 0 && !ok,
    );
    checkStep3Valid();
  });

  cvvInput?.addEventListener('input', () => {
    cvvInput.value = cvvInput.value.replace(/\D/g, '').slice(0, 3);
    const ok = /^\d{3}$/.test(cvvInput.value);
    cvvInput.parentElement?.classList.toggle(
      'error',
      cvvInput.value.length > 0 && !ok,
    );
    checkStep3Valid();
  });

  function setupDateSelect(
    boxId: string,
    listId: string,
    type: 'm' | 'y',
  ): void {
    const box = document.getElementById(boxId);
    const list = document.getElementById(listId);

    if (type === 'm' && list) {
      list.innerHTML = '';
      for (let m = 1; m <= 12; m++) {
        const li = document.createElement('li');
        li.className = 'select-item';
        li.textContent = String(m).padStart(2, '0');
        list.appendChild(li);
      }
    }
    if (type === 'y' && list) {
      list.innerHTML = '';
      const y = new Date().getFullYear();
      for (let i = y; i <= y + 10; i++) {
        const li = document.createElement('li');
        li.className = 'select-item';
        li.textContent = String(i);
        list.appendChild(li);
      }
    }

    box?.addEventListener('click', (e) => {
      e.stopPropagation();
      list?.classList.toggle('select-hide');
      box.closest('.custom-select-container')?.classList.toggle('active');
    });

    list?.querySelectorAll<HTMLElement>('.select-item').forEach((item) => {
      item.addEventListener('click', () => {
        const val = item.textContent?.trim() ?? '';
        const current = box?.querySelector<HTMLElement>('.select-current');
        if (current) {
          current.textContent = val;
          current.style.color = '#000';
        }
        list.classList.add('select-hide');
        box?.closest('.custom-select-container')?.classList.remove('active');
        if (type === 'm') selectedMonth = val;
        else selectedYear = val;
        checkStep3Valid();
      });
    });
  }

  setupDateSelect('monthBox', 'monthList', 'm');
  setupDateSelect('yearBox', 'yearList', 'y');

  function renderSaveCardSection(): void {
    document.getElementById('saveCardSection')?.remove();
    if (!isLoggedIn() || !step3) return;

    const section = document.createElement('div');
    section.id = 'saveCardSection';
    section.style.marginTop = '12px';

    const savedCards = getSavedCards();
    if (savedCards.length > 0) {
      const wrap = document.createElement('div');
      wrap.className = 'custom-select-container';
      wrap.style.marginBottom = '12px';
      wrap.innerHTML = `
        <div class="select-box" id="savedCardsBox">
          <span class="select-current">Select saved card</span>
          <div class="select-arrow-wrapper">
            <img src="/assets/icons/arrow-down-black.svg" alt="">
          </div>
        </div>
        <ul class="select-list select-hide" id="savedCardsList">
          ${savedCards.map((c, i) => `<li class="select-item" data-index="${i}">${maskCard(c.cardNum)}</li>`).join('')}
        </ul>`;
      section.appendChild(wrap);

      const box = wrap.querySelector<HTMLElement>('#savedCardsBox');
      const list = wrap.querySelector<HTMLElement>('#savedCardsList');

      box?.addEventListener('click', (e) => {
        e.stopPropagation();
        list?.classList.toggle('select-hide');
        wrap.classList.toggle('active');
      });

      list?.querySelectorAll<HTMLElement>('.select-item').forEach((item) => {
        item.addEventListener('click', () => {
          const idx = parseInt(item.dataset['index'] ?? '0', 10);
          const card = savedCards[idx];
          if (!card) return;
          if (cardInput) cardInput.value = card.cardNum;
          if (cvvInput) cvvInput.value = card.cvv;
          selectedMonth = card.expMonth;
          selectedYear = card.expYear;
          const mCur = document.querySelector<HTMLElement>(
            '#monthBox .select-current',
          );
          const yCur = document.querySelector<HTMLElement>(
            '#yearBox .select-current',
          );
          if (mCur) {
            mCur.textContent = card.expMonth;
            mCur.style.color = '#000';
          }
          if (yCur) {
            yCur.textContent = card.expYear;
            yCur.style.color = '#000';
          }
          const cur = box?.querySelector<HTMLElement>('.select-current');
          if (cur) {
            cur.textContent = maskCard(card.cardNum);
            cur.style.color = '#000';
          }
          list.classList.add('select-hide');
          wrap.classList.remove('active');
          checkStep3Valid();
        });
      });
    }

    const label = document.createElement('label');
    label.style.cssText =
      'display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;margin-top:8px;';
    label.innerHTML = `<input type="checkbox" id="saveCardCheck"><span class="checkbox-custom"></span> Save card info for future donations`;
    section.appendChild(label);

    const footer = step3.querySelector('.donation-modal__footer');
    if (footer) step3.insertBefore(section, footer);
  }

  function prefillStep2(): void {
    if (!isLoggedIn()) return;
    const user = getStoredUser();
    if (!user) return;
    if (nameInput && user.name && !nameInput.value) {
      nameInput.value = user.name;
      checkStep2Valid();
    }
    if (emailInput && user.email && !emailInput.value) {
      emailInput.value = user.email;
      checkStep2Valid();
    }
  }

  document.getElementById('toStep2')?.addEventListener('click', () => {
    if (toStep2Btn?.disabled) return;
    prefillStep2();
    step1?.classList.add('d-none');
    step2?.classList.remove('d-none');
  });

  document.getElementById('toStep3')?.addEventListener('click', () => {
    if (toStep3Btn?.disabled) return;
    renderSaveCardSection();
    step2?.classList.add('d-none');
    step3?.classList.remove('d-none');
  });

  document.getElementById('backTo1')?.addEventListener('click', () => {
    step2?.classList.add('d-none');
    step1?.classList.remove('d-none');
  });

  document.getElementById('backTo2')?.addEventListener('click', () => {
    step3?.classList.add('d-none');
    step2?.classList.remove('d-none');
  });

  completeBtn?.addEventListener('click', async () => {
    if (completeBtn.disabled) return;

    const cardNum = cardInput?.value ?? '';
    const cvv = cvvInput?.value ?? '';
    const saveCheck = document.getElementById(
      'saveCardCheck',
    ) as HTMLInputElement | null;
    if (saveCheck?.checked && cardNum && cvv && selectedMonth && selectedYear) {
      saveCard({
        cardNum,
        expMonth: selectedMonth,
        expYear: selectedYear,
        cvv,
      });
    }

    const donationData: IDonation = {
      amount: selectedAmount,
      petId: String(selectedPetId),
      userName: nameInput?.value.trim() ?? '',
      userEmail: emailInput?.value.trim() ?? '',
    };

    completeBtn.disabled = true;
    completeBtn.textContent = 'Processing...';

    try {
      const token = localStorage.getItem('zoo_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/donations`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: donationData.userName,
          email: donationData.userEmail,
          amount: donationData.amount,
          petId: selectedPetId,
        }),
      });

      if (res.ok) {
        showNotification(
          `Thank you for your donation of $${selectedAmount} to ${selectedPetName}!`,
        );
      } else {
        const err = (await res.json()) as { error?: string };
        showNotification(
          err.error ?? 'Something went wrong. Please, try again later.',
          true,
        );
      }
    } catch {
      showNotification('Something went wrong. Please, try again later.', true);
    }

    document.dispatchEvent(new CustomEvent('closeModals'));

    setTimeout(() => {
      step3?.classList.add('d-none');
      step2?.classList.add('d-none');
      step1?.classList.remove('d-none');
      completeBtn.textContent = 'COMPLETE DONATION';
      completeBtn.disabled = true;
      if (toStep2Btn) toStep2Btn.disabled = true;
      if (toStep3Btn) toStep3Btn.disabled = true;
      selectedAmount = 0;
      selectedPetId = 0;
      selectedPetName = '';
      selectedMonth = '';
      selectedYear = '';
      amountBtns.forEach((b) => b.classList.remove('active'));
      if (otherInput) otherInput.value = '';
      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';
      if (cardInput) cardInput.value = '';
      if (cvvInput) cvvInput.value = '';
      if (selectCurrent) {
        selectCurrent.textContent = 'Choose your favourite';
        selectCurrent.style.color = '';
      }
      const mCur = document.querySelector<HTMLElement>(
        '#monthBox .select-current',
      );
      const yCur = document.querySelector<HTMLElement>(
        '#yearBox .select-current',
      );
      if (mCur) {
        mCur.textContent = 'Month';
        mCur.style.color = '';
      }
      if (yCur) {
        yCur.textContent = 'Year';
        yCur.style.color = '';
      }
      document.getElementById('saveCardSection')?.remove();
    }, 300);
  });

  document.addEventListener('click', () => {
    document
      .querySelectorAll('#stepModal .select-list, #donationModal .select-list')
      .forEach((l) => l.classList.add('select-hide'));
    document
      .querySelectorAll(
        '#stepModal .custom-select-container, #donationModal .custom-select-container',
      )
      .forEach((c) => c.classList.remove('active'));
  });
}
