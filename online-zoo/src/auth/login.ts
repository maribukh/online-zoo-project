const API_URL =
  'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';

const elements = {
  form: document.getElementById('loginForm') as HTMLFormElement,
  submitBtn: document.getElementById('submitBtn') as HTMLButtonElement,
  formError: document.getElementById('formError') as HTMLElement,
  login: document.getElementById('login') as HTMLInputElement,
  password: document.getElementById('password') as HTMLInputElement,
};

function validate() {
  const isLoginOk = elements.login.value.length >= 3;
  const isPassOk = elements.password.value.length >= 6;
  elements.submitBtn.disabled = !(isLoginOk && isPassOk);
}

elements.login.addEventListener('input', validate);
elements.password.addEventListener('input', validate);

elements.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  elements.submitBtn.classList.add('loading');
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: elements.login.value,
        password: elements.password.value,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      const token =
        data.token ?? data.jwt ?? data.accessToken ?? data.data?.token;
      localStorage.setItem('zoo_token', token as string);
      localStorage.setItem(
        'zoo_user',
        JSON.stringify(data.user || { name: elements.login.value }),
      );
      window.location.href = '../landing/index.html';
    } else {
      elements.formError.textContent = 'Incorrect login or password';
      elements.formError.classList.add('visible');
    }
  } catch {
    elements.formError.textContent = 'Network error';
    elements.formError.classList.add('visible');
  } finally {
    elements.submitBtn.classList.remove('loading');
  }
});

export {};
