import React, { createContext, useContext } from 'react';
import { UI_TEXT, type AppLanguage, type UiTextBundle } from './translations';

interface LanguageContextValue {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  t: UiTextBundle;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: UI_TEXT.en,
});

export const LanguageProvider: React.FC<{
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  children: React.ReactNode;
}> = ({ lang, setLang, children }) => (
  <LanguageContext.Provider value={{ lang, setLang, t: UI_TEXT[lang] }}>
    {children}
  </LanguageContext.Provider>
);

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
