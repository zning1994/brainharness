import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseLanguage, languages } from '../languages.mjs';
import { locales } from '../content.mjs';
import { renderPage, renderRoot } from '../build.mjs';
import fs from 'node:fs';
import vm from 'node:vm';
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
test('the root is a stable language selector with usable no-script content', () => {
  const root = renderRoot();
  assert.match(root, /navigator.languages/);
  assert.doesNotMatch(root, /location\.(?:replace|assign|reload)\(/);
  assert.doesNotMatch(root, /http-equiv="refresh"/);
  const staticHtml = root.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  assert.ok(staticHtml.includes(locales.en.description));
  assert.ok(staticHtml.includes(locales.en.intro));
  assert.match(staticHtml, /<h2>Choose your language<\/h2>/);
  assert.match(staticHtml, /id="language-recommendation" hidden/);
  for (const [lang, info] of Object.entries(languages)) {
    assert.ok(staticHtml.includes(`href="./${lang}/" lang="${info.tag}" hreflang="${info.tag}">${info.label}</a>`));
    assert.doesNotMatch(renderPage(lang,catalog,'https://brainharness.si'), /navigator\.languages|location\.(?:replace|assign)/);
  }
});
test('the root recommends a language without navigating or replacing history', () => {
  const script = renderRoot().match(/<script type="module">([\s\S]*?)<\/script>/)[1]
    .replace("import { chooseLanguage, languages } from './languages.mjs';", '');
  for (const [navigator, expected] of [
    [{ languages: ['fr-FR', 'ja-JP', 'en'] }, 'ja'],
    [{ languages: ['zh-Hant-CN'] }, 'zh-hant'],
    [{ languages: ['zh-Hans-TW'] }, 'zh'],
    [{ languages: [], language: 'pt-BR' }, 'pt'],
    [{ language: 'de-AT' }, 'de'],
    [{ languages: ['fr'] }, 'en'],
    [{}, 'en'],
  ]) {
    const elements = {
      'recommended-language': {},
      'recommended-language-label': {},
      'language-recommendation': { hidden: true },
    };
    const location = Object.freeze({
      href: 'https://example.org/brainharness/?from=test#install', search: '?from=test', hash: '#install',
      replace: () => assert.fail('must not replace history'),
      assign: () => assert.fail('must not navigate'),
      reload: () => assert.fail('must not reload'),
    });
    const context = { chooseLanguage, languages, navigator, URL, document: { getElementById: id => elements[id] } };
    Object.defineProperty(context, 'location', { get: () => location, set: () => assert.fail('must not navigate') });
    vm.runInNewContext(`'use strict';\n${script}`, context);
    assert.equal(elements['recommended-language'].href, `https://example.org/brainharness/${expected}/?from=test#install`);
    assert.equal(elements['recommended-language'].hreflang, languages[expected].tag);
    assert.equal(elements['recommended-language-label'].textContent, languages[expected].label);
    assert.equal(elements['recommended-language-label'].lang, languages[expected].tag);
    assert.equal(elements['language-recommendation'].hidden, false);
  }
});
test('root canonical and reciprocal language alternatives preserve the configured base', () => {
  for (const base of ['https://brainharness.si', 'https://example.org/brainharness']) {
    const root = renderRoot(`${base}/`);
    assert.ok(root.includes(`<link rel="canonical" href="${base}/">`));
    assert.ok(root.includes(`<link rel="alternate" hreflang="x-default" href="${base}/">`));
    for (const [lang, info] of Object.entries(languages)) {
      assert.ok(root.includes(`<link rel="alternate" hreflang="${info.tag}" href="${base}/${lang}/">`));
    }
  }
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
