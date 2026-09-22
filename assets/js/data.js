/* ═══════════════════════════════════════════════════════════════
   ASTRO ASHWINI — CATALOGUE & CONTENT
   ───────────────────────────────────────────────────────────────
   ⚠  PRICES BELOW ARE PLACEHOLDERS. Replace `price` / `mrp` with
      Ashwini's real pricing before going live.
   ⚠  PRODUCT PHOTOS: each product points at assets/products/<id>.jpg
      Drop a real photo in with exactly that filename and it appears
      automatically — no code changes needed. See README.md.
   ═══════════════════════════════════════════════════════════════ */

/* ---------- Zodiac reference data ---------- */
const ZODIAC = [
  { key:'aries',      sign:'Aries',       hi:'Mesh',       glyph:'♈', dates:'Mar 21 – Apr 19', ruler:'Mars',    element:'Fire',  stone:'Red Jasper',      traits:['Bold','Driven','Pioneering'] },
  { key:'taurus',     sign:'Taurus',      hi:'Vrishabha',  glyph:'♉', dates:'Apr 20 – May 20', ruler:'Venus',   element:'Earth', stone:'Rose Quartz',     traits:['Steady','Loyal','Grounded'] },
  { key:'gemini',     sign:'Gemini',      hi:'Mithuna',    glyph:'♊', dates:'May 21 – Jun 20', ruler:'Mercury', element:'Air',   stone:'Green Aventurine',traits:['Quick','Curious','Expressive'] },
  { key:'cancer',     sign:'Cancer',      hi:'Karka',      glyph:'♋', dates:'Jun 21 – Jul 22', ruler:'Moon',    element:'Water', stone:'Moonstone',       traits:['Intuitive','Caring','Protective'] },
  { key:'leo',        sign:'Leo',         hi:'Simha',      glyph:'♌', dates:'Jul 23 – Aug 22', ruler:'Sun',     element:'Fire',  stone:'Tiger Eye',       traits:['Radiant','Confident','Generous'] },
  { key:'virgo',      sign:'Virgo',       hi:'Kanya',      glyph:'♍', dates:'Aug 23 – Sep 22', ruler:'Mercury', element:'Earth', stone:'Amazonite',       traits:['Precise','Analytical','Devoted'] },
  { key:'libra',      sign:'Libra',       hi:'Tula',       glyph:'♎', dates:'Sep 23 – Oct 22', ruler:'Venus',   element:'Air',   stone:'Lapis Lazuli',    traits:['Balanced','Charming','Fair'] },
  { key:'scorpio',    sign:'Scorpio',     hi:'Vrischika',  glyph:'♏', dates:'Oct 23 – Nov 21', ruler:'Mars',    element:'Water', stone:'Black Onyx',      traits:['Intense','Magnetic','Resilient'] },
  { key:'sagittarius',sign:'Sagittarius', hi:'Dhanu',      glyph:'♐', dates:'Nov 22 – Dec 21', ruler:'Jupiter', element:'Fire',  stone:'Amethyst',        traits:['Free','Optimistic','Seeking'] },
  { key:'capricorn',  sign:'Capricorn',   hi:'Makara',     glyph:'♑', dates:'Dec 22 – Jan 19', ruler:'Saturn',  element:'Earth', stone:'Garnet',          traits:['Disciplined','Ambitious','Patient'] },
  { key:'aquarius',   sign:'Aquarius',    hi:'Kumbha',     glyph:'♒', dates:'Jan 20 – Feb 18', ruler:'Saturn',  element:'Air',   stone:'Blue Sodalite',   traits:['Original','Humane','Visionary'] },
  { key:'pisces',     sign:'Pisces',      hi:'Meena',      glyph:'♓', dates:'Feb 19 – Mar 20', ruler:'Jupiter', element:'Water', stone:'Aquamarine',      traits:['Gentle','Creative','Compassionate'] }
];

