/* ═══════════════════════════════════════════════════════════════
   ICON SPRITE — monoline, 24×24, currentColor, stroke set in CSS.
   Injected once into <body>; referenced with <use href="#id">.
   Replaces the Unicode zodiac characters entirely, which removes
   the emoji-presentation problem at the source.
   ═══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ---- 12 zodiac marks, drawn as paths ---- */
const ZODIAC_PATHS = {
  aries:'<path d="M12 20.5V10m0 0c0-3.6-2.1-6.1-4.9-6.1-2.4 0-3.7 1.9-3.7 3.9m8.6 2.2c0-3.6 2.1-6.1 4.9-6.1 2.4 0 3.7 1.9 3.7 3.9"/>',
  taurus:'<circle cx="12" cy="16.4" r="5.3"/><path d="M4.3 3.2c0 4.9 3.4 8.2 7.7 8.2s7.7-3.3 7.7-8.2"/>',
  gemini:'<path d="M4 4.6c4.6-2.1 11.4-2.1 16 0M4 19.4c4.6 2.1 11.4 2.1 16 0M8.6 3.6v16.8M15.4 3.6v16.8"/>',
  cancer:'<path d="M2.8 9.3c0-2.8 3.4-4.3 7.4-4.3 4.6 0 8.6 1.4 10.3 3.3M21.2 14.7c0 2.8-3.4 4.3-7.4 4.3-4.6 0-8.6-1.4-10.3-3.3"/><circle cx="18.4" cy="9.6" r="2.3"/><circle cx="5.6" cy="14.4" r="2.3"/>',
  leo:'<circle cx="7.6" cy="16.2" r="3.6"/><path d="M11.2 16.2c0-4.4-2.4-6.5-2.4-9 0-2.6 2-4.3 4.6-4.3s4.7 2 4.7 5.1c0 4.5-2.6 7.4-2.6 10 0 2 1.5 3.4 3.4 3.4 1 0 1.8-.3 2.3-.9"/>',
  virgo:'<path d="M2.8 5.4v11.8M2.8 7.2c0-1.9 1.2-3 2.7-3s2.7 1.1 2.7 3v10M8.2 7.2c0-1.9 1.2-3 2.7-3s2.7 1.1 2.7 3v10M13.6 8.4c.5-2.4 2.2-4 4.3-4 2.4 0 3.9 2 3.9 5 0 4.4-3 7.7-7 9.4M13.6 15.4c0 2.9 2.4 5 6 5.6"/>',
  libra:'<path d="M2.8 19.8h18.4M2.8 14.2h5.6M15.6 14.2h5.6"/><path d="M8.4 14.2a3.9 3.9 0 0 1 7.2 0"/>',
  scorpio:'<path d="M2.8 5.4v11.8M2.8 7.2c0-1.9 1.2-3 2.7-3s2.7 1.1 2.7 3v10M8.2 7.2c0-1.9 1.2-3 2.7-3s2.7 1.1 2.7 3v10c0 2 1.3 3.3 3.2 3.3h3.6"/><path d="M17.9 17.4l3.3 3.1-3.3 2.4"/>',
  sagittarius:'<path d="M4.4 19.6L19.6 4.4M13.2 4.4h6.4v6.4M8.6 11.4l4 4"/>',
  capricorn:'<path d="M2.8 5.6v10.6M2.8 7.4c0-1.9 1.2-3 2.8-3s2.9 1.1 2.9 3.2v7.2M8.5 7.6c.7-2.1 2.2-3.2 4-3.2 2.2 0 3.6 1.8 3.6 4.5v6.6c0 3-1.7 5-4.2 5-1.8 0-3-1.2-3-2.9s1.3-2.9 3.1-2.9c2.2 0 4 1.5 5 3.8"/>',
  aquarius:'<path d="M2.8 9.6l4.6-3.2 4.6 3.2 4.6-3.2 4.6 3.2M2.8 17.6l4.6-3.2 4.6 3.2 4.6-3.2 4.6 3.2"/>',
  pisces:'<path d="M6.6 3.2c-3 3.6-3 14 0 17.6M17.4 3.2c3 3.6 3 14 0 17.6M2.8 12h18.4"/>'
};

/* ---- category marks ---- */
const CAT_PATHS = {
  /* a rudraksha bead: sphere with mukhi striations */
  rudraksha:'<circle cx="12" cy="12" r="8.6"/><path d="M12 3.4v17.2M7.1 4.6c-1.8 3.5-1.8 11.3 0 14.8M16.9 4.6c1.8 3.5 1.8 11.3 0 14.8"/>',
  /* japa mala: beaded ring with a sumeru bead */
  mala:'<circle cx="12" cy="10.4" r="7.2" stroke-dasharray="1.5 2.3"/><circle cx="12" cy="20.6" r="1.9"/>',
  /* four-point star — combinations, and the "All" filter */
  star:'<path d="M12 2.6l1.9 7.5 7.5 1.9-7.5 1.9-1.9 7.5-1.9-7.5L2.6 12l7.5-1.9z"/>'
};

