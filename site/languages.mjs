export const languages = {
  en: { label: 'English', tag: 'en' },
  zh: { label: '简体中文', tag: 'zh-Hans' },
  'zh-hant': { label: '繁體中文', tag: 'zh-Hant' },
  ja: { label: '日本語', tag: 'ja' },
  es: { label: 'Español', tag: 'es' },
  de: { label: 'Deutsch', tag: 'de' },
  ko: { label: '한국어', tag: 'ko' },
  pt: { label: 'Português', tag: 'pt' },
  ru: { label: 'Русский', tag: 'ru' },
};
export function chooseLanguage(preferences = []) {
  for (const preference of preferences) {
    if (typeof preference !== 'string') continue;
    const parts = preference.toLowerCase().replaceAll('_', '-').split('-');
    const language = parts[0];
    if (language === 'zh') {
      if (parts[1] === 'hans') return 'zh';
      if (parts[1] === 'hant') return 'zh-hant';
      return ['tw', 'hk', 'mo'].includes(parts[1]) ? 'zh-hant' : 'zh';
    }
    if (Object.hasOwn(languages, language)) return language;
  }
  return 'en';
}