/* ---------- Zodiac bracelets ---------- */
const BRACELET_PRICES = { // PLACEHOLDER pricing
  aries:1499, taurus:1599, gemini:1499, cancer:1799, leo:1699, virgo:1549,
  libra:1899, scorpio:1449, sagittarius:1749, capricorn:1649, aquarius:1599, pisces:1699
};

const braceletProducts = ZODIAC.map(z => ({
  id: 'bracelet-' + z.key,
  name: z.sign + ' Zodiac Bracelet',
  category: 'bracelet',
  categoryLabel: 'Zodiac Bracelet',
  zodiac: z.key,
  sign: z.sign,
  hindi: z.hi,
  glyph: z.glyph,
  stone: z.stone,
  ruler: z.ruler,
  element: z.element,
  dates: z.dates,
  traits: z.traits,
  beadSize: '8 mm',
  price: BRACELET_PRICES[z.key],
  mrp: Math.round(BRACELET_PRICES[z.key] * 1.45 / 50) * 50,
  img: 'assets/products/bracelet-' + z.key + '.jpg',
  rating: 4.7 + (z.key.length % 3) / 10,
  reviews: 18 + (z.key.charCodeAt(0) % 40),
  inStock: true,
  tagline: 'Energised for ' + z.sign + ' — ' + z.stone,
  desc: 'A hand-knotted ' + z.stone + ' bracelet cut to 8 mm beads and charged for ' +
        z.sign + ' (' + z.hi + '). ' + z.stone + ' is the stone Ashwini most often recommends for ' +
        z.sign + ' natives, whose chart is ruled by ' + z.ruler + ' under the ' + z.element.toLowerCase() +
        ' element. Worn on the working hand, it is meant to steady the ' + z.ruler +
        ' influence and support the qualities ' + z.sign + ' already carries naturally.',
  benefits: [
    'Chosen for ' + z.sign + ' natives ruled by ' + z.ruler,
    'Natural ' + z.stone + ', 8 mm round beads',
    'Energised before dispatch with the ' + z.ruler + ' mantra',
    'Strung on durable elastic — slips on, no clasp'
  ],
  care: 'Keep away from perfume and harsh soap. Wipe with a dry cloth. Remove before bathing or swimming.',
  wearing: 'Wear on the right wrist for action and drive, left wrist for calm and receptivity. Best started on a ' +
           ({Sun:'Sunday',Moon:'Monday',Mars:'Tuesday',Mercury:'Wednesday',Jupiter:'Thursday',Venus:'Friday',Saturn:'Saturday'})[z.ruler] + ' morning.'
}));

/* ---------- Rudraksha ---------- */
const MUKHI = [
  { n:1,  hi:'Ek Mukhi',      deity:'Shiva',            planet:'Sun',        price:5999, for:'Leadership, clarity of purpose, detachment from clutter' },
  { n:2,  hi:'Do Mukhi',      deity:'Ardhanarishvara',  planet:'Moon',       price:1299, for:'Harmony in marriage and partnerships, emotional balance' },
  { n:3,  hi:'Teen Mukhi',    deity:'Agni',             planet:'Mars',       price:1199, for:'Releasing past guilt, confidence, digestive fire' },
  { n:4,  hi:'Char Mukhi',    deity:'Brahma',           planet:'Mercury',    price:1099, for:'Focus, study, speech and creative expression' },
  { n:5,  hi:'Panch Mukhi',   deity:'Kalagni Rudra',    planet:'Jupiter',    price:799,  for:'Calm mind, general wellbeing — the most widely worn bead' },
  { n:6,  hi:'Chhah Mukhi',   deity:'Kartikeya',        planet:'Venus',      price:1399, for:'Willpower, grounding, relief from restlessness' },
  { n:7,  hi:'Saat Mukhi',    deity:'Mahalakshmi',      planet:'Saturn',     price:1599, for:'Steady finances, relief from Saturn periods' },
  { n:8,  hi:'Aath Mukhi',    deity:'Ganesha',          planet:'Rahu',       price:1899, for:'Clearing obstacles before a new venture' },
  { n:9,  hi:'Nau Mukhi',     deity:'Durga',            planet:'Ketu',       price:2199, for:'Courage, protection, freedom from fear' },
  { n:10, hi:'Das Mukhi',     deity:'Vishnu',           planet:'All Grahas', price:2499, for:'All-round shielding, peace at home' },
  { n:11, hi:'Gyarah Mukhi',  deity:'Hanuman',          planet:'Courage',    price:2899, for:'Strength of mind, discipline, steady practice' },
  { n:12, hi:'Barah Mukhi',   deity:'Surya',            planet:'Sun',        price:3299, for:'Radiance, authority, recognition at work' },
  { n:13, hi:'Terah Mukhi',   deity:'Kamadeva',         planet:'Venus',      price:3999, for:'Charisma, persuasion, magnetism' },
  { n:14, hi:'Chaudah Mukhi', deity:'Hanuman',          planet:'Mars/Saturn',price:6499, for:'Intuition and decision-making — the "Deva Mani"' }
];

