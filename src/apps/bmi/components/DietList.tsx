import React from "react";
import { useTranslation } from "react-i18next";
import { BMICategory } from "../types";
import styles from "./DietList.module.css";

interface Props {
  category: BMICategory;
}

const dietKeys: Record<BMICategory, string[]> = {
  underweight: [
    "bmi.diet_underweight_1",
    "bmi.diet_underweight_2",
    "bmi.diet_underweight_3",
    "bmi.diet_underweight_4",
    "bmi.diet_underweight_5",
  ],
  normal: [
    "bmi.diet_normal_1",
    "bmi.diet_normal_2",
    "bmi.diet_normal_3",
    "bmi.diet_normal_4",
    "bmi.diet_normal_5",
  ],
  overweight: [
    "bmi.diet_overweight_1",
    "bmi.diet_overweight_2",
    "bmi.diet_overweight_3",
    "bmi.diet_overweight_4",
    "bmi.diet_overweight_5",
  ],
  obese: [
    "bmi.diet_obese_1",
    "bmi.diet_obese_2",
    "bmi.diet_obese_3",
    "bmi.diet_obese_4",
    "bmi.diet_obese_5",
  ],
};

const categoryEmojis: Record<BMICategory, string> = {
  underweight: "🥩",
  normal: "🥗",
  overweight: "🥦",
  obese: "🫐",
};

const DietList: React.FC<Props> = ({ category }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>
        {categoryEmojis[category]} {t("bmi.diet_title")}
      </h3>
      <p className={styles.summary}>{t(`bmi.diet_summary_${category}`)}</p>
      <ul className={styles.list}>
        {dietKeys[category].map((key) => (
          <li key={key} className={styles.item}>
            <span className={styles.check}>✓</span>
            {t(key)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DietList;
