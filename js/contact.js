/**
 * Astra Global Solution — Contact Page
 * Floating labels, validation, select state
 */

document.addEventListener('DOMContentLoaded', initContactPage);

function initContactPage() {
  initFloatingLabels();
  initContactForm();
}

function initFloatingLabels() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.querySelectorAll('.form-field select').forEach(select => {
    const update = () => {
      select.classList.toggle('has-value', select.value !== '');
    };
    update();
    select.addEventListener('change', update);
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const rules = {
    firstName: { required: true, message: 'First name is required' },
    lastName: { required: true, message: 'Last name is required' },
    email: {
      required: true,
      message: 'Please enter a valid email address',
      validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
    },
    phone: {
      required: false,
      message: 'Please enter a valid phone number',
      validate: val => !val || /^[\d\s\-+().]{7,20}$/.test(val)
    },
    subject: { required: true, message: 'Please select a subject' },
    message: {
      required: true,
      message: 'Message must be at least 10 characters',
      validate: val => val.trim().length >= 10
    }
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(form, rules)) {
      showSuccess(form);
    }
  });

  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field, rules));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field, rules);
    });
    field.addEventListener('change', () => {
      if (field.tagName === 'SELECT') {
        field.classList.toggle('has-value', field.value !== '');
      }
      if (field.classList.contains('error')) validateField(field, rules);
    });
  });
}

function validateForm(form, rules) {
  let isValid = true;
  Object.keys(rules).forEach(name => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field && !validateField(field, rules)) isValid = false;
  });
  return isValid;
}

function validateField(field, rules) {
  const rule = rules[field.name];
  if (!rule) return true;

  const group = field.closest('.form-field');
  const value = field.value.trim();
  let valid = true;
  let message = rule.message;

  if (rule.required && !value) {
    valid = false;
    message = rule.message.includes('required') || rule.message.includes('select')
      ? rule.message
      : 'This field is required';
  } else if (value && rule.validate && !rule.validate(value)) {
    valid = false;
  }

  group?.classList.toggle('has-error', !valid);
  field.classList.toggle('error', !valid);

  const errorEl = group?.querySelector('.form-error');
  if (errorEl && !valid) errorEl.textContent = message;

  return valid;
}

function showSuccess(form) {
  const successMsg = document.getElementById('contactSuccess');
  successMsg?.classList.add('show');
  form.reset();

  form.querySelectorAll('.form-field select').forEach(s => s.classList.remove('has-value'));
  form.querySelectorAll('.form-field').forEach(g => g.classList.remove('has-error'));
  form.querySelectorAll('.error').forEach(f => f.classList.remove('error'));

  setTimeout(() => successMsg?.classList.remove('show'), 6000);
}
