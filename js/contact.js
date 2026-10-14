const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

const fields = {
  name: { el: document.getElementById('name'), test: v => v.trim().length >= 2, msg: 'Please enter at least 2 characters.' },
  email: { el: document.getElementById('email'), test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
  subject: { el: document.getElementById('subject'), test: v => v.trim().length >= 3, msg: 'Subject must be at least 3 characters.' },
  message: { el: document.getElementById('message'), test: v => v.trim().length >= 10, msg: 'Message must be at least 10 characters.' }
};

function showError(name, message) {
  const errorEl = document.querySelector(`.error[data-for="${name}"]`);
  const inputEl = fields[name].el;
  errorEl.textContent = message;
  inputEl.classList.toggle('error', Boolean(message));
}

function validateField(name) {
  const { el, test, msg } = fields[name];
  const ok = test(el.value);
  showError(name, ok ? '' : msg);
  return ok;
}

Object.keys(fields).forEach(name => {
  fields[name].el.addEventListener('blur', () => validateField(name));
  fields[name].el.addEventListener('input', () => {
    if (fields[name].el.classList.contains('error')) validateField(name);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  Object.keys(fields).forEach(name => {
    if (!validateField(name)) valid = false;
  });

  if (!valid) {
    status.className = 'form-status fail';
    status.textContent = 'Please correct the highlighted fields.';
    return;
  }

  status.className = 'form-status success';
  status.textContent = 'Thanks! Your message has been validated locally (demo only — nothing was sent).';
  form.reset();
  Object.keys(fields).forEach(name => showError(name, ''));
});