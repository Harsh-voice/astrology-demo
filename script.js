// ═══════════════════════════════════════════════
//  ZODIAC DATA
// ═══════════════════════════════════════════════
const ZODIAC_SIGNS = [
  { name:'Aries',       glyph:'♈', start:[3,21], end:[4,19],  element:'Fire',  planet:'Mars',    desc:'Bold, passionate, and determined — natural leaders always ready for a new challenge.' },
  { name:'Taurus',      glyph:'♉', start:[4,20], end:[5,20],  element:'Earth', planet:'Venus',   desc:'Patient, reliable, and devoted — grounded souls with a deep appreciation for beauty.' },
  { name:'Gemini',      glyph:'♊', start:[5,21], end:[6,20],  element:'Air',   planet:'Mercury', desc:'Curious, adaptable, and expressive — the social butterflies of the zodiac.' },
  { name:'Cancer',      glyph:'♋', start:[6,21], end:[7,22],  element:'Water', planet:'Moon',    desc:'Intuitive, nurturing, and protective — deeply connected to home and family.' },
  { name:'Leo',         glyph:'♌', start:[7,23], end:[8,22],  element:'Fire',  planet:'Sun',     desc:'Charismatic, generous, and creative — natural performers who light up every room.' },
  { name:'Virgo',       glyph:'♍', start:[8,23], end:[9,22],  element:'Earth', planet:'Mercury', desc:'Analytical, practical, and diligent — perfectionists with a caring heart.' },
  { name:'Libra',       glyph:'♎', start:[9,23], end:[10,22], element:'Air',   planet:'Venus',   desc:'Diplomatic, fair-minded, and social — seekers of harmony and justice.' },
  { name:'Scorpio',     glyph:'♏', start:[10,23],end:[11,21], element:'Water', planet:'Pluto',   desc:'Passionate, determined, and resourceful — masters of transformation and depth.' },
  { name:'Sagittarius', glyph:'♐', start:[11,22],end:[12,21], element:'Fire',  planet:'Jupiter', desc:'Adventurous, optimistic, and philosophical — eternal seekers of truth and freedom.' },
  { name:'Capricorn',   glyph:'♑', start:[12,22],end:[1,19],  element:'Earth', planet:'Saturn',  desc:'Disciplined, ambitious, and patient — the strategic architects of the zodiac.' },
  { name:'Aquarius',    glyph:'♒', start:[1,20], end:[2,18],  element:'Air',   planet:'Uranus',  desc:'Original, independent, and humanitarian — visionary rebels ahead of their time.' },
  { name:'Pisces',      glyph:'♓', start:[2,19], end:[3,20],  element:'Water', planet:'Neptune', desc:'Empathetic, artistic, and intuitive — dreamers deeply connected to the unseen world.' },
];

const LIFE_PATH_DATA = {
  1: { word:'Initiation',    desc:'You are a born leader — independent, pioneering, and driven by an unshakeable desire to forge your own path. Your purpose is to lead with integrity.' },
  2: { word:'Partnership',   desc:'You are a natural peacemaker — intuitive, cooperative, and deeply sensitive. Your purpose is to create harmony and nurture meaningful relationships.' },
  3: { word:'Creativity',    desc:'You are an expressive soul — joyful, imaginative, and gifted in communication. Your purpose is to inspire others through your creativity and light.' },
  4: { word:'Stability',     desc:'You are a builder — disciplined, trustworthy, and dedicated to creating lasting structures. Your purpose is to establish security and order in the world.' },
  5: { word:'Freedom',       desc:'You are an adventurer — curious, versatile, and driven by a need for change and experience. Your purpose is to embrace life fully and inspire others to do the same.' },
  6: { word:'Harmony',       desc:'You are a nurturer — responsible, compassionate, and devoted to family and community. Your purpose is to create beauty, love, and balance in the world.' },
  7: { word:'Wisdom',        desc:'You are a seeker — introspective, analytical, and deeply spiritual. Your purpose is to pursue truth, develop inner wisdom, and share your insights.' },
  8: { word:'Abundance',     desc:'You are a manifestor — ambitious, authoritative, and magnetically powerful. Your purpose is to master the material world and create lasting impact.' },
  9: { word:'Completion',    desc:'You are a humanitarian — compassionate, wise, and driven by a higher calling. Your purpose is to serve humanity and inspire through selfless love.' },
  11:{ word:'Illumination',  desc:'You are a master intuitive — highly sensitive, visionary, and spiritually gifted. Your purpose is to illuminate the path for others through inspiration.' },
  22:{ word:'Master Builder',desc:'You are a master builder — practical visionary with the power to turn ambitious dreams into reality. Your purpose is to leave a lasting legacy.' },
  33:{ word:'Master Teacher',desc:'You are a master teacher — compassionate, nurturing, and devoted to uplifting humanity. Your purpose is to embody unconditional love and wisdom.' },
};

