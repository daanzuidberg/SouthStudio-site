/* ============================================================
   SouthStudio — site generator (single source of truth)
   ------------------------------------------------------------
   Run this whenever you change copy. It stamps:
       templates/<page>.html  ×  content/site.<lang>.json
   into the live pages:
       English →  <page>.html        (root, for southstudio.online)
       Dutch   →  nl/<page>.html     (for southstudio.nl)

   EDIT COPY IN  content/site.en.json  /  content/site.nl.json
   — NOT in the generated .html files (they get overwritten).

   The full SEO + social <head> block (canonical, hreflang,
   Open Graph, Twitter, favicons, JSON-LD) is computed HERE,
   per page + language, and injected at the {{alt}} placeholder.
   Domains live in DOMAIN below — change them in one place.
   ============================================================ */
const PAGES = ['index','timeline','play','privacy'];

/* canonical domain per language (the rest — .be/.store — 301 here) */
const DOMAIN = { en: 'https://southstudio.online', nl: 'https://southstudio.nl' };
const LOCALE = { en: 'en_US', nl: 'nl_NL' };

/* page → URL path + which share card it uses */
const PATH = { index:'', timeline:'timeline.html', play:'play.html', privacy:'privacy.html' };
const OG   = { index:'og-default.png', timeline:'og-timeline.png', play:'og-timeline.png', privacy:'og-default.png' };

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

function headBlock(page, lang, dict){
  const base = DOMAIN[lang];
  const other = lang === 'en' ? 'nl' : 'en';
  const url   = base + '/' + PATH[page];
  const pre   = lang === 'en' ? '' : '../';            // asset prefix (NL pages live in /nl)
  const ogImg = base + '/icons/' + OG[page];           // social scrapers need absolute URLs
  const title = esc(dict.title);
  const desc  = esc(dict.desc);
  const type  = page === 'timeline' ? 'book' : 'website';

  const ld = page === 'timeline'
    ? {"@context":"https://schema.org","@type":"Book","name":"Timeline","author":{"@type":"Organization","name":"SouthStudio"},"publisher":{"@type":"Organization","name":"SouthStudio"},"numberOfPages":200,"bookFormat":"https://schema.org/Paperback","inLanguage":lang,"url":url,"image":ogImg,"description":dict.desc}
    : {"@context":"https://schema.org","@type":"Organization","name":"SouthStudio","url":base,"logo":base+'/icons/icon-512.png',"description":"An independent studio making things worth thinking about — games, books, and objects, beautifully made."};

  return [
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="en" href="${DOMAIN.en}/${PATH[page]}" />`,
    `<link rel="alternate" hreflang="nl" href="${DOMAIN.nl}/${PATH[page]}" />`,
    `<link rel="alternate" hreflang="x-default" href="${DOMAIN.en}/${PATH[page]}" />`,
    ``,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="SouthStudio" />`,
    `<meta property="og:locale" content="${LOCALE[lang]}" />`,
    `<meta property="og:locale:alternate" content="${LOCALE[other]}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${ogImg}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${ogImg}" />`,
    ``,
    `<link rel="icon" href="${pre}favicon.svg" type="image/svg+xml" />`,
    `<link rel="icon" href="${pre}icons/icon-32.png" sizes="32x32" type="image/png" />`,
    `<link rel="apple-touch-icon" href="${pre}icons/icon-180.png" />`,
    `<link rel="manifest" href="${pre}site.webmanifest" />`,
    `<meta name="theme-color" content="#1A1612" />`,
    ``,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`
  ].join('\n');
}

function stamp(tpl, dict){
  return tpl.replace(/\{\{([^}]+)\}\}/g, (_, k) => {
    k = k.trim();
    if (k in dict) return dict[k];
    throw new Error('Missing content key: ' + k);
  });
}

async function build(){
  const en = JSON.parse(await readFile('content/site.en.json'));
  const nl = JSON.parse(await readFile('content/site.nl.json'));
  const src = { en, nl };
  const previewRaw = await readFile('book-preview.html');   // standalone look-inside viewer
  for (const page of PAGES){
    const tpl = await readFile('templates/' + page + '.html');
    for (const lang of ['en','nl']){
      const dict = Object.assign({}, src[lang][page]);
      dict.alt = headBlock(page, lang, dict);             // inject computed SEO/social head
      if (page === 'timeline') dict.look_inside_srcdoc = previewSrcdoc(previewRaw, lang);
      const out = stamp(tpl, dict);
      await saveFile((lang==='en' ? '' : 'nl/') + page + '.html', out);
    }
    log('built ' + page + ' (en + nl)');
  }
  await buildSeoFiles();
}

/* Bake the look-inside viewer language and escape it for an iframe srcdoc="" attribute. */
function previewSrcdoc(raw, lang){
  const baked = raw.replace(
    /var lang=\(params\.get\('lang'\)==='nl'\)\?'nl':'en';/,
    "var lang=" + JSON.stringify(lang) + ";"
  );
  return baked.replace(/&/g, '&amp;').replace(/"/g, '&quot;');  // attribute-safe
}

/* ---- sitemap.xml (+ hreflang) · robots.txt · site.webmanifest ---- */
async function buildSeoFiles(){
  const rows = [];
  for (const page of PAGES){
    for (const lang of ['en','nl']){
      const loc = DOMAIN[lang] + '/' + PATH[page];
      const alts = [
        `    <xhtml:link rel="alternate" hreflang="en" href="${DOMAIN.en}/${PATH[page]}"/>`,
        `    <xhtml:link rel="alternate" hreflang="nl" href="${DOMAIN.nl}/${PATH[page]}"/>`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN.en}/${PATH[page]}"/>`
      ].join('\n');
      rows.push(`  <url>\n    <loc>${loc}</loc>\n${alts}\n    <changefreq>monthly</changefreq>\n  </url>`);
    }
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows.join('\n')}\n</urlset>\n`;
  await saveFile('sitemap.xml', sitemap);

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN.en}/sitemap.xml\nSitemap: ${DOMAIN.nl}/sitemap.xml\n`;
  await saveFile('robots.txt', robots);

  const manifest = {
    name: 'SouthStudio', short_name: 'SouthStudio',
    description: 'An independent studio making things worth thinking about.',
    start_url: '/', display: 'standalone',
    background_color: '#FAF7EF', theme_color: '#1A1612',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }
    ]
  };
  await saveFile('site.webmanifest', JSON.stringify(manifest, null, 2));
  log('built sitemap.xml · robots.txt · site.webmanifest');
}

await build();
