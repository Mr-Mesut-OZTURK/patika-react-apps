import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DangerButton } from "../styled/Buttons";
import { BMIData } from "../types";
import styles from "./BMIHistory.module.css";

const categoryColors: Record<string, string> = {
  underweight: "#3b82f6",
  normal: "#a6f080",
  overweight: "#f59e0b",
  obese: "#ef4444",
};

const BMIHistory: React.FC = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<BMIData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("bmi_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("bmi_history");
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{t("bmi.history_empty")}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <h2 className={styles.heading}>{t("bmi.history_title")}</h2>
        <DangerButton onClick={clearHistory}>
          {t("bmi.history_clear")}
        </DangerButton>
      </div>
      <div className={styles.list}>
        {history.map((entry, i) => {
          const color = categoryColors[entry.category];
          return (
            <div
              key={i}
              className={styles.item}
              style={{ borderLeft: `4px solid ${color}` }}
            >
              <div className={styles.itemLeft}>
                <span className={styles.bmiVal} style={{ color }}>
                  {entry.bmi}
                </span>
                <span className={styles.category}>
                  {t(`bmi.category_${entry.category}`)}
                </span>
              </div>
              <div className={styles.itemRight}>
                <span>
                  {entry.height} cm · {entry.weight} kg
                </span>
                <span className={styles.date}>
                  {new Date(entry.date).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BMIHistory;
