# Astro Ashwini — website & store

A static, mobile-first, app-style website for **Ashwini Patwardhan** (astroashwini.com),
with a shop for zodiac bracelets and Rudraksha.

No build step, no framework, no npm install. Open `index.html` or upload the folder
to any static host (Vercel, Netlify, Hostinger, cPanel, GitHub Pages).

---

## 1. Quick start

```bash
# any static server works — this one needs nothing installed but Python
python3 -m http.server 8000
# then open http://localhost:8000
```

Open it over `http://` or `https://`, **not** by double-clicking the file — the
service worker and some browser APIs do not run from `file://`.

---

## 2. ⚠ Two things to change before going live

### 2.1 Product photos

There are **no product images in the repo**. Until a real photograph exists,
each product shows a **ghost frame** — a neutral 4:5 panel carrying its monoline
zodiac or rudraksha mark and the caption "Photography in progress".

That is deliberate. An honest placeholder reads better than a fabricated product
shot, and it tells a visitor exactly where things stand.

**To add real photos:** drop a JPG into `assets/products/` named after the
product id. It appears immediately — no code changes, no config.

| Put your photo here | It replaces |
|---|---|
| `assets/products/bracelet-aries.jpg` … `bracelet-pisces.jpg` | the 12 zodiac bracelets |
| `assets/products/rudraksha-1-mukhi.jpg` … `rudraksha-14-mukhi.jpg` | the 14 Rudraksha |
| `assets/products/rudraksha-mala-108.jpg` | 108 bead mala |
| `assets/products/rudraksha-siddha-mala.jpg` | Siddha mala |
| `assets/products/combo-rudraksha-tiger-eye.jpg` | Rudraksha + Tiger Eye |
| `assets/products/combo-seven-chakra.jpg` | Seven Chakra bracelet |

The full id list is in `assets/js/data.js`; `assets/products/README.md` repeats
this table next to the folder itself.

**Photo guidance:** **4:5 portrait** (e.g. 1200 × 1500 — the frame crops to 4:5),
plain undistracting background, piece centred with room around it, no baked-in
drop shadows. Warm neutral backgrounds sit best against the site's paper tone.

Mechanically: each product image starts hidden and is revealed only once it
actually loads, so a missing file simply leaves the ghost showing. No broken-image
icon can ever appear, and it does not matter when a lazy image fetches.

### 2.2 Prices

The prices in `assets/js/data.js` are **placeholders**. Search the file for
`BRACELET_PRICES` (the 12 bracelets) and `MUKHI` (`price:` on each Rudraksha),
plus the four items in `specialProducts`. `mrp` is the struck-through
"was" price and drives the "% off" badge.

---

## 3. Business details

Everything else lives in **`assets/js/config.js`** — phone, WhatsApp number,
address, Instagram, free-delivery threshold, delivery charge. Edit that one file;
every page picks it up.

---

## 4. Razorpay setup

The checkout is wired for Razorpay but ships **disabled**, so orders currently go
to WhatsApp with all the details pre-filled. That works today with no server.

To take card/UPI payments online you need a small backend, because Razorpay
requires two server-side steps. **The Key Secret must never appear in this
folder or anywhere the browser can read it.**

### Step 1 — get your keys
1. Sign up at <https://dashboard.razorpay.com> and finish KYC.
2. **Settings → API Keys → Generate Key**.
3. You get a **Key ID** (`rzp_test_…` / `rzp_live_…`) and a **Key Secret**.

### Step 2 — deploy the endpoint

Example for Vercel — save as `api/razorpay/order.js`:

```js
import Razorpay from 'razorpay';
import crypto from 'crypto';

// The catalogue must also exist server-side so the browser cannot dictate prices.
import { PRICES } from './prices.js';   // { 'bracelet-leo': 1699, ... }

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET   // env var only, never in git
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { items } = req.body;

  // Recompute the amount from your own prices — never trust the client total.
  let subtotal = 0;
  for (const { id, qty } of items) {
    const price = PRICES[id];
    if (!price) return res.status(400).json({ error: 'unknown item ' + id });
    subtotal += price * Math.max(1, Math.min(99, qty | 0));
  }
  const shipping = subtotal >= 1500 ? 0 : 79;
  const amount = (subtotal + shipping) * 100;        // Razorpay works in paise

  const order = await rzp.orders.create({ amount, currency: 'INR', receipt: 'rcpt_' + Date.now() });
  res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
}
```

