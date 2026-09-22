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

Every product shows `assets/products/<id>.jpg`. Those files are currently
**placeholder illustrations** generated for layout. To use real photos, drop a
JPG in `assets/products/` with **exactly the same filename** — nothing else to change.

| Put your photo here | It replaces |
|---|---|
| `assets/products/bracelet-aries.jpg` | Aries bracelet |
| `assets/products/bracelet-taurus.jpg` … `bracelet-pisces.jpg` | the other 11 signs |
| `assets/products/rudraksha-1-mukhi.jpg` … `rudraksha-14-mukhi.jpg` | the 14 Rudraksha |
| `assets/products/rudraksha-mala-108.jpg` | 108 bead mala |
| `assets/products/rudraksha-siddha-mala.jpg` | Siddha mala |
| `assets/products/combo-rudraksha-tiger-eye.jpg` | Rudraksha + Tiger Eye |
| `assets/products/combo-seven-chakra.jpg` | Seven Chakra bracelet |

Run `ls assets/products` for the full list.

**Photo guidance:** square (1:1), at least 900×900, shot on a plain dark or white
background. The card crops to a square, so keep the bracelet centred.

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
  themeColor: '#d4a14a'
}
```

Test with Razorpay's test cards first (card `4111 1111 1111 1111`, any future
expiry, any CVV). Switch to the `rzp_live_` key only after a successful test run.

**If the gateway is ever unreachable the checkout offers WhatsApp instead**, so a
misconfigured key never costs a sale.

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
assets/css/fonts.css    Self-hosted fonts — no Google Fonts request
assets/js/config.js     ← business details + Razorpay keys
assets/js/data.js       ← products, prices, services, reviews
assets/js/app.js        App shell: nav, cart, drawer, toasts, PWA
assets/js/cards.js      Product card template
assets/js/{home,shop,product,services,about,contact,checkout}.js
assets/img/             Brand photos and artwork (from astroashwini.com)
assets/products/        Product photos — drop replacements here
assets/icons/           App icons and service icons
manifest.webmanifest    PWA — installable to a phone home screen
sw.js                   Service worker — offline support
sitemap.xml, robots.txt SEO
```

---

## 6. What was built in

- **App-style shell** — fixed top bar, bottom tab bar on mobile, top nav on desktop.
- **Cart** — persists in `localStorage`, bottom sheet on phones, side panel from 600px up.
- **Responsive from 280px to 4K** — verified on Galaxy Fold (closed and open),
  iPhone 15 Pro, Galaxy S24/S25 Ultra and desktop, with iOS safe-area insets
  handled for the notch and home indicator.
- **PWA** — installable, works offline, opens without browser chrome.
- **SEO** — per-page titles and descriptions, canonical URLs, Open Graph,
  `LocalBusiness` structured data with her real rating, sitemap covering all 30 products.
- **Accessibility** — 44px+ touch targets, visible focus rings, `aria` labels on
  icon buttons, `prefers-reduced-motion` and `prefers-contrast` respected,
  16px form inputs so iOS doesn't zoom on focus.

---

## 7. Content sources

Copy, services, courses, reviews, address and phone were taken from the live
astroashwini.com. Brand assets (the zodiac mandala logo, the Leo lion artwork,
her photographs and the service icons) were downloaded from that site and
optimised — the 2.8 MB logo is now 69 KB, the 4.9 MB lion 56 KB.

The 12 reviews are her real Google reviews, shown verbatim.
