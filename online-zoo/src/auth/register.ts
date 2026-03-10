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
    login: document.getElementById('login') as HTMLInputElement,
    password: document.getElementById('password') as HTMLInputElement,
    confirm: document.getElementById('confirm') as HTMLInputElement,
  },
};

const rules = {
  name: (v: string) => /^[a-zA-Z]{3,}$/.test(v),
  login: (v: string) => /^[a-zA-Z][a-zA-Z]{2,}$/.test(v),
  password: (v: string) => v.length >= 6 && /[^a-zA-Z0-9]/.test(v),
  confirm: (v: string) => v === elements.inputs.password.value && v.length > 0,
};

const state = { name: false, login: false, password: false, confirm: false };

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
    if (name === 'name') msg = 'Min 3 letters required.';
    if (name === 'login') msg = 'Min 3 chars, must start with letter.';
    if (name === 'password') msg = 'Min 6 chars + 1 special char.';
    if (name === 'confirm') msg = 'Passwords do not match.';
    updateUI(name, rules[name](val), msg);
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

elements.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  elements.submitBtn.classList.add('loading');
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: elements.inputs.name.value,
        login: elements.inputs.login.value,
        password: elements.inputs.password.value,
      }),
    });
    if (res.ok) {
      elements.formSuccess.classList.add('visible');
      setTimeout(() => (window.location.href = 'login.html'), 2000);
    } else {
      const data = await res.json();
      elements.formError.textContent = data.message || 'Error';
      elements.formError.classList.add('visible');
    }
  } catch {
    elements.formError.textContent = 'Network error';
    elements.formError.classList.add('visible');
  } finally {
    elements.submitBtn.classList.remove('loading');
  }
});
