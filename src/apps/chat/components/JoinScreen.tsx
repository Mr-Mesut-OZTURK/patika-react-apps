import React, { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import styles from "./JoinScreen.module.css";

interface Props {
  onJoin: (username: string) => void;
}

const JoinScreen: React.FC<Props> = ({ onJoin }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length >= 2 && trimmed.length <= 24) {
      onJoin(trimmed);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.icon}>💬</div>
        <h1 className={styles.title}>{t("chat.join_title")}</h1>
        <p className={styles.subtitle}>{t("chat.join_subtitle")}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            className={styles.input}
            placeholder={t("chat.username_placeholder")}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={24}
            autoFocus
          />
          <button
            type="submit"
            className={styles.btn}
            disabled={value.trim().length < 2}
          >
            {t("chat.join_btn")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinScreen;
