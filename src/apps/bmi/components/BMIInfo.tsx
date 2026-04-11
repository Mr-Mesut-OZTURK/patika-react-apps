import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./BMIInfo.module.css";

const categories = [
  { key: "underweight", range: "< 18.5", color: "#3b82f6" },
  { key: "normal", range: "18.5 – 24.9", color: "#a6f080" },
  { key: "overweight", range: "25 – 29.9", color: "#f59e0b" },
  { key: "obese", range: "≥ 30", color: "#ef4444" },
];

const BMIInfo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{t("bmi.info_title")}</h2>
      <p className={styles.intro}>{t("bmi.info_intro")}</p>

      <div className={styles.formulaBox}>
        <span className={styles.formulaLabel}>
          {t("bmi.info_formula_label")}
        </span>
        <span className={styles.formula}>BMI = kg / m²</span>
      </div>

      <h3 className={styles.subheading}>{t("bmi.info_ranges_title")}</h3>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>{t("bmi.info_category")}</span>
          <span>{t("bmi.info_range")}</span>
        </div>
        {categories.map((c) => (
          <div key={c.key} className={styles.tableRow}>
            <span style={{ color: c.color, fontWeight: 700 }}>
              {t(`bmi.category_${c.key}`)}
            </span>
            <span className={styles.range}>{c.range}</span>
          </div>
        ))}
      </div>

      <p className={styles.note}>{t("bmi.info_note")}</p>
    </div>
  );
};

export default BMIInfo;