// ═══════════════════════════════════════════════
//  TAROT DATA
// ═══════════════════════════════════════════════
const TAROT_DATA = {
  major: [
    { num:'0',  name:'The Fool',           emoji:'🤡' },
    { num:'I',  name:'The Magician',       emoji:'🪄' },
    { num:'II', name:'The High Priestess', emoji:'🌙' },
    { num:'III',name:'The Empress',        emoji:'👑' },
    { num:'IV', name:'The Emperor',        emoji:'⚔️' },
    { num:'V',  name:'The Hierophant',     emoji:'📖' },
    { num:'VI', name:'The Lovers',         emoji:'♥️' },
    { num:'VII',name:'The Chariot',        emoji:'🏇' },
    { num:'VIII',name:'Strength',          emoji:'🦁' },
    { num:'IX', name:'The Hermit',         emoji:'🕯️' },
    { num:'X',  name:'Wheel of Fortune',   emoji:'☸️' },
    { num:'XI', name:'Justice',            emoji:'⚖️' },
    { num:'XII',name:'The Hanged Man',     emoji:'🙃' },
    { num:'XIII',name:'Death',             emoji:'💀' },
    { num:'XIV',name:'Temperance',         emoji:'⚗️' },
    { num:'XV', name:'The Devil',          emoji:'😈' },
    { num:'XVI',name:'The Tower',          emoji:'⚡' },
    { num:'XVII',name:'The Star',          emoji:'⭐' },
    { num:'XVIII',name:'The Moon',         emoji:'🌕' },
    { num:'XIX',name:'The Sun',            emoji:'☀️' },
    { num:'XX', name:'Judgement',          emoji:'📯' },
    { num:'XXI',name:'The World',          emoji:'🌍' },
  ],
  wands: [
    { num:'Ace',  name:'Ace of Wands',   emoji:'🔥' },
    { num:'2',    name:'Two of Wands',   emoji:'🔥' },
    { num:'3',    name:'Three of Wands', emoji:'🔥' },
    { num:'4',    name:'Four of Wands',  emoji:'🔥' },
    { num:'5',    name:'Five of Wands',  emoji:'🔥' },
    { num:'6',    name:'Six of Wands',   emoji:'🔥' },
    { num:'7',    name:'Seven of Wands', emoji:'🔥' },
    { num:'8',    name:'Eight of Wands', emoji:'🔥' },
    { num:'9',    name:'Nine of Wands',  emoji:'🔥' },
    { num:'10',   name:'Ten of Wands',   emoji:'🔥' },
    { num:'Page', name:'Page of Wands',  emoji:'🔥' },
    { num:'Knight',name:'Knight of Wands',emoji:'🔥' },
    { num:'Queen',name:'Queen of Wands', emoji:'🔥' },
    { num:'King', name:'King of Wands',  emoji:'🔥' },
  ],
  cups: [
    { num:'Ace',  name:'Ace of Cups',   emoji:'💧' },
    { num:'2',    name:'Two of Cups',   emoji:'💧' },
    { num:'3',    name:'Three of Cups', emoji:'💧' },
    { num:'4',    name:'Four of Cups',  emoji:'💧' },
    { num:'5',    name:'Five of Cups',  emoji:'💧' },
    { num:'6',    name:'Six of Cups',   emoji:'💧' },
    { num:'7',    name:'Seven of Cups', emoji:'💧' },
    { num:'8',    name:'Eight of Cups', emoji:'💧' },
    { num:'9',    name:'Nine of Cups',  emoji:'💧' },
    { num:'10',   name:'Ten of Cups',   emoji:'💧' },
    { num:'Page', name:'Page of Cups',  emoji:'💧' },
    { num:'Knight',name:'Knight of Cups',emoji:'💧' },
    { num:'Queen',name:'Queen of Cups', emoji:'💧' },
    { num:'King', name:'King of Cups',  emoji:'💧' },
  ],
  swords: [
    { num:'Ace',  name:'Ace of Swords',   emoji:'⚔️' },
    { num:'2',    name:'Two of Swords',   emoji:'⚔️' },
    { num:'3',    name:'Three of Swords', emoji:'⚔️' },
    { num:'4',    name:'Four of Swords',  emoji:'⚔️' },
    { num:'5',    name:'Five of Swords',  emoji:'⚔️' },
    { num:'6',    name:'Six of Swords',   emoji:'⚔️' },
    { num:'7',    name:'Seven of Swords', emoji:'⚔️' },
    { num:'8',    name:'Eight of Swords', emoji:'⚔️' },
    { num:'9',    name:'Nine of Swords',  emoji:'⚔️' },
    { num:'10',   name:'Ten of Swords',   emoji:'⚔️' },
    { num:'Page', name:'Page of Swords',  emoji:'⚔️' },
    { num:'Knight',name:'Knight of Swords',emoji:'⚔️' },
    { num:'Queen',name:'Queen of Swords', emoji:'⚔️' },
    { num:'King', name:'King of Swords',  emoji:'⚔️' },
  ],
  pentacles: [
    { num:'Ace',  name:'Ace of Pentacles',   emoji:'🌿' },
    { num:'2',    name:'Two of Pentacles',   emoji:'🌿' },
    { num:'3',    name:'Three of Pentacles', emoji:'🌿' },
    { num:'4',    name:'Four of Pentacles',  emoji:'🌿' },
    { num:'5',    name:'Five of Pentacles',  emoji:'🌿' },
    { num:'6',    name:'Six of Pentacles',   emoji:'🌿' },
    { num:'7',    name:'Seven of Pentacles', emoji:'🌿' },
    { num:'8',    name:'Eight of Pentacles', emoji:'🌿' },
    { num:'9',    name:'Nine of Pentacles',  emoji:'🌿' },
    { num:'10',   name:'Ten of Pentacles',   emoji:'🌿' },
    { num:'Page', name:'Page of Pentacles',  emoji:'🌿' },
    { num:'Knight',name:'Knight of Pentacles',emoji:'🌿' },
    { num:'Queen',name:'Queen of Pentacles', emoji:'🌿' },
    { num:'King', name:'King of Pentacles',  emoji:'🌿' },
  ],
};