/* ---- UI icons, redrawn monoline to match ---- */
const UI_PATHS = {
  'i-home':'<path d="M3 10.4L12 3.2l9 7.2V20a1 1 0 0 1-1 1h-5.2v-6.2H9.2V21H4a1 1 0 0 1-1-1z"/>',
  'i-shop':'<path d="M3.4 7.2h17.2l-1.4 12.1a1.8 1.8 0 0 1-1.8 1.6H6.6a1.8 1.8 0 0 1-1.8-1.6z"/><path d="M8.6 7.2V5.6a3.4 3.4 0 0 1 6.8 0v1.6"/>',
  'i-cart':'<circle cx="9.2" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/><path d="M2.4 3.2h2.9l2.3 11.2a1.7 1.7 0 0 0 1.7 1.4h8.1a1.7 1.7 0 0 0 1.7-1.4L20.8 7H6"/>',
  'i-spark':'<path d="M12 2.6l1.9 7.5 7.5 1.9-7.5 1.9-1.9 7.5-1.9-7.5L2.6 12l7.5-1.9z"/>',
  'i-user':'<circle cx="12" cy="8" r="3.5"/><path d="M4.8 20.6a7.2 7.2 0 0 1 14.4 0"/>',
  'i-phone':'<path d="M21.2 16.9v2.6a1.8 1.8 0 0 1-2 1.8 17.7 17.7 0 0 1-7.7-2.8 17.4 17.4 0 0 1-5.3-5.3A17.7 17.7 0 0 1 3.4 5.5a1.8 1.8 0 0 1 1.8-2h2.6a1.8 1.8 0 0 1 1.8 1.6c.1 1 .3 1.9.6 2.7a1.8 1.8 0 0 1-.4 1.9L8.6 10.9a14.2 14.2 0 0 0 5.3 5.3l1.2-1.2a1.8 1.8 0 0 1 1.9-.4c.8.3 1.7.5 2.7.6a1.8 1.8 0 0 1 1.5 1.7z"/>',
  'i-wa':'<path d="M12 2.8A9.2 9.2 0 0 0 4.1 16.7L2.8 21.2l4.6-1.3A9.2 9.2 0 1 0 12 2.8z"/><path d="M8.6 8.2c-.3.3-.8.9-.8 1.9s.7 2.1.9 2.3c.2.2 1.4 2.3 3.5 3.2 1.7.7 2.3.7 2.8.6.5-.1 1.4-.6 1.6-1.2"/>',
  'i-insta':'<rect x="2.9" y="2.9" width="18.2" height="18.2" rx="4.8"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".9" fill="currentColor" stroke="none"/>',
  'i-close':'<path d="M18.4 5.6L5.6 18.4M5.6 5.6l12.8 12.8"/>',
  'i-plus':'<path d="M12 5.2v13.6M5.2 12h13.6"/>',
  'i-minus':'<path d="M5.2 12h13.6"/>',
  'i-arrow':'<path d="M3.6 12h16.8M14 5.6l6.4 6.4-6.4 6.4"/>',
  'i-check':'<path d="M20 6.4L9 17.4l-5-5"/>',
  'i-pin':'<path d="M12 21.2s6.8-6.1 6.8-10.8a6.8 6.8 0 1 0-13.6 0C5.2 15.1 12 21.2 12 21.2z"/><circle cx="12" cy="10.2" r="2.5"/>',
  'i-trash':'<path d="M4.2 7h15.6M10 11v6M14 11v6M5.4 7l1 12.6a1 1 0 0 0 1 .9h9.2a1 1 0 0 0 1-.9L18.6 7M9 7V4.2h6V7"/>'
};

function buildSprite() {
  const sym = (id, body) =>
    `<symbol id="${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-linecap="round" stroke-linejoin="round">${body}</symbol>`;
  let out = '';
  for (const k in ZODIAC_PATHS) out += sym('z-' + k, ZODIAC_PATHS[k]);
  for (const k in CAT_PATHS)    out += sym('c-' + k, CAT_PATHS[k]);
  for (const k in UI_PATHS)     out += sym(k, UI_PATHS[k]);

  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + out + '</svg>';
  document.body.prepend(el);
}

/* `icon('z-leo')` → an <svg> that references the sprite */
function icon(id, cls) {
  return `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#${id}"/></svg>`;
}

/* map a product to its mark */
function markFor(p) {
  if (p.category === 'bracelet' && p.zodiac) return 'z-' + p.zodiac;
  if (p.category === 'rudraksha') return 'c-rudraksha';
  if (p.category === 'mala') return 'c-mala';
  return 'c-star';
}

window.ICONS = { buildSprite, icon, markFor, ZODIAC_KEYS: Object.keys(ZODIAC_PATHS) };
})();
