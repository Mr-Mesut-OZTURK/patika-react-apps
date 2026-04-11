import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRickMorty } from "../contexts/RickMortyContext";
import styles from "./SearchBar.module.css";

const SearchBar: React.FC = () => {
  const { search, setSearch } = useRickMorty();
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(search);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSearch(inputValue.trim());
    },
    [inputValue, setSearch],
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder={t("rickmorty.search_placeholder")}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className={styles.btn} type="submit">
        {t("rickmorty.search_btn")}
      </button>
    </form>
  );
};

export default SearchBar;