const rudrakshaProducts = MUKHI.map(m => ({
  id: 'rudraksha-' + m.n + '-mukhi',
  name: m.n + ' Mukhi Rudraksha',
  category: 'rudraksha',
  categoryLabel: 'Rudraksha',
  mukhi: m.n,
  hindi: m.hi,
  glyph: 'ॐ',
  deity: m.deity,
  ruler: m.planet,
  origin: 'Nepal',
  price: m.price,
  mrp: Math.round(m.price * 1.4 / 50) * 50,
  img: 'assets/products/rudraksha-' + m.n + '-mukhi.jpg',
  rating: 4.6 + (m.n % 4) / 10,
  reviews: 12 + (m.n * 3) % 45,
  inStock: true,
  tagline: m.hi + ' · ' + m.deity,
  desc: 'A certified ' + m.n + '-faced (' + m.hi + ') Rudraksha of Nepali origin, presided over by ' +
        m.deity + ' and linked to ' + m.planet + '. Every bead is checked by hand for clean, unbroken ' +
        'mukhi lines before it leaves the studio, and is energised with its seed mantra. ' +
        'Traditionally recommended for: ' + m.for.toLowerCase() + '.',
  benefits: [
    'Traditionally worn for: ' + m.for,
    'Presided over by ' + m.deity + ' · ' + m.planet,
    'Nepali origin, lab-certified, unbroken mukhi lines',
    'Energised with its seed mantra before dispatch'
  ],
  care: 'Oil lightly every few months with mustard or sesame oil. Do not soak. Remove before sleeping if it is a new bead.',
  wearing: 'Rudraksha is traditionally worn after a short purification. Ashwini advises which bead suits your chart — book a consultation if you are unsure.'
}));

