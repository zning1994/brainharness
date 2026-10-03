import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderPage,escapeHtml,catalogEntries} from '../build.mjs';
import {locales} from '../content.mjs';
import {sitemap,safeJson,llmsText} from '../seo.mjs';
const catalog=JSON.parse(fs.readFileSync(new URL('../../.claude-plugin/marketplace.json',import.meta.url)));
test('structured data matches visible localized skills without fabricated ratings',()=>{
 for(const lang of Object.keys(locales)) {
  const html=renderPage(lang,catalog,'https://brainharness.si');
  const raw=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  assert.ok(raw,'JSON-LD missing');
  const graph=JSON.parse(raw)['@graph'];
  assert.equal(graph[1].description,locales[lang].description);
  assert.equal(graph[2].itemListElement.length,3);
  assert.ok(!raw.includes('aggregateRating'));
  assert.ok(html.includes(escapeHtml(locales[lang].chatgptStatus)));
  assert.ok(html.includes('id="brainharness-cooking"'));
 }
});
test('sitemap includes all nine routes with reciprocal language links',()=>{
 const xml=sitemap('https://brainharness.si',escapeHtml);
 assert.equal((xml.match(/<loc>/g)||[]).length,9);
 assert.equal((xml.match(/hreflang="x-default"/g)||[]).length,9);
 assert.ok(xml.includes('xmlns:xhtml'));
});
test('machine-readable guide uses the same limitations and official sources',()=>{
 const text=llmsText('https://brainharness.si',locales,catalogEntries(catalog));
 assert.ok(text.includes(locales.en.chatgptStatus));
 assert.ok(text.includes('/ru/'));
 assert.ok(text.includes('https://github.com/zning1994/brainharness-autoresearch'));
 assert.ok(!safeJson({value:'</script><script>'}).includes('</script>'));
});
