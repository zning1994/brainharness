import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {detailLanguages,detailKeys,renderDetail} from '../details.mjs';
import {languages} from '../languages.mjs';
import {locales} from '../content.mjs';
import {catalogEntries,escapeHtml,renderPage} from '../build.mjs';
import {sitemap} from '../seo.mjs';
const catalog=JSON.parse(fs.readFileSync(new URL('../../.claude-plugin/marketplace.json',import.meta.url)));
const entries=catalogEntries(catalog),base='https://brainharness.si';
test('nine detail pages have localized content, static installation and authoritative sources',()=>{
 for(const lang of detailLanguages) for(const [i,key] of detailKeys.entries()) {
  const html=renderDetail(lang,i,entries,locales,base,escapeHtml);
  assert.ok(html.includes(`<link rel="canonical" href="${base}/${lang}/skills/${key}/">`));
  assert.equal((html.match(/rel="alternate"/g)||[]).length,4);
  assert.ok(html.includes(`codex plugin add ${entries[i].slug}@brainharness`));
  assert.ok(html.includes(escapeHtml(locales[lang].chatgptStatus)));
  assert.ok(html.includes(`${entries[i].url}/blob/main/SKILL.md`));
  assert.ok(!html.includes('undefined'));
  const schema=JSON.parse(html.match(/application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema.mainEntity.codeRepository,entries[i].url);
  assert.ok(!html.includes('location.replace'));
 }
});
test('overview links select translated detail or explicitly label English fallback',()=>{
 for(const lang of Object.keys(locales)) {
  const html=renderPage(lang,catalog,base),target=detailLanguages.includes(lang)?lang:'en';
  for(const key of detailKeys) assert.ok(html.includes(`href="../${target}/skills/${key}/"`));
  if(target!==lang) assert.ok(html.includes('(English)'));
 }
});
test('combined sitemap has nineteen unique URLs and reciprocal skill alternatives',()=>{
 const groups=detailKeys.map(key=>[...detailLanguages.map(lang=>[languages[lang].tag,`${base}/${lang}/skills/${key}/`]),['x-default',`${base}/en/skills/${key}/`]]);
 const xml=sitemap(base,escapeHtml,groups);
 const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 assert.equal(urls.length,19); assert.equal(new Set(urls).size,19);
 for(const key of detailKeys) for(const lang of detailLanguages) {
  const entry=xml.split('<url>').find(s=>s.startsWith(`<loc>${base}/${lang}/skills/${key}/</loc>`));
  for(const [,url] of groups[detailKeys.indexOf(key)]) assert.ok(entry.includes(`href="${url}"`));
 }
});
