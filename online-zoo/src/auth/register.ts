const API_URL =
  'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';

const elements = {
  form: document.getElementById('registerForm') as HTMLFormElement,
  submitBtn: document.getElementById('submitBtn') as HTMLButtonElement,
  formError: document.getElementById('formError') as HTMLElement,
  formSuccess: document.getElementById('formSuccess') as HTMLElement,
  strengthFill: document.getElementById('strengthFill') as HTMLElement,
  inputs: {
    name: document.getElementById('name') as HTMLInputElement,
    email: document.getElementById('email') as HTMLInputElement,
    login: document.getElementById('login') as HTMLInputElement,
    password: document.getElementById('password') as HTMLInputElement,
    confirm: document.getElementById('confirm') as HTMLInputElement,
  },
};

const rules = {
  name: (v: string) => /^[a-zA-Z]{3,}$/.test(v),
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  login: (v: string) => /^[a-zA-Z][a-zA-Z]{2,}$/.test(v),
  password: (v: string) => v.length >= 6 && /[^a-zA-Z0-9]/.test(v),
  confirm: (v: string) => v === elements.inputs.password.value && v.length > 0,
};

const state = {
  name: false,
  email: false,
  login: false,
  password: false,
  confirm: false,
};

function updateUI(name: keyof typeof state, isValid: boolean, message: string) {
  const input = elements.inputs[name];
  const msg = document.getElementById(`msg-${name}`) as HTMLElement;
  input.classList.toggle('error', !isValid);
  input.classList.toggle('valid', isValid);
  msg.textContent = isValid ? '' : message;
  msg.classList.toggle('visible', !isValid);
  state[name] = isValid;
  elements.submitBtn.disabled = !Object.values(state).every(Boolean);
}

Object.keys(elements.inputs).forEach((key) => {
  const name = key as keyof typeof state;
  const input = elements.inputs[name];

  input.addEventListener('blur', () => {
    const val = input.value.trim();
    let msg = '';
    if (name === 'name') msg = 'Min 3 letters, only English letters.';
    if (name === 'email') msg = 'Enter a valid email address.';
    if (name === 'login') msg = 'Min 3 chars, must start with a letter.';
    if (name === 'password') msg = 'Min 6 chars + 1 special character.';
    if (name === 'confirm') msg = 'Passwords do not match.';
    updateUI(name, rules[name](val), msg);
  });

  input.addEventListener('focus', () => {
    const msg = document.getElementById(`msg-${name}`) as HTMLElement;
    input.classList.remove('error');
    msg.textContent = '';
    msg.classList.remove('visible');
    elements.formError.classList.remove('visible');
  });

  input.addEventListener('input', () => {
    if (name === 'password') {
      const score = [
        input.value.length >= 6,
        input.value.length >= 10,
        /[^a-zA-Z0-9]/.test(input.value),
        /[A-Z]/.test(input.value),
        /[0-9]/.test(input.value),
      ].filter(Boolean).length;
      elements.strengthFill.style.width = `${(score / 5) * 100}%`;
      const colors = ['#D93025', '#D93025', '#F06C30', '#F09030', '#458A4F'];
      elements.strengthFill.style.background = colors[score - 1] || '#D9D9D9';
    }
  });
});

function setupToggle(
  btnId: string,
  inputId: string,
  offId: string,
  onId: string,
) {
  document.getElementById(btnId)?.addEventListener('click', () => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    (document.getElementById(offId) as HTMLElement).style.display = isHidden
      ? 'none'
      : 'block';
    (document.getElementById(onId) as HTMLElement).style.display = isHidden
      ? 'block'
      : 'none';
  });
}

setupToggle('togglePw1', 'password', 'eye1Off', 'eye1On');
setupToggle('togglePw2', 'confirm', 'eye2Off', 'eye2On');

function showError(msg: string): void {
  elements.formError.textContent = msg;
  elements.formError.classList.add('visible');
}

elements.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  elements.submitBtn.classList.add('loading');
  elements.formError.classList.remove('visible');
  elements.formSuccess.classList.remove('visible');

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: elements.inputs.name.value.trim(),
        email: elements.inputs.email.value.trim(),
        login: elements.inputs.login.value.trim(),
        password: elements.inputs.password.value,
      }),
    });

    if (res.ok || res.status === 201) {
      elements.formSuccess.classList.add('visible');
      setTimeout(() => (window.location.href = 'login.html'), 2000);
      return;
    }

    const data = (await res.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
    };

    if (res.status === 409) {
      showError('This user already exists.');
    } else if (res.status === 400) {
      showError(
        data.message ?? 'Invalid data. Please check your input and try again.',
      );
    } else if (res.status >= 500) {
      showError('Server error. Please try again later.');
    } else {
      showError(
        data.message ?? data.error ?? 'Registration failed. Please try again.',
      );
    }
  } catch {
    showError('Network error. Please check your connection and try again.');
  } finally {
    elements.submitBtn.classList.remove('loading');
  }
});

export {};
