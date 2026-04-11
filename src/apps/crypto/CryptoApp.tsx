import React from "react";
import { useTranslation } from "react-i18next";
import { useCryptoList } from "./hooks/useCryptoList";
import SearchBar from "./components/SearchBar";
import CoinCard from "./components/CoinCard";
import styles from "./CryptoApp.module.css";

const CryptoApp: React.FC = () => {
  const { t } = useTranslation();
  const { coins, loading, error, searchTerm, setSearchTerm, refetch } =
    useCryptoList();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.titleGroup}>
            <span className={styles.titleIcon}>🪙</span>
            <div>
              <h1 className={styles.title}>{t("crypto.app_title")}</h1>
              <p className={styles.subtitle}>{t("crypto.subtitle")}</p>
            </div>
          </div>
          <button
            className={styles.refreshBtn}
            onClick={refetch}
            disabled={loading}
            aria-label={t("crypto.refresh")}
            type="button"
          >
            <span className={loading ? styles.spinning : ""}>↻</span>
            {t("crypto.refresh")}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.toolbar}>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          {!loading && !error && (
            <p className={styles.resultCount}>
              {coins.length} {t("crypto.coins_found")}
            </p>
          )}
        </div>

        {loading && (
          <div className={styles.skeletonGrid}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className={styles.errorBox}>
            <span className={styles.errorIcon}>⚠️</span>
            <p className={styles.errorMsg}>
              {error === "rate_limit"
                ? t("crypto.error_rate_limit")
                : t("crypto.error_fetch")}
            </p>
            <button className={styles.retryBtn} onClick={refetch} type="button">
              {t("crypto.retry")}
            </button>
          </div>
        )}

        {!loading && !error && coins.length === 0 && (
          <div className={styles.emptyBox}>
            <span>🔍</span>
            <p>{t("crypto.no_results")}</p>
          </div>
        )}

        {!loading && !error && coins.length > 0 && (
          <div className={styles.grid}>
            {coins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CryptoApp;
