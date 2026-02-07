// Language Context for EN/TH switching
import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "th";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: <T>(content: { en: T; th: T }) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "th" : "en"));
  };

  const t = <T,>(content: { en: T; th: T }): T => {
    return content[language];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
