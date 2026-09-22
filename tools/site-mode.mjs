#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   site-mode — switch the site between a private demo and the live site.

     node tools/site-mode.mjs demo [https://your-demo.vercel.app]
     node tools/site-mode.mjs live https://astroashwini.com

   demo  Makes the site un-indexable: adds noindex to every page and REMOVES
         the canonical tags. A missing canonical is harmless; a canonical
         pointing at a domain serving different content is not — and every
         page here canonicalises to astroashwini.com, which still runs her
         old WordPress site.

   live  Reverses all of it and regenerates sitemap.xml from the real
         catalogue in assets/js/data.js.

   Passing a domain in either mode also stamps og:image and the schema @id
   as absolute URLs. Social scrapers — WhatsApp especially, which is her main
   share channel — will not resolve a relative og:image.

   No build step and no dependencies: run it by hand, commit the result.
   Idempotent — running the same mode twice changes nothing.
   ═══════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NOINDEX = '<meta name="robots" content="noindex,nofollow">';

/* canonical path for each page, relative to the site root */
const CANONICAL_PATH = {
  'index.html': '',
  'shop.html': 'shop.html',
  'product.html': 'product.html',
  'services.html': 'services.html',
  'about.html': 'about.html',
  'contact.html': 'contact.html',
  'checkout.html': 'checkout.html'
};

const [, , mode, domainArg] = process.argv;
if (mode !== 'demo' && mode !== 'live') {
  console.error('usage: node tools/site-mode.mjs demo|live [https://domain]');
  process.exit(1);
}
if (mode === 'live' && !domainArg) {
  console.error('live mode needs a domain, e.g. node tools/site-mode.mjs live https://astroashwini.com');
  process.exit(1);
}
const domain = domainArg ? domainArg.replace(/\/+$/, '') : null;

const pages = readdirSync(ROOT).filter(f => f.endsWith('.html'));
let touched = 0;

for (const page of pages) {
  const path = join(ROOT, page);
  let s = readFileSync(path, 'utf8');
  const before = s;

  /* clear whatever is there now, then re-apply for the chosen mode */
  s = s.replace(/[ \t]*<meta name="robots"[^>]*>\n?/g, '');
  s = s.replace(/[ \t]*<link rel="canonical"[^>]*>\n?/g, '');

  if (mode === 'demo') {
    /* checkout was already noindex on its own merit; now everything is */
    s = s.replace(/(<meta name="description"[^>]*>\n)/, `$1${NOINDEX}\n`);
  } else {
    const p = CANONICAL_PATH[page];
    if (p !== undefined) {
      const href = `${domain}/${p}`;
      s = s.replace(/(<meta name="description"[^>]*>\n)/, `$1<link rel="canonical" href="${href}">\n`);
    }
    /* checkout should stay out of the index even when live */
    if (page === 'checkout.html') {
      s = s.replace(/(<meta name="description"[^>]*>\n)/, `$1<meta name="robots" content="noindex">\n`);
    }
  }

  /* absolute og:image + schema @id when we know the domain */
  if (domain) {
    s = s.replace(/(<meta property="og:image" content=")([^"]+)(">)/,
      (_, a, url, c) => a + (url.startsWith('http') ? url : `${domain}/${url.replace(/^\//, '')}`) + c);
    s = s.replace(/"@id":"https?:\/\/[^/]+\/#business"/, `"@id":"${domain}/#business"`);
    s = s.replace(/"image":"https?:\/\/[^"]+"/, `"image":"${domain}/assets/img/logo-lockup.png"`);
  }

  if (s !== before) { writeFileSync(path, s); touched++; }
}

/* ---- robots.txt ---- */
writeFileSync(join(ROOT, 'robots.txt'), mode === 'demo'
  ? `# Private demo — deliberately kept out of search.\n` +
    `# The live site is astroashwini.com; this build must not compete with it.\n` +
    `# Run \`node tools/site-mode.mjs live https://yourdomain\` to reverse.\n` +
    `User-agent: *\nDisallow: /\n`
  : `User-agent: *\nAllow: /\nDisallow: /checkout.html\n\nSitemap: ${domain}/sitemap.xml\n`);

/* ---- sitemap.xml (live only) ---- */
if (mode === 'live') {
  /* Read the catalogue by EXECUTING data.js, not by pattern-matching it.
     Scraping the source misses entries whenever the formatting varies. */
  const sandbox = { window: {} };
  const src = readFileSync(join(ROOT, 'assets/js/data.js'), 'utf8');
  new Function('window', src)(sandbox.window);
  const ids = (sandbox.window.PRODUCTS || []).map(p => p.id);
  if (!ids.length) { console.error('could not read PRODUCTS from data.js'); process.exit(1); }

  const pagesOut = [['', '1.0', 'weekly'], ['shop.html', '0.9', 'weekly'],
    ['services.html', '0.8', 'monthly'], ['about.html', '0.7', 'monthly'],
    ['contact.html', '0.7', 'monthly']];
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const [p, pr, cf] of pagesOut)
    lines.push(`  <url><loc>${domain}/${p}</loc><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`);
  for (const id of ids)
    lines.push(`  <url><loc>${domain}/product.html?id=${id}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
  lines.push('</urlset>');
  writeFileSync(join(ROOT, 'sitemap.xml'), lines.join('\n') + '\n');
  console.log(`  sitemap.xml — ${pagesOut.length + ids.length} URLs on ${domain}`);
}

console.log(`site-mode: ${mode}${domain ? ' @ ' + domain : ''} — ${touched} page(s) updated, robots.txt written`);