// ═══════════════════════════════════════════════
//  INIT DROPDOWNS
// ═══════════════════════════════════════════════
function populateDays(selectId) {
  const el = document.getElementById(selectId);
  if (!el) return;
  for (let d = 1; d <= 31; d++) {
    const o = document.createElement('option');
    o.value = d; o.textContent = d;
    el.appendChild(o);
  }
}

function populateYears(selectId) {
  const el = document.getElementById(selectId);
  if (!el) return;
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1920; y--) {
    const o = document.createElement('option');
    o.value = y; o.textContent = y;
    el.appendChild(o);
  }
}

populateDays('birth-day');
populateYears('birth-year');
populateDays('num-day');
populateYears('num-year');

// ═══════════════════════════════════════════════
//  ZODIAC FINDER
// ═══════════════════════════════════════════════
function getZodiacSign(month, day) {
  month = parseInt(month); day = parseInt(day);
  for (const sign of ZODIAC_SIGNS) {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    if (sm <= em) {
      if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em)) return sign;
    } else {
      if ((month === sm && day >= sd) || month > sm || (month === em && day <= ed)) return sign;
    }
  }
  return null;
}

function revealZodiac() {
  const month = document.getElementById('birth-month').value;
  const day   = document.getElementById('birth-day').value;
  const resultEl = document.getElementById('zodiac-result');

  if (!month || !day) {
    resultEl.innerHTML = '<p style="color:#c9a84c">Please select your birth month and day.</p>';
    resultEl.classList.remove('hidden');
    return;
  }

  const sign = getZodiacSign(month, day);
  if (!sign) return;

  resultEl.innerHTML = `
    <div class="result-sign">${sign.glyph}</div>
    <div class="result-name">${sign.name}</div>
    <div class="result-dates">${sign.element} sign · Ruled by ${sign.planet}</div>
    <div class="result-desc">${sign.desc}</div>
  `;
  resultEl.classList.remove('hidden');
  resultEl.style.animation = 'none';
  requestAnimationFrame(() => { resultEl.style.animation = 'fadeInUp 0.5s ease'; });
}

// ═══════════════════════════════════════════════
//  NUMEROLOGY / LIFE PATH
// ═══════════════════════════════════════════════
function reduceNumber(n) {
  if (n === 11 || n === 22 || n === 33) return n;
  const sum = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
  return sum > 9 && sum !== 11 && sum !== 22 && sum !== 33 ? reduceNumber(sum) : sum;
}

