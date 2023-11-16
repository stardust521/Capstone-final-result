import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN.en,
    },
    zh_CN: {
      translation: translationEN.zh_CN,
    },
    zh_TW: {
      translation: translationEN.zh_TW,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
