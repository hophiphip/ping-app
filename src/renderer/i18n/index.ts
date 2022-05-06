import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import ChainedBackend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";
import resourcesToBackend from "i18next-resources-to-backend";

/**
 * I18n translations that are used when http-translation fetch has failed.
 */
const localI18n = {
  en: {
    translation: {
      "Update button": "Request host system status",
      "Timestamp": "Timestamp",
      "Platform": "Platforms",
      "Session": "Session",
      "local": "local",
      "remote": "remote"
    }
  },
  ru: {
    translation: {
      "Update button": "Запрос состояния хоста",
      "Timestamp": "Отметка времени",
      "Platform": "Платформа",
      "Session": "Сессия",
      "local": "локальная",
      "remote": "дистанционная "
    }
  },
};

export default () => {
  i18next
    .use(initReactI18next)
    .use(ChainedBackend)
    .init({
      debug: true,
      saveMissing: true,
      saveMissingTo: 'current',
      lng: 'en',
      fallbackLng: 'en',
      preload: ['en', 'ru'],
      ns: ['translation'],
      defaultNS: 'translation',
      backend: {
        backends: [
          HttpBackend,
          resourcesToBackend(localI18n)
        ],
        backendOptions: [{
          loadPath: 'https://raw.githubusercontent.com/hophiphip/ping-app/master/public/locales/{{lng}}/{{ns}}.json'
        }]
      },
    });
};

