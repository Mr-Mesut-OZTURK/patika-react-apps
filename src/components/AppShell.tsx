import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./AppShell.module.css";

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.shell}>
      <div className={styles.bar}>
        <button
          className={styles.back}
          onClick={() => navigate("/")}
          type="button"
        >
          <span className={styles.arrow}>←</span>
          <span className={styles.label}>{t("nav.home")}</span>
        </button>
        <LanguageSwitcher />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default AppShell;