/* ---------- Malas & combinations ---------- */
const specialProducts = [
  { id:'rudraksha-mala-108', name:'108 Bead Rudraksha Mala', category:'mala', categoryLabel:'Mala',
    glyph:'ॐ', hindi:'Japa Mala', ruler:'Jupiter', price:3499, mrp:4999,
    img:'assets/products/rudraksha-mala-108.jpg', rating:4.9, reviews:61, inStock:true,
    tagline:'Panch Mukhi · 108 + 1 beads',
    desc:'A full japa mala of 108 five-faced Rudraksha beads plus the sumeru, knotted by hand in cotton thread. ' +
         'Sized for comfortable chanting — the bead passes cleanly under the thumb without catching. ' +
         'This is the mala Ashwini recommends for daily practice regardless of your chart.',
    benefits:['108 + 1 sumeru, hand-knotted between beads','Uniform 7–8 mm Panch Mukhi beads','Cotton thread — no metal against the skin','Comes in a cotton pouch'],
    care:'Keep in its pouch when not in use. Oil lightly twice a year.',
    wearing:'Use for japa with the right hand, drawing beads over the middle finger with the thumb. Never cross the sumeru — turn back at it.' },

  { id:'rudraksha-siddha-mala', name:'Siddha Mala (1–14 Mukhi)', category:'mala', categoryLabel:'Mala',
    glyph:'ॐ', hindi:'Siddha Mala', ruler:'All Grahas', price:24999, mrp:34999,
    img:'assets/products/rudraksha-siddha-mala.jpg', rating:5.0, reviews:9, inStock:true,
    tagline:'Complete 1 to 14 Mukhi · made to order',
    desc:'The complete Siddha Mala carries one bead of every face from 1 to 14 Mukhi, covering all nine grahas in a ' +
         'single strand. Assembled to order — each bead is individually sourced and certified, so allow 2–3 weeks. ' +
         'Ashwini reviews your chart before assembly and adjusts bead sizing where a graha needs more weight.',
    benefits:['One bead of each mukhi, 1 through 14','Every bead individually certified','Chart reviewed before assembly','Made to order — 2 to 3 weeks'],
    care:'Oil lightly every three months. Store flat in the box provided.',
    wearing:'Worn around the neck so the strand rests over the heart. Ashwini will advise the start day for your chart.' },

  { id:'combo-rudraksha-tiger-eye', name:'Rudraksha + Tiger Eye Bracelet', category:'combo', categoryLabel:'Combination',
    glyph:'✦', hindi:'Suraksha Kavach', ruler:'Sun / Jupiter', price:1899, mrp:2699,
    img:'assets/products/combo-rudraksha-tiger-eye.jpg', rating:4.8, reviews:47, inStock:true,
    tagline:'Protection · Confidence',
    desc:'Alternating Panch Mukhi Rudraksha and natural Tiger Eye. The pairing is a favourite of Ashwini\'s for ' +
         'people who travel or negotiate for a living — Rudraksha to settle the mind, Tiger Eye to hold the nerve. ' +
         'A good first piece if you are not sure where to begin.',
    benefits:['Panch Mukhi Rudraksha with natural Tiger Eye','Suits every zodiac sign','Steadies nerves before travel or negotiation','8 mm beads on durable elastic'],
    care:'Keep away from perfume. Wipe dry after wearing.',
    wearing:'Wear on the right wrist. Any day is suitable — Thursday morning is considered best.' },

  { id:'combo-seven-chakra', name:'Seven Chakra Bracelet', category:'combo', categoryLabel:'Combination',
    glyph:'✧', hindi:'Sapta Chakra', ruler:'All', price:1299, mrp:1899,
    img:'assets/products/combo-seven-chakra.jpg', rating:4.7, reviews:88, inStock:true,
    tagline:'Balance · Alignment',
    desc:'Seven natural stones, one for each chakra, running root to crown: Red Jasper, Carnelian, Citrine, ' +
         'Green Aventurine, Lapis Lazuli, Amethyst and Clear Quartz. Worn when the aim is general balance ' +
         'rather than one specific planet — the everyday piece in the collection.',
    benefits:['Seven natural stones, root to crown','Suits every zodiac sign','The everyday balancing piece','8 mm beads on durable elastic'],
    care:'Keep away from perfume and harsh soap. Wipe with a dry cloth.',
    wearing:'Wear on either wrist. Start on a Monday for calm, a Sunday for energy.' }
];

/* ---------- Exported catalogue ---------- */
const PRODUCTS = [...braceletProducts, ...rudrakshaProducts, ...specialProducts];

const CATEGORIES = [
  { key:'all',       label:'All',        icon:'✦' },
  { key:'bracelet',  label:'Zodiac',     icon:'♌' },
  { key:'rudraksha', label:'Rudraksha',  icon:'ॐ' },
  { key:'mala',      label:'Malas',      icon:'📿' },
  { key:'combo',     label:'Combos',     icon:'✧' }
];

