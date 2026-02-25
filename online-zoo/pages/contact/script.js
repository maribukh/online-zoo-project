const form = document.querySelector('.contact-form');
const inputs = form.querySelectorAll('input, textarea');

inputs.forEach((input) => {
  input.addEventListener('blur', () => {
    if (!input.validity.valid) {
      input.parentElement.classList.add('error');
    } else {
      input.parentElement.classList.remove('error');
    }
  });

  input.addEventListener('input', () => {
    if (input.validity.valid) {
      input.parentElement.classList.remove('error');
    }
  });
});

form.addEventListener('submit', (e) => {
  let isFormValid = true;
  inputs.forEach((input) => {
    if (!input.validity.valid) {
      input.parentElement.classList.add('error');
      isFormValid = false;
    }
  });

  if (!isFormValid) {
    e.preventDefault();
  }
});
