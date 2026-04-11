import React from "react";
import { useTranslation } from "react-i18next";
import { useMemoryGame } from "./hooks/useMemoryGame";
import Card from "./components/Card";
import styles from "./MemoryGame.module.css";

const MemoryGame: React.FC = () => {
  const { t } = useTranslation();
  const {
    cards,
    moves,
    bestScore,
    isGameOver,
    isNewRecord,
    flipCard,
    restart,
  } = useMemoryGame();

  const matchedCount = cards.filter((c) => c.isMatched).length / 2;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.titleGroup}>
            <span className={styles.titleIcon}>🧠</span>
            <div>
              <h1 className={styles.title}>{t("memory.app_title")}</h1>
              <p className={styles.subtitle}>{t("memory.subtitle")}</p>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t("memory.moves")}</span>
              <span className={styles.statValue}>{moves}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t("memory.best_score")}</span>
              <span className={styles.statValue}>
                {bestScore !== null ? bestScore : "—"}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t("memory.pairs")}</span>
              <span className={styles.statValue}>{matchedCount} / 6</span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {isGameOver && (
          <div className={styles.winBanner}>
            <span className={styles.winEmoji}>🎉</span>
            <p className={styles.winTitle}>{t("memory.game_over")}</p>
            <p className={styles.winSub}>
              {t("memory.finished_in", { moves })}
            </p>
            {isNewRecord && (
              <p className={styles.newRecord}>🏆 {t("memory.new_record")}</p>
            )}
          </div>
        )}

        <div className={styles.board}>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={flipCard}
              disabled={isGameOver}
            />
          ))}
        </div>

        <button className={styles.restartBtn} onClick={restart} type="button">
          ↺ {t("memory.restart")}
        </button>
      </main>
    </div>
  );
};

export default MemoryGame;