And `api/razorpay/verify.js`:

```js
import crypto from 'crypto';

export default function handler(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (expected !== razorpay_signature) return res.status(400).json({ ok: false });
  // TODO: mark the order paid, email Ashwini, email the customer
  res.json({ ok: true });
}
```

Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` as environment variables on your host.

### Step 3 — switch it on

In `assets/js/config.js`:

```js
razorpay: {
  enabled: true,
  keyId: 'rzp_test_xxxxxxxxxxxx',        // Key ID only — never the secret
  createOrderUrl: '/api/razorpay/order',
  verifyUrl: '/api/razorpay/verify',
  themeColor: '#A2462A'
}
```

Test with Razorpay's test cards first (card `4111 1111 1111 1111`, any future
expiry, any CVV). Switch to the `rzp_live_` key only after a successful test run.

**If the gateway is ever unreachable the checkout offers WhatsApp instead**, so a
misconfigured key never costs a sale.

---

## 4a. Deploying

The site is static with no build step, so any host works. It is set up for Vercel.

### Import it (one time, ~2 minutes)

1. <https://vercel.com/new> → **Import Git Repository** → `Harsh-voice/astrology-demo`.
   If it is not listed, use **Adjust GitHub App Permissions** and grant access.
2. **Framework Preset: Other.** Leave Build Command, Output Directory and
   Install Command **empty** — `vercel.json` already sets caching and security
   headers, and there is nothing to build.
3. Deploy.

Every push to the production branch redeploys automatically after that.

> Make sure the repository's default branch is **`main`** (GitHub → Settings →
> Branches). The old default, `claude/zealous-rubin-0bhz4z`, holds an unrelated
> early prototype — Vercel would deploy that instead.

### Demo mode vs live mode

**This build ships in demo mode and is deliberately invisible to Google.**
Every page carries `noindex,nofollow`, the canonical tags are removed and
`robots.txt` is `Disallow: /`.

That is on purpose. The canonicals point at `https://astroashwini.com/`, which
still serves her old WordPress site — publishing them from a `vercel.app` URL
would tell Google the real version of each page is somewhere else, with
different content. A demo should never compete with the live site.

When she is ready to go live on her own domain:

```bash
node tools/site-mode.mjs live https://astroashwini.com
git commit -am "Go live" && git push
```

That restores the canonicals, regenerates `sitemap.xml` from the real catalogue,
restores `robots.txt`, and makes `og:image` and the `LocalBusiness` schema `@id`
absolute. To go back:

```bash
node tools/site-mode.mjs demo
```

Both modes take an optional domain (`node tools/site-mode.mjs demo https://…`)
which stamps `og:image` as an absolute URL — worth doing once you know the
deploy URL, because WhatsApp will not resolve a relative one when the link is
shared.

The script has no dependencies and is idempotent.

---

## 5. Structure

```
index.html          Home
shop.html           Store — filter by category and zodiac sign, search, sort
product.html        Product detail (?id=bracelet-leo)
services.html       The 8 services
about.html          Ashwini's background, courses, reviews
contact.html        Address, map, booking form → WhatsApp
checkout.html       Delivery details + payment

assets/css/app.css      Design system (all styling)
assets/css/fonts.css    Self-hosted fonts — no third-party requests
assets/js/config.js     ← business details + Razorpay keys
assets/js/data.js       ← products, prices, services, reviews
assets/js/icons.js      Monoline SVG sprite (12 zodiac marks + UI icons)
assets/js/app.js        App shell: nav, cart, drawer, toasts, ghost frames, PWA
assets/js/cards.js      Product card template
assets/js/{home,shop,product,services,about,contact,checkout}.js
assets/img/             Brand photos and artwork (from astroashwini.com)
assets/products/        Product photos — drop them here (currently empty)
assets/icons/           App icons
tools/site-mode.mjs     Switch between demo (noindex) and live — see "Deploying"
vercel.json             Static-host config: caching + security headers
manifest.webmanifest    PWA — installable to a phone home screen
sw.js                   Service worker — offline support
sitemap.xml, robots.txt SEO
```

