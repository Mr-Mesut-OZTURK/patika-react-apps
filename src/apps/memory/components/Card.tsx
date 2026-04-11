import React from "react";
import { CardType } from "../types";
import styles from "./Card.module.css";

interface Props {
  card: CardType;
  onClick: (id: number) => void;
  disabled: boolean;
}

const Card: React.FC<Props> = ({ card, onClick, disabled }) => {
  const isClickable = !disabled && !card.isFlipped && !card.isMatched;

  return (
    <div
      className={`${styles.scene} ${card.isMatched ? styles.matched : ""}`}
      onClick={() => isClickable && onClick(card.id)}
      role="button"
      aria-label={card.isFlipped || card.isMatched ? card.emoji : "Hidden card"}
      aria-pressed={card.isFlipped}
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={(e) => e.key === "Enter" && isClickable && onClick(card.id)}
    >
      <div
        className={`${styles.card} ${
          card.isFlipped || card.isMatched ? styles.flipped : ""
        }`}
      >
        <div className={styles.front}>❓</div>
        <div className={styles.back}>{card.emoji}</div>
      </div>
    </div>
  );
};

export default Card;
