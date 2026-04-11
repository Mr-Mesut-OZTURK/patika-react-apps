import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrimaryButton, SecondaryButton } from "../styled/Buttons";
import { BMIData, BMICategory } from "../types";
import styles from "./BMICalculator.module.css";

const calculateBMI = (height: number, weight: number): number => {
  const heightM = height / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
};

const getCategory = (bmi: number): BMICategory => {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
};

const BMICalculator: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("bmi_last_input");
    if (saved) {
      const parsed = JSON.parse(saved);
      setHeight(String(parsed.height));
      setWeight(String(parsed.weight));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h < 50 || h > 250 || w < 10 || w > 500) {
      setError(t("bmi.invalid_input"));
      return;
    }

    setError("");
    const bmi = calculateBMI(h, w);
    const category = getCategory(bmi);

    const data: BMIData = {
      height: h,
      weight: w,
      bmi,
      category,
      date: new Date().toISOString(),
    };

    localStorage.setItem("bmi_result", JSON.stringify(data));
    localStorage.setItem(
      "bmi_last_input",
      JSON.stringify({ height: h, weight: w }),
    );

    const history: BMIData[] = JSON.parse(
      localStorage.getItem("bmi_history") || "[]",
    );
    history.unshift(data);
    localStorage.setItem("bmi_history", JSON.stringify(history.slice(0, 20)));

    navigate("/bmi/result");
  };

  const handleReset = () => {
    setHeight("");
    setWeight("");
    setError("");
    localStorage.removeItem("bmi_last_input");
    localStorage.removeItem("bmi_result");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{t("bmi.calc_heading")}</h2>
      <p className={styles.sub}>{t("bmi.calc_sub")}</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="height">{t("bmi.height_label")}</label>
          <div className={styles.inputWrap}>
            <input
              id="height"
              type="number"
              min={50}
              max={250}
              step={0.1}
              placeholder="170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className={styles.input}
            />
            <span className={styles.unit}>cm</span>
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="weight">{t("bmi.weight_label")}</label>
          <div className={styles.inputWrap}>
            <input
              id="weight"
              type="number"
              min={10}
              max={500}
              step={0.1}
              placeholder="70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={styles.input}
            />
            <span className={styles.unit}>kg</span>
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <PrimaryButton type="submit">{t("bmi.calc_btn")}</PrimaryButton>
          <SecondaryButton type="button" onClick={handleReset}>
            {t("bmi.reset_btn")}
          </SecondaryButton>
        </div>
      </form>
    </div>
  );
};

export default BMICalculator;
