import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "../styled/Buttons";
import { BMIData } from "../types";
import DietList from "./DietList";
import styles from "./BMIResult.module.css";

const categoryColors: Record<string, string> = {
  underweight: "#3b82f6",
  normal: "#a6f080",
  overweight: "#f59e0b",
  obese: "#ef4444",
};

const bmiToPercent = (bmi: number) =>
  Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100));

const BMIResult: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState<BMIData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bmi_result");
    if (saved) setData(JSON.parse(saved));
  }, []);

  if (!data) {
    return (
      <div className={styles.empty}>
        <p>{t("bmi.no_result")}</p>
        <SecondaryButton onClick={() => navigate("/bmi")}>
          {t("bmi.go_calc")}
        </SecondaryButton>
      </div>
    );
  }

  const color = categoryColors[data.category];
  const percent = bmiToPercent(data.bmi);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div
          className={styles.cardHeader}
          style={{ borderTop: `4px solid ${color}` }}
        >
          <div className={styles.scoreRow}>
            <span className={styles.scoreLabel}>{t("bmi.your_bmi")}</span>
            <span className={styles.score} style={{ color }}>
              {data.bmi}
            </span>
          </div>
          <div
            className={styles.categoryBadge}
            style={{ background: color + "22", color }}
          >
            {t(`bmi.category_${data.category}`)}
          </div>
        </div>

        <div className={styles.gaugeContainer}>
          <div className={styles.gaugeTrack}>
            <div
              className={styles.gaugeFill}
              style={{ width: `${percent}%`, background: color }}
            />
            <div className={styles.gaugeMark} style={{ left: `${percent}%` }} />
          </div>
          <div className={styles.gaugeLabels}>
            <span>10</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>40+</span>
          </div>
          <div className={styles.gaugeZones}>
            <span style={{ color: "#3b82f6" }}>
              {t("bmi.category_underweight")}
            </span>
            <span style={{ color: "#a6f080" }}>{t("bmi.category_normal")}</span>
            <span style={{ color: "#f59e0b" }}>
              {t("bmi.category_overweight")}
            </span>
            <span style={{ color: "#ef4444" }}>{t("bmi.category_obese")}</span>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t("bmi.height_label")}</span>
            <span className={styles.statValue}>{data.height} cm</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t("bmi.weight_label")}</span>
            <span className={styles.statValue}>{data.weight} kg</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t("bmi.date_label")}</span>
            <span className={styles.statValue}>
              {new Date(data.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <DietList category={data.category} />

      <div className={styles.actions}>
        <SecondaryButton onClick={() => navigate("/bmi")}>
          {t("bmi.recalculate")}
        </SecondaryButton>
      </div>
    </div>
  );
};

export default BMIResult;
