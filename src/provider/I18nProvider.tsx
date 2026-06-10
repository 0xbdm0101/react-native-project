import React, { useEffect, useState, useCallback, createContext, useContext } from "react";
import { I18nProvider as I18nProviderRaw } from "@lingui/react";
import { i18n } from "@lingui/core";
import { dynamicActivate } from "@/locales";
import { DEFAULT_LOCALE, LOCALES } from "@/locales/config";
import { LG_VERSION_LANG } from "@/config/cache";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ==================== Language Context ====================

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (locale: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: DEFAULT_LOCALE,
  changeLanguage: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

// ==================== Provider ====================

export const I18nProvider = ({ children }: React.PropsWithChildren) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LG_VERSION_LANG);
        const locale =
          saved && Object.values(LOCALES).includes(saved as LOCALES)
            ? saved
            : DEFAULT_LOCALE;
        await dynamicActivate(locale);
        setCurrentLanguage(locale);
      } catch {
        await dynamicActivate(DEFAULT_LOCALE);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const changeLanguage = useCallback(async (locale: string) => {
    await dynamicActivate(locale);
    setCurrentLanguage(locale);
    await AsyncStorage.setItem(LG_VERSION_LANG, locale);
  }, []);

  if (!ready) return null;

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      <I18nProviderRaw i18n={i18n}>{children}</I18nProviderRaw>
    </LanguageContext.Provider>
  );
};
