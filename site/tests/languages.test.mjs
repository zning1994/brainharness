import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseLanguage, languages } from '../languages.mjs';
import { locales } from '../content.mjs';
import { renderPage, renderRoot } from '../build.mjs';
import fs from 'node:fs';
const catalog = JSON.parse(fs.readFileSync(new URL('../../.claude-plugin/marketplace.json', import.meta.url)));
test('browser preferences match regional tags in order and fall back to English', () => {
  for (const [input, expected] of [[['fr-FR','ja-JP','en'],'ja'],[['pt-BR'],'pt'],[['zh-TW'],'zh-hant'],[['KO_kr'],'ko'],[['fr'],'en'],[[],'en'],[[null,'de-AT'],'de']]) assert.equal(chooseLanguage(input), expected);
});
test('all locales have complete translated content and SEO links', () => {
  const shape = value => Array.isArray(value) ? value.map(shape) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, shape(value[k])])) : typeof value;
  assert.deepEqual(Object.keys(locales).sort(), Object.keys(languages).sort());
  for (const [lang, info] of Object.entries(languages)) {
    assert.deepEqual(shape(locales[lang]), shape(locales.en));
    const html = renderPage(lang, catalog, 'https://brainharness.si');
    assert.ok(html.includes(`<html lang="${info.tag}">`));
    assert.ok(html.includes('hreflang="x-default"'));
    for (const other of Object.values(languages)) assert.ok(html.includes(`hreflang="${other.tag}"`));
    if (lang !== 'en') assert.notEqual(locales[lang].intro, locales.en.intro);
    assert.ok(!html.includes('undefined'));
  }
});
test('only the root detects browser language, with usable no-script links', () => {
  const root = renderRoot();
  assert.match(root, /navigator.languages/);
  assert.match(root, /location.replace/);
  assert.doesNotMatch(root, /http-equiv="refresh"/);
  for (const lang of Object.keys(languages)) assert.ok(root.includes(`href="./${lang}/"`));
  assert.doesNotMatch(renderPage('ja',catalog,'https://brainharness.si'), /location.replace/);
});
test('Chinese scripts take precedence over region and preserve preference order', () => {
  for (const tag of ['zh-TW','zh-HK','zh-MO','zh-Hant','zh-Hant-CN','ZH_hant_hk']) assert.equal(chooseLanguage([tag]),'zh-hant',tag);
  for (const tag of ['zh','zh-CN','zh-SG','zh-Hans','zh-Hans-TW']) assert.equal(chooseLanguage([tag]),'zh',tag);
  assert.equal(chooseLanguage(['en-US','zh-TW']),'en');
  assert.equal(chooseLanguage(['fr','zh-HK','en']),'zh-hant');
});
test('Traditional Chinese has a stable URL and script-aware search metadata', () => {
  const html=renderPage('zh-hant',catalog,'https://brainharness.si');
  assert.ok(html.includes('<html lang="zh-Hant">'));
  assert.ok(html.includes('href="https://brainharness.si/zh-hant/"'));
  assert.ok(html.includes('繁體中文'));
  assert.ok(html.includes('選擇技能'));
  assert.ok(html.includes('content="zh_TW"'));
});
