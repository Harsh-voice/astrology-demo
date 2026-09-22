/* ═══════════════════════════════════════════════════════════════
   ASTRO ASHWINI — SITE CONFIGURATION
   This is the only file you need to edit for business details.
   ═══════════════════════════════════════════════════════════════ */
window.ASTRO_CONFIG = {

  /* ---- Business details (from astroashwini.com) ---- */
  brand:     'Astro Ashwini',
  person:    'Ashwini Patwardhan',
  phone:     '+919923558822',
  phoneAlt:  '+919049448181',
  whatsapp:  '919923558822',          // digits only, with country code
  email:     'info@astroashwini.com', // TODO: confirm real address
  instagram: 'https://www.instagram.com/astroashwiini/',
  address: {
    line1: 'Insppire House, Bunglow No 24',
    line2: 'Mulberry Garden 2, Magarpatta City',
    city:  'Hadapsar, Pune',
    pin:   '411028',
    state: 'Maharashtra, India'
  },
  rating: { score: 4.9, count: 46, source: 'Google Reviews' },

  /* ---- Currency ---- */
  currency: '₹',
  currencyCode: 'INR',

  /* ---- Shipping ---- */
  shipping: {
    freeAbove: 1500,   // free delivery above this cart value
    flatRate: 79       // otherwise this much
  },

  /* ═══════════════════════════════════════════════════════════
     RAZORPAY PAYMENT GATEWAY
     ───────────────────────────────────────────────────────────
     To go live with online payments:

     1. Sign up at https://dashboard.razorpay.com and complete KYC.
     2. Settings → API Keys → Generate Key. Copy the Key ID
        (starts with rzp_test_ for testing, rzp_live_ for real money).
     3. Paste it into `keyId` below and set `enabled: true`.
     4. Deploy the order-creation endpoint (see README.md → "Razorpay
        setup"). Razorpay REQUIRES a server to create the order and to
        verify the payment signature — the Key Secret must NEVER be put
        in this file or anywhere in the browser.
     5. Point `createOrderUrl` at that endpoint.

     While `enabled` is false (or the endpoint is unreachable) the
     checkout automatically falls back to placing the order over
     WhatsApp, so the shop still works today.
     ═══════════════════════════════════════════════════════════ */
  razorpay: {
    enabled: false,
    keyId: '',                              // e.g. 'rzp_test_1DP5mmOlF5G5ag'
    createOrderUrl: '/api/razorpay/order',   // your backend
    verifyUrl: '/api/razorpay/verify',       // your backend
    themeColor: '#A2462A'
  }
};
