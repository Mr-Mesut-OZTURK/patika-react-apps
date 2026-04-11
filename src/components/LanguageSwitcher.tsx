import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.css";

const LANGUAGES = [
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "tr", label: "TR", flag: "🇹🇷" },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <div className={styles.switcher}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={`${styles.btn} ${i18n.language === lang.code ? styles.active : ""}`}
          onClick={() => i18n.changeLanguage(lang.code)}
          title={lang.label}
        >
          <span>{lang.flag}</span>
          <span className={styles.label}>{lang.label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