window.ZODIAC = ZODIAC;
window.PRODUCTS = PRODUCTS;
window.CATEGORIES = CATEGORIES;

/* ═══════════════════════════════════════════════════════════════
   SERVICES — copy taken from astroashwini.com
   ═══════════════════════════════════════════════════════════════ */
const SERVICES = [
  { key:'vaastu', name:'Vaastu', icon:'assets/icons/svc-triangular.png', glyph:'⌂',
    blurb:'We all hope for the best always and pray for calmness, peace and prosperity in our homes.',
    long:'Vastu Shastra reads a building the way a chart reads a life — by direction, proportion and placement. Ashwini surveys the site itself, correlates it against the horoscopes of the people living there, and prescribes corrections that can actually be carried out without demolition wherever possible.' },
  { key:'astrology', name:'Astrology', icon:'assets/icons/svc-waning-crescent-48.png', glyph:'☾',
    blurb:'Astrology is a language. If you understand this language, the sky speaks to you.',
    long:'A full Vedic reading of your birth chart — the placement of the grahas at the moment you were born, the dashas running now, and what they are asking of you. Ashwini is known for translating that into remedies simple enough to actually keep up.' },
  { key:'numerology', name:'Numerology', icon:'assets/icons/svc-numerology-50-1.png', glyph:'№',
    blurb:'Numerology projections will fascinate you for your entire life.',
    long:'Your name and date of birth reduce to numbers that repeat through your life in ways most people never notice until they are shown. Includes name-correction analysis where the numbers and the chart disagree.' },
  { key:'mobile-numerology', name:'Mobile Numerology', icon:'assets/icons/svc-dialpad-64.png', glyph:'☏',
    blurb:'Numerology is the bridge between who you are now and who you have the potential to be.',
    long:'The number you give out a dozen times a day carries its own vibration. Ashwini analyses your existing mobile number against your chart and suggests a combination that supports rather than fights it.' },
  { key:'horoscope', name:'Horoscope', icon:'assets/icons/svc-horoscope-100.png', glyph:'♈',
    blurb:'Horoscopes are written by astrologers who interpret the positions and movements of celestial bodies in relation to the zodiac signs.',
    long:'Year-ahead and period-specific horoscope readings covering career, health, finance and relationships, with the transits that matter marked out month by month.' },
  { key:'interior-design', name:'Interior Design', icon:'assets/icons/svc-interior-40.png', glyph:'◫',
    blurb:'Interior Vaastu is an ancient Indian architectural and design system that aims to create harmonious and balanced living spaces.',
    long:'Vastu-aligned interiors worked out with your architect or contractor — direction of beds and desks, colour and material choices, and the placement of kitchen, water and fire elements.' },
  { key:'kundali-matching', name:'Kundali Matching', icon:'assets/icons/svc-page-100.png', glyph:'⚭',
    blurb:'Detailed compatibility analysis between two charts before a marriage is fixed.',
    long:'Full Ashtakoota guna milan plus the factors the point-score alone misses — Mangal dosha, the state of the 7th house, and the dashas each person is about to enter. Ashwini gives a clear verdict, not a number.' },
  { key:'gemstone', name:'Gemstone Recommendation', icon:'assets/icons/svc-gemstone-64.png', glyph:'◈',
    blurb:'Suggesting a suitable gemstone for a person based on their date of birth, horoscope, and astrological principles.',
    long:'The wrong stone does nothing; the wrong stone worn confidently can do worse. Ashwini identifies which graha needs strengthening in your chart, then specifies the stone, the weight, the metal and the day to begin.' }
];

/* ---------- Courses ---------- */
const COURSES = [
  { name:'Astrology', level:'Foundation to Advanced', img:'assets/img/cosmic-1.jpg',
    desc:'From reading a chart to calling a dasha. Taught in small batches with live chart work from the first session.' },
  { name:'Horoscope', level:'Practitioner track', img:'assets/img/cosmic-3.jpg',
    desc:'Predictive technique — transits, periods and timing — for students who already read a chart and want to forecast with it.' },
  { name:'Vaastu', level:'Foundation Course', img:'assets/img/course-classroom.jpg',
    desc:'The Vastu Foundation Course Ashwini teaches in Pune: directions, proportion, site survey method and practical correction.' }
];

