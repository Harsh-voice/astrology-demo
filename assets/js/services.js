/* Services page — full detail list. */
(function () {
'use strict';
window.AA.onReady(function () {
const A = window.AA, $ = A.$, $$ = A.$$;
const list = $('#svc-list'); if (!list) return;
const pad = n => String(n).padStart(2, '0');

list.innerHTML = window.SERVICES.map((s, i) => `
  <article class="item reveal" id="${A.esc(s.key)}" style="scroll-margin-top:calc(var(--appbar-h) + 24px)">
    <span class="item__n">${pad(i + 1)}</span>
    <h3>${A.esc(s.name)}</h3>
    <p class="item__quote">${A.esc(s.blurb)}</p>
    <p>${A.esc(s.long)}</p>
    <a class="link-arrow" href="contact.html">Book this ${A.svg('i-arrow')}</a>
  </article>`).join('');

if (location.hash) {
  const t = document.getElementById(location.hash.slice(1));
  if (t) setTimeout(() => t.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
}
$$('.reveal').forEach((el, i) => {
  el.style.transitionDelay = Math.min(i % 6, 5) * 70 + 'ms';
  requestAnimationFrame(() => el.classList.add('is-in'));
});
});
})();
