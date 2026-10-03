import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderPage, catalogEntries, escapeHtml} from '../build.mjs';
const catalog=JSON.parse(fs.readFileSync(new URL('../../.claude-plugin/marketplace.json',import.meta.url),'utf8'));
test('both languages preserve project-path navigation and distinct canonical URLs',()=>{
  for(const lang of ['en','zh']) {
    const html=renderPage(lang,catalog,'https://zning1994.github.io/brainharness');
    assert.ok(html.includes(`href="https://zning1994.github.io/brainharness/${lang}/"`));
    assert.ok(html.includes('href="../style.css"'));
    assert.ok(html.includes(lang==='zh'?'选择技能':'Choose a skill'));
    assert.equal((html.match(/<article class="skill"\s/g)||[]).length,3);
    assert.ok(html.includes('/plugin install brainharness-cooking@brainharness'));
    assert.ok(!html.includes('href="/'));
  }
});
test('reject a missing plugin and an unsafe source before deployment',()=>{
  assert.throws(()=>catalogEntries({plugins:[]}),/Invalid plugin/);
  const bad=structuredClone(catalog);bad.plugins[0].source.url='javascript:alert(1)';
  assert.throws(()=>renderPage('en',bad,'https://example.org'),/Invalid plugin/);
});
test('escape text and attribute delimiters',()=>assert.equal(escapeHtml(`<script a="x">&'</script>`),'&lt;script a=&quot;x&quot;&gt;&amp;&#39;&lt;/script&gt;'));
test('custom domain builds retain language roots',()=>assert.ok(renderPage('zh',catalog,'https://brainharness.si/').includes('href="https://brainharness.si/zh/"')));
test('unknown locale fails explicitly',()=>assert.throws(()=>renderPage('fr',catalog,'https://example.org'),/Unknown locale/));
