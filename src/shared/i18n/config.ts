import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const modules = import.meta.glob<{ default: Record<string, unknown> }>(
  './locales/*.json',
  { eager: true },
);

const resources: Record<string, { translation: Record<string, unknown> }> = {};
for (const path in modules) {
  const lang = path.match(/\.\/locales\/(.*)\.json$/)?.[1];
  if (lang) {
    resources[lang] = { translation: modules[path].default };
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;