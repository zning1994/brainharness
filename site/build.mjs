import { structuredData, safeJson, sitemap, llmsText } from './seo.mjs';
import { languages } from './languages.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales, slugs, compatibility } from './content.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
export const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export function catalogEntries(catalog) {
  return slugs.map(slug => {
    const p = catalog.plugins.find(p => p.name === slug);
    if (!p || !/^https:\/\/github\.com\/zning1994\/brainharness-[a-z]+\.git$/.test(p.source?.url ?? '')) throw new Error(`Invalid plugin source: ${slug}`);
    return {slug, url:p.source.url.replace(/\.git$/, '')};
  });
}
export function renderPage(lang, catalog, siteUrl) {
  const c = locales[lang]; if (!c) throw new Error('Unknown locale');
  const entries = catalogEntries(catalog); const e = escapeHtml;
  const base = new URL(siteUrl); if (!['https:', 'http:'].includes(base.protocol)) throw new Error('Invalid site URL');
  const canonical = `${base.href.replace(/\/$/,'')}/${lang}/`;
  const alternatives = Object.entries(languages).map(([key, info]) => `<link rel="alternate" hreflang="${info.tag}" href="${e(base.href.replace(/\/$/,''))}/${key}/">`).join('') + `<link rel="alternate" hreflang="x-default" href="${e(base.href.replace(/\/$/,''))}/">`;
  const languageMenu = `<details class="language-menu"><summary aria-label="${e(c.languageLabel)}">${languages[lang].label}</summary><div class="language-options">${Object.entries(languages).map(([key, info]) => `<a href="../${key}/" lang="${info.tag}" hreflang="${info.tag}"${key===lang?' aria-current="page"':''}>${info.label}</a>`).join('')}</div></details>`;
  const command = `/plugin marketplace add zning1994/brainharness\n/plugin install ${entries[0].slug}@brainharness`;
  const cards = entries.map((p,i) => `<article class="skill" id="${p.slug}"><div class="skill-top"><span class="skill-icon" aria-hidden="true">${['◒','▤','⌘'][i]}</span><a href="${e(p.url)}/releases">${e(c.release)}</a></div><h3>${e(c.skills[i].name)}</h3><h4>${e(c.skills[i].category)}</h4><p>${e(c.skills[i].description)}</p><blockquote>${e(c.skills[i].use)}</blockquote><p class="requirement">${e(c.skills[i].requirement)}</p><a class="text-link" href="${e(p.url)}">${e(c.skills[i].action)} <span aria-hidden="true">↗</span></a></article>`).join('');
  const platformFacts = `<details class="platform-facts"><summary>${e(c.platform)}</summary><dl>${[['Claude Code',c.claudeStatus],['Codex',c.codexStatus],['ChatGPT',c.chatgptStatus],['ClawHub',c.clawhubStatus]].map(([name,status])=>`<dt>${name}</dt><dd>${e(status)}</dd>`).join('')}</dl></details>`;
  const seo = `<meta name="robots" content="index,follow,max-image-preview:large"><meta property="og:site_name" content="BrainHarness"><meta property="og:locale" content="${({en:'en_US',zh:'zh_CN','zh-hant':'zh_TW',ja:'ja_JP',es:'es_ES',de:'de_DE',ko:'ko_KR',pt:'pt_BR',ru:'ru_RU'})[lang]}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="BrainHarness | ${e(c.title)}"><meta name="twitter:description" content="${e(c.description)}"><script type="application/ld+json">${safeJson(structuredData(lang,c,entries,base.href.replace(/\/$/,'')))}</script>`;
  const data = e(JSON.stringify({lang,copy:c.copy,copied:c.copied,copyFailed:c.copyFailed,demos:c.demos,compatibility,status:{claude:c.claudeStatus,codex:c.codexStatus,chatgpt:c.chatgptStatus,clawhub:c.clawhubStatus}}));
  return `<!doctype html><html lang="${languages[lang].tag}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BrainHarness | ${e(c.title)}</title><meta name="description" content="${e(c.description)}"><meta name="theme-color" content="#204fd4"><link rel="canonical" href="${e(canonical)}">${alternatives}<meta property="og:title" content="BrainHarness | ${e(c.title)}"><meta property="og:description" content="${e(c.description)}"><meta property="og:url" content="${e(canonical)}"><meta property="og:type" content="website">${seo}<link rel="icon" href="../favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../style.css"><script src="../app.js" defer></script></head><body data-config="${data}"><a class="skip" href="#main">${e(c.skip)}</a><header><a class="brand" href="./" aria-label="BrainHarness"><img src="../favicon.svg" width="34" height="34" alt="">BrainHarness</a><nav aria-label="${e(c.navigation)}"><a href="#skills">${e(c.nav[0])}</a><a href="#install">${e(c.nav[1])}</a>${languageMenu}<a class="github" href="https://github.com/zning1994/brainharness">GitHub ↗</a></nav></header><main id="main"><section class="hero"><div class="hero-copy"><p class="intro-label">${e(c.tagline)}</p><h1>${e(c.hero[0])}<br>${e(c.hero[1])}</h1><p class="lead">${e(c.intro)}</p><div class="hero-actions"><a class="button" href="#skills">${e(c.cta)}</a><a class="quiet-link" href="#install">${e(c.secondary)}</a></div><div class="platform-strip">Claude Code <span>/</span> Codex <span>/</span> OpenClaw</div></div><div class="demo"><div class="demo-tabs" aria-label="${e(c.example)}">${c.demos.map((d,i)=>`<button type="button" data-demo="${i}" aria-pressed="${i===0}">${e(d.tab)}</button>`).join('')}</div><div class="demo-body"><span class="conversation-label">${e(c.example)}</span><p id="demo-q" class="question">${e(c.demos[0].q)}</p><div class="answer"><div class="answer-mark" aria-hidden="true">b</div><div><p id="demo-a">${e(c.demos[0].a)}</p><span id="demo-label">${e(c.demos[0].label)}</span></div></div></div><p class="demo-caption">${e(c.demoTitle)}</p></div></section><section id="skills" class="collection"><div class="section-heading"><h2>${e(c.collection)}</h2><p>${e(c.collectionText)}</p></div><div class="skills-grid">${cards}</div></section><section id="install" class="install"><div><h2>${e(c.installTitle)}</h2><p>${e(c.installText)}</p><p class="migration-note">${e(c.note)}</p>${platformFacts}</div><div class="installer"><div class="platform-tabs" aria-label="${e(c.platform)}">${[['claude','Claude Code'],['codex','Codex'],['chatgpt','ChatGPT'],['clawhub','ClawHub']].map(([key,name])=>`<button type="button" data-platform="${key}" aria-pressed="${key==='claude'}">${name}</button>`).join('')}</div><label for="skill-select">${e(c.choose)}</label><select id="skill-select">${entries.map((p,i)=>`<option value="${p.slug}">${e(c.skills[i].name)}</option>`).join('')}</select><p id="platform-status">${e(c.claudeStatus)}</p><div id="command-panel"><pre><code id="command">${e(command)}</code></pre><button id="copy" type="button">${e(c.copy)}</button></div><p id="copy-status" role="status" aria-live="polite"></p><a id="listing" href="https://clawhub.ai/zning1994/brainharness-cooking" hidden>ClawHub ↗</a></div></section><section class="open-source"><div class="source-symbol" aria-hidden="true">{ b }</div><div><h2>${e(c.sourceTitle)}</h2><p>${e(c.sourceText)}</p><a class="text-link" href="https://github.com/zning1994/brainharness">${e(c.sourceAction)} ↗</a></div></section></main><footer><a class="brand" href="./">BrainHarness</a><p>${e(c.footer)}</p><a href="https://github.com/zning1994/brainharness/blob/main/LICENSE">MIT</a><a href="https://github.com/zning1994">zning1994</a></footer></body></html>`;
}
export function renderRoot(base = 'https://brainharness.si') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BrainHarness | Agent skills for cooking, docs and prompt experiments</title><meta name="description" content="${escapeHtml(locales.en.description)}"><link rel="canonical" href="${escapeHtml(base)}/">${Object.entries(languages).map(([key,info])=>`<link rel="alternate" hreflang="${info.tag}" href="${escapeHtml(base)}/${key}/">`).join('')}<link rel="alternate" hreflang="x-default" href="${escapeHtml(base)}/"><script type="module">
import { chooseLanguage } from './languages.mjs';
const preferences = navigator.languages?.length ? navigator.languages : [navigator.language];
const destination = new URL('./' + chooseLanguage(preferences) + '/', location.href);
destination.search = location.search;
destination.hash = location.hash;
location.replace(destination.href);
</script></head><body><h1>BrainHarness</h1><p>${escapeHtml(locales.en.description)}</p><nav aria-label="Language">${Object.entries(languages).map(([key,info])=>`<p><a href="./${key}/" lang="${info.tag}">${info.label}</a></p>`).join('')}</nav></body></html>`;
}
export async function build() {
  const catalog = JSON.parse(await fs.readFile(path.join(here,'../.claude-plugin/marketplace.json'),'utf8'));
  const base = (process.env.SITE_URL || 'https://zning1994.github.io/brainharness').replace(/\/$/,'');
  const out = path.join(here,'dist'); await fs.mkdir(out,{recursive:true});
  for (const lang of Object.keys(locales)) { await fs.mkdir(path.join(out,lang),{recursive:true}); await fs.writeFile(path.join(out,lang,'index.html'),renderPage(lang,catalog,base)); }
  for (const file of ['style.css','app.js','favicon.svg','languages.mjs']) await fs.copyFile(path.join(here,file),path.join(out,file));
  await fs.writeFile(path.join(out,'index.html'),renderRoot(base));
  await fs.writeFile(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
  await fs.writeFile(path.join(out,'sitemap.xml'),sitemap(base,escapeHtml));
  await fs.writeFile(path.join(out,'llms.txt'),llmsText(base,locales,catalogEntries(catalog)));
  console.log(`Built ${Object.keys(locales).length} locales for ${base}`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
