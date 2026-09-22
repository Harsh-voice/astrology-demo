/* Contact page — booking form that hands off to WhatsApp. */
(function () {
'use strict';
window.AA.onReady(function () {
const A = window.AA, $ = A.$, $$ = A.$$;
const CFG = window.ASTRO_CONFIG || {};
const form = $('#booking'); if (!form) return;

/* service dropdown from the real service list */
const sel = $('#b-service');
if (sel) sel.innerHTML =
  '<option value="">Not sure yet — please advise</option>' +
  window.SERVICES.map(s => `<option value="${A.esc(s.name)}">${A.esc(s.name)}</option>`).join('') +
  '<option value="Course enquiry">Course enquiry</option>' +
  '<option value="Bracelet / Rudraksha order">Bracelet / Rudraksha order</option>';

const RULES = {
  name:  v => v.trim().length >= 2 || 'Please enter your full name',
  phone: v => /^[6-9]\d{9}$/.test(v.replace(/\D/g, '').replace(/^91/, '')) || 'Enter a valid 10-digit mobile number'
};

function check(id) {
  const el = $('#b-' + id); if (!el || !RULES[id]) return true;
  const res = RULES[id](el.value), bad = res !== true;
  const field = el.closest('.field');
  field.classList.toggle('is-invalid', bad);
  const err = $('.field__err', field); if (err) err.textContent = bad ? res : '';
  return !bad;
}

['name', 'phone'].forEach(id => {
  const el = $('#b-' + id);
  if (!el) return;
  el.addEventListener('blur', () => check(id));
  /* clear the error as soon as it becomes valid — don't nag while typing */
  el.addEventListener('input', () => {
    const field = el.closest('.field');
    if (field.classList.contains('is-invalid') && RULES[id](el.value) === true) check(id);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const okName = check('name'), okPhone = check('phone');
  if (!okName || !okPhone) {
    A.toast('Please check the highlighted fields');
    const bad = $('.field.is-invalid .input'); if (bad) bad.focus();
    return;
  }

  const g = id => { const el = $('#b-' + id); return el ? el.value.trim() : ''; };
  const msg = [
    '*Appointment request — Astro Ashwini*', '',
    `Name: ${g('name')}`,
    `Mobile: ${g('phone')}`,
    g('service') ? `Service: ${g('service')}` : 'Service: Not sure yet — please advise',
    g('dob') ? `Date of birth: ${g('dob')}` : '',
    g('tob') ? `Time of birth: ${g('tob')}` : '',
    g('pob') ? `Place of birth: ${g('pob')}` : '',
    '',
    g('msg') ? `Question: ${g('msg')}` : ''
  ].filter(Boolean).join('\n');

  window.open(`https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  A.toast('Opening WhatsApp…', 'wa');
  form.reset();
});

$$('.reveal').forEach(el => requestAnimationFrame(() => el.classList.add('is-in')));
});
})();
