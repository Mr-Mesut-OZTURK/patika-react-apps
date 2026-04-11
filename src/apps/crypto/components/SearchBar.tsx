import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./SearchBar.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">
        🔍
      </span>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("crypto.search_placeholder")}
        aria-label={t("crypto.search_placeholder")}
      />
      {value && (
        <button
          className={styles.clear}
          onClick={() => onChange("")}
          aria-label="Clear search"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
