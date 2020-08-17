/* eslint-disable camelcase, @typescript-eslint/camelcase */
import i18next, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLanguage } from '@src/utils/language';
import en_US from './en-us.json';
import zh_CN from './zh-ch.json';

const resources = {
  en_US,
  zh_CN: {
    ...en_US,
    ...zh_CN,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: getLanguage(),
  keySeparator: false, // we do not use keys in form messages.welcome
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
} as InitOptions);

export { i18next };
