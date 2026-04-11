import React from "react";
import { useTranslation } from "react-i18next";
import { Coin } from "../types";
import styles from "./CoinCard.module.css";

interface Props {
  coin: Coin;
}

const fmt = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: n < 1 ? 6 : 2,
  }).format(n);

const fmtLarge = (n: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);

const CoinCard: React.FC<Props> = ({ coin }) => {
  const { t } = useTranslation();
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <article className={styles.card}>
      <div className={styles.rank}>#{coin.market_cap_rank}</div>

      <div className={styles.identity}>
        <img
          className={styles.logo}
          src={coin.image}
          alt={coin.name}
          loading="lazy"
        />
        <div>
          <p className={styles.name}>{coin.name}</p>
          <p className={styles.symbol}>{coin.symbol.toUpperCase()}</p>
        </div>
      </div>

      <div className={styles.priceRow}>
        <span className={styles.price}>{fmt(coin.current_price)}</span>
        <span
          className={`${styles.change} ${
            isPositive ? styles.positive : styles.negative
          }`}
        >
          {isPositive ? "▲" : "▼"}{" "}
          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </span>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t("crypto.market_cap")}</span>
          <span className={styles.statValue}>${fmtLarge(coin.market_cap)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t("crypto.volume_24h")}</span>
          <span className={styles.statValue}>
            ${fmtLarge(coin.total_volume)}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t("crypto.high_24h")}</span>
          <span className={styles.statValue}>{fmt(coin.high_24h)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t("crypto.low_24h")}</span>
          <span className={styles.statValue}>{fmt(coin.low_24h)}</span>
        </div>
      </div>
    </article>
  );
};

export default CoinCard;