---

## 6. Design system

Editorial and restrained — closer to a fashion house than a template. Everything
is driven by CSS custom properties at the top of `assets/css/app.css`.

### Colour

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F7F3EC` | page base |
| `--paper-2` | `#EDE7DC` | image wells, ghost frames |
| `--night` | `#121010` | dark panels + footer (warm black) |
| `--ink` | `#121010` | primary text |
| `--ink-soft` | `#46403A` | body text |
| `--muted` | `#6E6760` | labels, captions |
| `--clay` | `#A2462A` | the one accent |
| `--brass` | `#B08D57` | hairlines and rules only |
| `--brass-ink` | `#866A3F` | section numerals |
| `--hair` | `rgba(18,16,16,.12)` | every border |

Rules the system holds to: the accent never exceeds roughly 5% of a viewport,
there are **no gradients and no glows anywhere**, exactly **one box-shadow** in the
whole stylesheet (a 1px hairline under the sticky buy bar), every border is a 1px
hairline, and a dark panel appears at most twice per page (one band plus the footer).

Border radius is 2px on images and inputs, 0 everywhere else.

### Typography

- **Fraunces** (variable — `opsz`, `wght`, `SOFT`) for display, weights **300–500 only**.
  Optical sizing is automatic; `SOFT` is set to 20 for warmth.
- **General Sans** (variable 200–700) for UI and body.
- Both self-hosted as WOFF2. Three files, 268 KB. No Google Fonts request.
- Body measure capped at 64ch. Prices use `tabular-nums` and a thin space (U+2009)
  after the rupee sign. Form inputs stay at 16px so iOS does not zoom on focus.

### Motion

One easing curve (`cubic-bezier(.22,1,.36,1)`), one duration (480ms), and only two
properties animate: opacity and a 12px translateY. No scale, bounce, spring or
rotate. Scroll reveals stagger 70ms, fire once, trigger at 15% visibility, and are
fully disabled under `prefers-reduced-motion`.

### Iconography

The 12 zodiac marks and every UI icon are a hand-drawn monoline SVG sprite
(`assets/js/icons.js`), injected once and referenced with `<use>`. No Unicode
zodiac characters appear anywhere, which removes the emoji-presentation problem
at its source rather than patching it.

## 6a. Also built in

- **App-style shell** — fixed top bar, bottom tab bar on mobile, top nav from 900px.
- **Cart** — persists in `localStorage`, bottom sheet on phones, side panel from 600px.
- **Responsive 280px → 4K** — verified at 280, 360, 393, 412, 673, 900, 1440 and
  1920 with no horizontal overflow, and iOS safe-area insets handled for the notch
  and home indicator.
- **PWA** — installable, works offline, opens without browser chrome.
- **SEO** — per-page titles and descriptions, canonical URLs, Open Graph,
  `LocalBusiness` structured data with her real rating, sitemap covering all 30 products.
- **Accessibility** — every text colour meets WCAG AA contrast (verified by
  calculation, not by eye), tap targets ≥40px, visible 2px focus rings in `--clay`,
  `aria` labels on icon controls, `prefers-reduced-motion` and `prefers-contrast`
  respected.

## 7. Content sources

Copy, services, courses, reviews, address and phone were taken from the live
astroashwini.com. Brand assets (the zodiac mandala logo, the Leo lion artwork,
her photographs and the service icons) were downloaded from that site and
optimised — the 2.8 MB logo mark is now 116 KB, the 4.9 MB lion 60 KB.

The 12 reviews are her real Google reviews, shown verbatim.

One open art-direction question: the Leo lion artwork is her own brand asset but
it is navy-and-gold, which is the loudest thing on an otherwise warm, light page.
It has been kept because it is genuinely hers — but a photograph would sit better
in this system if she has one she likes.
