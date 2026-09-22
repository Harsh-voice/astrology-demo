/* ═══════════════════════════════════════════════════════════════
   CHECKOUT — Razorpay, with an automatic WhatsApp fallback.

   Razorpay's standard flow is:
     1. browser POSTs the cart to YOUR server
     2. server recomputes the amount, calls Razorpay Orders API with the
        Key Secret, returns { orderId, amount }
     3. browser opens Razorpay Checkout with that orderId
     4. on success Razorpay returns a signature, which YOUR server
        verifies with the Key Secret before marking the order paid

   Steps 2 and 4 CANNOT happen in the browser — the Key Secret must never
   be shipped to a client. See README.md for a ready-to-deploy endpoint.
   Until that endpoint exists, `enabled:false` in config.js keeps the shop
   working by sending the order to WhatsApp instead.
   ═══════════════════════════════════════════════════════════════ */
(function () {
'use strict';
window.AA.onReady(function () {
const A = window.AA, $ = A.$, $$ = A.$$;
const CFG = window.ASTRO_CONFIG || {};
const RZP = CFG.razorpay || {};
const root = $('#checkout'); if (!root) return;

const online = () => RZP.enabled && !!RZP.keyId;

/* ---------- summary ---------- */
function renderSummary() {
  const box = $('#summary');
  const lines = window.Cart.detailed();

  if (!lines.length) {
    root.innerHTML = `
      <div class="empty" style="grid-column:1/-1">
        <svg class="empty__mark" aria-hidden="true"><use href="#c-star"/></svg>
        <h2 style="margin-bottom:var(--sp-3)">Your cart is empty</h2>
        <p class="muted" style="margin-bottom:var(--sp-6)">Add a piece before checking out.</p>
        <a class="btn btn--primary" href="shop.html">Browse the collection</a>
      </div>`;
    return false;
  }

  const ship = window.Cart.shipping();
  box.innerHTML = `
    ${lines.map(p => `
      <div class="cart-line">
        <span class="has-ghost" style="position:relative;width:64px;height:80px;flex:none">
          ${A.ghostFrame(p, true)}
          <img class="cart-line__img" src="${A.esc(p.img)}" alt="" loading="lazy" decoding="async"
               style="position:absolute;inset:0;z-index:1">
        </span>
        <div class="cart-line__info">
          <span class="cart-line__name">${A.esc(p.name)}</span>
          <span class="muted" style="font-size:var(--fs-xs)">Qty ${p.qty} × ${A.money(p.price)}</span>
          <span class="cart-line__price">${A.money(p.price * p.qty)}</span>
        </div>
      </div>`).join('')}
    <div class="mt-6">
      <div class="sum-row"><span>Subtotal</span><span>${A.money(window.Cart.subtotal())}</span></div>
      <div class="sum-row"><span>Delivery</span><span>${ship === 0 ? 'Free' : A.money(ship)}</span></div>
      <div class="sum-row sum-row--total"><span>Total</span><b>${A.money(window.Cart.total())}</b></div>
    </div>`;
  return true;
}

if (!renderSummary()) return;

/* keep the summary live if the cart changes in another tab */
document.addEventListener('cart:change', () => { if (window.Cart.count()) renderSummary(); });

/* ---------- pay button label ---------- */
const payBtn = $('#pay');
payBtn.textContent = online()
  ? 'Pay ' + A.money(window.Cart.total()) + ' securely'
  : 'Place order on WhatsApp';

const note = $('#paynote');
if (note) note.textContent = online()
  ? 'Secured by Razorpay. UPI, cards, net banking and wallets accepted.'
  : 'Your order opens in WhatsApp with all the details filled in — Ashwini confirms the total and shares payment options there.';

/* ---------- validation ---------- */
const RULES = {
  name:  v => v.trim().length >= 2            || 'Please enter your full name',
  phone: v => /^[6-9]\d{9}$/.test(v.replace(/\D/g, '').replace(/^91/, '')) || 'Enter a valid 10-digit mobile number',
  email: v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Enter a valid email address',
  address: v => v.trim().length >= 10         || 'Please enter your full delivery address',
  city:  v => v.trim().length >= 2            || 'Please enter your city',
  pin:   v => /^\d{6}$/.test(v.trim())        || 'Enter a valid 6-digit PIN code'
};

function validate() {
  let ok = true;
  Object.keys(RULES).forEach(k => {
    const input = $('#f-' + k); if (!input) return;
    const field = input.closest('.field');
    const res = RULES[k](input.value);
    const bad = res !== true;
    field.classList.toggle('is-invalid', bad);
    $('.field__err', field).textContent = bad ? res : '';
    if (bad && ok) { input.focus(); ok = false; }
  });
  return ok;
}

function fieldCheck(el, showErrors) {
  const k = el.id.replace('f-', '');
  if (!RULES[k]) return true;
  const res = RULES[k](el.value), bad = res !== true;
  const field = el.closest('.field');
  /* while typing we only ever CLEAR an error, never add one */
  if (bad && !showErrors) return false;
  field.classList.toggle('is-invalid', bad);
  $('.field__err', field).textContent = bad ? res : '';
  return !bad;
}

$$('#checkout .input, #checkout .textarea').forEach(el => {
  el.addEventListener('blur', () => fieldCheck(el, true));
  el.addEventListener('input', () => fieldCheck(el, false));
});

function formData() {
  const g = id => { const el = $('#f-' + id); return el ? el.value.trim() : ''; };
  return {
    name: g('name'), phone: g('phone'), email: g('email'),
    address: g('address'), city: g('city'), pin: g('pin'),
    dob: g('dob'), sign: g('sign'), notes: g('notes')
  };
}

/* ---------- WhatsApp fallback ---------- */
function whatsappOrder(f) {
  const lines = window.Cart.detailed();
  const msg = [
    '*New order — Astro Ashwini*', '',
    ...lines.map((p, i) => `${i + 1}. ${p.name} × ${p.qty} — ${CFG.currency}${p.price * p.qty}`),
    '',
    `Subtotal: ${CFG.currency}${window.Cart.subtotal()}`,
    `Delivery: ${window.Cart.shipping() === 0 ? 'Free' : CFG.currency + window.Cart.shipping()}`,
    `*Total: ${CFG.currency}${window.Cart.total()}*`,
    '', '*Deliver to*',
    f.name, f.phone, f.email || '—',
    f.address, `${f.city} — ${f.pin}`,
    '',
    f.dob ? `Date of birth: ${f.dob}` : '',
    f.sign ? `Zodiac sign: ${f.sign}` : '',
    f.notes ? `Notes: ${f.notes}` : ''
  ].filter(Boolean).join('\n');

  window.open(`https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  showSuccess('Order sent to WhatsApp', 'Ashwini will confirm your order and share payment options on WhatsApp shortly.');
}

/* ---------- Razorpay ---------- */
function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Razorpay could not be loaded'));
    document.head.appendChild(s);
  });
}

async function payOnline(f) {
  await loadRazorpay();

  /* Ask the backend to create the order. The server must recompute the
     amount from the product IDs — never trust a total sent by the browser. */
  const res = await fetch(RZP.createOrderUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: window.Cart.items,          // [{id, qty}] — server prices these
      customer: f
    })
  });
  if (!res.ok) throw new Error('Order could not be created (HTTP ' + res.status + ')');
  const order = await res.json();
  if (!order.orderId) throw new Error('Server did not return an order id');

  const rzp = new window.Razorpay({
    key: RZP.keyId,
    order_id: order.orderId,
    amount: order.amount,               // paise, from the server
    currency: order.currency || CFG.currencyCode || 'INR',
    name: CFG.brand,
    description: window.Cart.count() + ' item(s)',
    image: location.origin + '/assets/icons/icon-192.png',
    prefill: { name: f.name, email: f.email, contact: f.phone },
    notes: { address: `${f.address}, ${f.city} ${f.pin}`, zodiac: f.sign || '' },
    theme: { color: RZP.themeColor || '#A2462A' },
    handler: async function (resp) {
      try {
        const v = await fetch(RZP.verifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resp)
        });
        if (!v.ok) throw new Error('verify failed');
        showSuccess('Payment received',
          'Order ' + (resp.razorpay_order_id || '') + ' is confirmed. A receipt is on its way to you.');
      } catch (err) {
        showSuccess('Payment taken — confirming',
          'Your payment went through but we could not confirm it automatically. ' +
          'Please keep payment id ' + (resp.razorpay_payment_id || '') + ' and contact us on ' + CFG.phone + '.');
      }
    },
    modal: {
      ondismiss: function () { setBusy(false); A.toast('Payment cancelled'); }
    }
  });

  rzp.on('payment.failed', function (e) {
    setBusy(false);
    const d = (e && e.error) || {};
    A.toast(d.description || 'Payment failed. Please try again.');
  });

  rzp.open();
}

/* ---------- submit ---------- */
function setBusy(b) {
  payBtn.disabled = b;
  payBtn.dataset.busy = b ? '1' : '';
  if (b) payBtn.textContent = 'Working…';
  else payBtn.textContent = online()
    ? 'Pay ' + A.money(window.Cart.total()) + ' securely'
    : 'Place order on WhatsApp';
}

payBtn.addEventListener('click', async e => {
  e.preventDefault();
  if (!validate()) { A.toast('Please check the highlighted fields'); return; }
  const f = formData();
  setBusy(true);

  if (!online()) { setBusy(false); whatsappOrder(f); return; }

  try {
    await payOnline(f);
  } catch (err) {
    setBusy(false);
    console.error('[checkout]', err);
    /* Gateway unreachable — don't lose the sale, offer WhatsApp instead. */
    if (confirm('Online payment is not available right now.\n\nSend this order to Ashwini on WhatsApp instead?')) {
      whatsappOrder(f);
    }
  }
});

/* ---------- success screen ---------- */
function showSuccess(title, body) {
  window.Cart.clear();
  root.innerHTML = `
    <div class="empty" style="grid-column:1/-1;max-width:56ch;margin-inline:auto">
      <svg class="empty__mark" style="color:var(--ok)" aria-hidden="true"><use href="#i-check"/></svg>
      <h2 style="margin-bottom:var(--sp-3)">${A.esc(title)}</h2>
      <p style="margin-bottom:var(--sp-8)">${A.esc(body)}</p>
      <div class="row gap-3" style="justify-content:center;flex-wrap:wrap">
        <a class="btn btn--primary" href="shop.html">Continue shopping</a>
        <a class="btn btn--ghost" href="index.html">Back home</a>
      </div>
    </div>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* prefill the zodiac dropdown */
const sel = $('#f-sign');
if (sel) sel.innerHTML = '<option value="">Prefer not to say</option>' +
  window.ZODIAC.map(z => `<option value="${z.sign}">${z.sign} (${z.hi})</option>`).join('');
});
})();
