import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import i18n from "./i18n"; 

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState(i18n.language || "en");

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && savedLang !== language) {
      setLanguage(savedLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
