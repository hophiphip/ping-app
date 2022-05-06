import i18next from "i18next";
import { initReactI18next } from "react-i18next";

export default () => {
  i18next
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: {
            "Update button": "Request host system status",
          }
        }
      },

      lng: "en",
      fallbackLng: "en",

      interpolation: {
        escapeValue: false,
      }
    });
};

