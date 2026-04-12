import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SearchForm.module.css";

interface Props {
  onSearch: (query: string) => void;
  loading: boolean;
}

const SearchForm: React.FC<Props> = ({ onSearch, loading }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <div className={styles.inputRow}>
        <span className={styles.icon} aria-hidden="true">
          📚
        </span>
        <input
          className={styles.input}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("books.search_placeholder")}
          aria-label={t("books.search_placeholder")}
          disabled={loading}
        />
        {value && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => setValue("")}
            aria-label="Clear"
            tabIndex={-1}
          >
            ✕
          </button>
        )}
      </div>
      <button
        className={styles.btn}
        type="submit"
        disabled={loading || !value.trim()}
      >
        {loading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : (
          "🔍"
        )}
        {loading ? t("books.searching") : t("books.search_btn")}
      </button>
    </form>
  );
};

export default SearchForm;
