import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStoragePlugin from 'i18next-react-native-async-storage'

import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationPT from './locales/pt/translation.json';
import translationDE from './locales/de/translation.json';

i18next
  .use(initReactI18next)
  .use(AsyncStoragePlugin('en'))
  .init({
    debug:true,
    keySeparator:false,
    interpolation:{
        escapeValue:false,
    },
    resources:{
        en:{
            translation:translationEN,
        },
        es:{
            translation:translationES,
        },
        pt:{
          translation:translationPT,
        },
        de:{
          translation:translationDE,
        }

    }
    
  });
export default i18next;