/* ═══════════════════════════════════════════════════════════════
   REVIEWS — verbatim from her Google Business profile
   ═══════════════════════════════════════════════════════════════ */
const REVIEWS = [
  { name:'himani garg', date:'31 Jan 2024', stars:5,
    text:'Exceptional service! The best astrologer in Pune with profound knowledge. Consulted her multiple times, and each session has been exceptional' },
  { name:'Priti Garg', date:'30 Jan 2024', stars:5,
    text:'Astro Ashwini is an absolute gem in the world of astrology! Her profound knowledge and accurate predictions have truly amazed me. The personalized attention she provides to each client sets her apart, making the entire experience not just informative but also deeply insightful. I wholeheartedly recommend Astro Ashwini to anyone seeking guidance on their life path.' },
  { name:'RTX 2060 Super', date:'26 Jan 2024', stars:5,
    text:'I had the pleasure of consulting with Astro Ashwini, and I must say she exceeded my expectations. Her expertise in astrology shines through, and her predictions were spot-on. What impressed me the most was her genuine concern and commitment to helping others.' },
  { name:'akansha gupta', date:'25 Jan 2024', stars:5,
    text:'Astro Ashwini is a true master of her craft! I was blown away by the accuracy and depth of her astrological insights. Her ability to communicate complex astrological concepts in a way that is easy to understand is truly commendable.' },
  { name:'Aman Garg', date:'24 Jan 2024', stars:5,
    text:'I had the privilege of receiving a Kundali report from Astro Ashwini, and the level of detail and precision was outstanding. The predictions were not only accurate but also delivered with a genuine passion for helping others.' },
  { name:'Penzar Merchant', date:'10 Jan 2024', stars:5,
    text:'Astrologer Ashwini is truly exceptional. Her insightful readings go beyond traditional horoscopes, offering profound guidance and accurate predictions. With a compassionate approach, she provides clarity on life\'s complexities, helping clients navigate challenges.' },
  { name:'santosh ingale', date:'24 Jun 2023', stars:5,
    text:'Your consultation was very hopeful & positive. You give proper time & guidance to me. Your suggestions and solutions on my problems are very much manageable. You have given me a lot of positivity. I feel confident after taking your consultation.' },
  { name:'Saurabh Singh', date:'25 May 2023', stars:5,
    text:'Her expertise as a Vedic astrologer, Vastu Acharya, master numerologist, and gemstone expert truly exceeded my expectations. What sets Astro Ashwini apart is her holistic approach — she not only focuses on astrology but also takes into consideration Vastu Shastra and numerology.' },
  { name:'olive', date:'22 May 2023', stars:5,
    text:'One of the best astrologers I have ever spoken to. Her immense knowledge and understanding of astrology has helped me clear all my doubts and queries for my future' },
  { name:'Arshia Fab', date:'22 May 2023', stars:5,
    text:'Best astrologer ever — very kind, all the remedies she gave worked. She did tarot cards as well with me and that worked excellently. If you are looking for an astrologer, she is the one' },
  { name:'pratik mittal', date:'25 Feb 2023', stars:5,
    text:'One of the best Vedic astrologers with in-depth knowledge of the subject. Gives detailed guidance in a way where one can genuinely relate to past incidents and future predictions. She is one of the best out there.' },
  { name:'nawab-e-ghummakkad', date:'30 Jan 2024', stars:5,
    text:'Awesome experience with Astro Ashwini. She is very professional in the field of astrology! I would recommend her.' }
];

window.SERVICES = SERVICES;
window.COURSES = COURSES;
window.REVIEWS = REVIEWS;
