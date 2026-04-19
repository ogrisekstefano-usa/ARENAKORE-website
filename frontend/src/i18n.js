import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import it from './locales/it/translation.json';
import es from './locales/es/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, it: { translation: it }, es: { translation: es } },
    fallbackLng: 'en',
    supportedLngs: ['en', 'it', 'es'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'ak_lang',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
