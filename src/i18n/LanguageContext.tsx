'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SupportedLocale, TranslationDictionary, translations } from './translations';

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: translations.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>('en');

  useEffect(() => {
    // Read from localStorage if set
    const saved = localStorage.getItem('rxproof_locale') as SupportedLocale;
    if (saved && translations[saved]) {
      setLocaleState(saved);
      return;
    }

    // Auto-detect browser language
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === 'fr') setLocaleState('fr');
    else if (browserLang === 'ha') setLocaleState('ha');
    else if (browserLang === 'yo') setLocaleState('yo');
    else if (browserLang === 'sw') setLocaleState('sw');
    else setLocaleState('en');
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('rxproof_locale', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
