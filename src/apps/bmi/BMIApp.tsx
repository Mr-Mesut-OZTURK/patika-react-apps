import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TabButton } from "./styled/Buttons";
import BMICalculator from "./components/BMICalculator";
import BMIResult from "./components/BMIResult";
import BMIInfo from "./components/BMIInfo";
import BMIHistory from "./components/BMIHistory";
import styles from "./BMIApp.module.css";

const BMIApp: React.FC = () => {
  const { t } = useTranslation();

  const tabs = [
    { to: "/bmi", label: t("bmi.tab_calculator"), end: true },
    { to: "/bmi/result", label: t("bmi.tab_result") },
    { to: "/bmi/info", label: t("bmi.tab_info") },
    { to: "/bmi/history", label: t("bmi.tab_history") },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("bmi.app_title")}</h1>
        <nav className={styles.tabs}>
          {tabs.map((tab) => (
            <NavLink key={tab.to} to={tab.to} end={tab.end}>
              {({ isActive }) => (
                <TabButton $active={isActive}>{tab.label}</TabButton>
              )}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className={styles.main}>
        <Routes>
          <Route index element={<BMICalculator />} />
          <Route path="result" element={<BMIResult />} />
          <Route path="info" element={<BMIInfo />} />
          <Route path="history" element={<BMIHistory />} />
        </Routes>
      </main>
    </div>
  );
};

export default BMIApp;
