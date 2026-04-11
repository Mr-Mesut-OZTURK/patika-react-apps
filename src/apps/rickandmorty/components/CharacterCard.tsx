import React from "react";
import { Character } from "../types";
import styles from "./CharacterCard.module.css";

interface Props {
  character: Character;
}

const statusColor: Record<string, string> = {
  Alive: "#55cc44",
  Dead: "#d63d2e",
  unknown: "#9e9e9e",
};

const CharacterCard: React.FC<Props> = ({ character }) => {
  return (
    <div className={styles.card}>
      <img
        src={character.image}
        alt={character.name}
        className={styles.image}
      />
      <div className={styles.body}>
        <h3 className={styles.name}>{character.name}</h3>
        <p className={styles.status}>
          <span
            className={styles.dot}
            style={{
              backgroundColor: statusColor[character.status] ?? "#9e9e9e",
            }}
          />
          {character.status} — {character.species}
        </p>
        <p className={styles.label}>Last known location:</p>
        <p className={styles.value}>{character.location.name}</p>
        <p className={styles.label}>Origin:</p>
        <p className={styles.value}>{character.origin.name}</p>
        <p className={styles.meta}>
          {character.gender} {character.type ? `• ${character.type}` : ""}
        </p>
      </div>
    </div>
  );
};

export default CharacterCard;
