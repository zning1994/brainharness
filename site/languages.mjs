export const languages = {
  en: { label: 'English', tag: 'en' },
  zh: { label: '简体中文', tag: 'zh-CN' },
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
    const language = preference.toLowerCase().replaceAll('_', '-').split('-')[0];
    if (Object.hasOwn(languages, language)) return language;
  }
  return 'en';
}
