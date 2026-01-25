import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import translations from './translations';

const defaultContextValue = {
  language: 'en',
  changeLanguage: () => {},
  t: (key) => key,
};

const LanguageContext = createContext(defaultContextValue);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && savedLanguage !== language) {
        setLanguage(savedLanguage);
      }
      setHydrated(true);
    }
  }, []);

  const changeLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }
  }, []);

  const translate = useCallback((key, activeLanguage) => {
    const keys = key.split('.');
    let value = translations[activeLanguage];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    if (value === undefined) {
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
    }

    return value || key;
  }, []);

  const t = useCallback((key) => translate(key, language), [translate, language]);

  const contextValue = useMemo(() => ({
    language,
    changeLanguage,
    t,
  }), [language, changeLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {hydrated ? children : null}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
