import { createContext, useContext, useState, useEffect } from 'react';
import ruTranslations from '../locales/ru.json';
import uzTranslations from '../locales/uz.json';

const LanguageContext = createContext();

const translationsMap = {
  ru: ruTranslations,
  uz: uzTranslations,
};

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('ru');
  const [translations, setTranslations] = useState(ruTranslations);

  useEffect(() => {
    // Загружаем переводы при изменении локали
    const newTranslations = translationsMap[locale] || ruTranslations;
    setTranslations(newTranslations);
  }, [locale]);

  const changeLanguage = (newLocale) => {
    if (newLocale === 'ru' || newLocale === 'uz') {
      setLocale(newLocale);
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', newLocale);
      }
    }
  };

  useEffect(() => {
    // Загружаем сохраненный язык из localStorage
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale');
      if (savedLocale && (savedLocale === 'ru' || savedLocale === 'uz')) {
        setLocale(savedLocale);
      }
    }
  }, []);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t }}>
      {children}
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