function calcLifePath(month, day, year) {
  const m = reduceNumber(parseInt(month));
  const d = reduceNumber(parseInt(day));
  const y = reduceNumber(String(year).split('').reduce((a, c) => a + parseInt(c), 0));
  return reduceNumber(m + d + y);
}

function revealLifePath() {
  const month = document.getElementById('num-month').value;
  const day   = document.getElementById('num-day').value;
  const year  = document.getElementById('num-year').value;
  const resultEl = document.getElementById('life-path-result');

  if (!month || !day || !year) {
    resultEl.innerHTML = '<p style="color:#c9a84c">Please select your complete birth date.</p>';
    resultEl.classList.remove('hidden');
    return;
  }

  const num  = calcLifePath(month, day, year);
  const data = LIFE_PATH_DATA[num] || { word:'Unknown', desc:'A rare and powerful number.' };

  resultEl.innerHTML = `
    <span class="lp-result-num">${num}</span>
    <div class="lp-result-word">${data.word}</div>
    <div class="lp-result-desc">${data.desc}</div>
  `;
  resultEl.classList.remove('hidden');
}

function resetLifePath() {
  document.getElementById('num-month').value = '';
  document.getElementById('num-day').value   = '';
  document.getElementById('num-year').value  = '';
  document.getElementById('life-path-result').classList.add('hidden');
}

// ═══════════════════════════════════════════════
//  TAROT TABS
// ═══════════════════════════════════════════════
function renderTarot(type) {
  const grid = document.getElementById('tarot-grid');
  const cards = TAROT_DATA[type] || [];
  grid.innerHTML = cards.map(c => `
    <div class="tarot-card reveal">
      <div class="tarot-card-img">${c.emoji}</div>
      <div class="tarot-card-body">
        <div class="tarot-card-num">${c.num}</div>
        <div class="tarot-card-name">${c.name}</div>
        <a href="#" class="tarot-card-link">View Meaning →</a>
      </div>
    </div>
  `).join('');
  observeReveal();
}

document.querySelectorAll('.tarot-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tarot-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderTarot(tab.dataset.tab);
  });
});

// ═══════════════════════════════════════════════
//  SCROLL REVEAL
// ═══════════════════════════════════════════════
function observeReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

// Add reveal class to major grid items
document.querySelectorAll(
  '.zodiac-card, .chinese-card, .angel-card, .lp-item, .blog-card'
).forEach(el => el.classList.add('reveal'));

observeReveal();

// ═══════════════════════════════════════════════
//  MOBILE MENU
// ═══════════════════════════════════════════════
const menuToggle = document.querySelector('.menu-toggle');
const mainNav    = document.querySelector('.main-nav');

menuToggle && menuToggle.addEventListener('click', () => {
  const open = mainNav.style.display === 'block';
  mainNav.style.display = open ? 'none' : 'block';
  if (!open) {
    mainNav.style.position = 'fixed';
    mainNav.style.top = '68px';
    mainNav.style.left = '0'; mainNav.style.right = '0';
    mainNav.style.background = 'rgba(11,13,26,0.97)';
    mainNav.style.padding = '16px 24px 24px';
    mainNav.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
    mainNav.style.backdropFilter = 'blur(20px)';
    mainNav.style.zIndex = '99';
    document.querySelector('.nav-list').style.flexDirection = 'column';
    document.querySelector('.nav-list').style.gap = '4px';
    document.querySelector('.nav-list').style.alignItems = 'flex-start';
  }
});

// ═══════════════════════════════════════════════
//  HEADER SCROLL EFFECT
// ═══════════════════════════════════════════════
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (window.scrollY > 60) {
    header.style.background = 'rgba(11,13,26,0.97)';
  } else {
    header.style.background = 'rgba(11,13,26,0.85)';
  }
}, { passive: true });

// ═══════════════════════════════════════════════
//  NEWSLETTER
// ═══════════════════════════════════════════════
function subscribeNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const btn   = e.target.querySelector('button');
  btn.textContent = 'Subscribed ✦';
  btn.style.background = 'linear-gradient(135deg, #4a9a5e, #2d6b3d)';
  input.value = '';
  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
  }, 4000);
}

// ═══════════════════════════════════════════════
//  CSS ANIMATION KEYFRAMES (injected)
// ═══════════════════════════════════════════════
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;
document.head.appendChild(style);

// ═══════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════
renderTarot('major');
