import React from "react";
import { useTranslation } from "react-i18next";
import { BookVolume } from "../types";
import styles from "./BookCard.module.css";

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='192' viewBox='0 0 128 192'%3E%3Crect width='128' height='192' fill='%23f0eeeb'/%3E%3Ctext x='64' y='104' font-size='48' text-anchor='middle' dominant-baseline='middle' fill='%23ccc'%3E📖%3C/text%3E%3C/svg%3E";

interface Props {
  book: BookVolume;
  onDetail: (book: BookVolume) => void;
}

const BookCard: React.FC<Props> = ({ book, onDetail }) => {
  const { t } = useTranslation();
  const info = book.volumeInfo;

  const cover =
    info.imageLinks?.thumbnail?.replace("http:", "https:") ??
    info.imageLinks?.smallThumbnail?.replace("http:", "https:") ??
    FALLBACK;

  const authors = info.authors?.join(", ") ?? t("books.unknown_author");
  const year = info.publishedDate?.slice(0, 4);

  return (
    <article className={styles.card}>
      <img
        className={styles.cover}
        src={cover}
        alt={info.title}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK;
        }}
      />

      <div className={styles.overlay}>
        <div className={styles.hoverInfo}>
          <p className={styles.authors} title={authors}>
            {authors}
          </p>
          {year && <p className={styles.year}>{year}</p>}
          {info.categories && (
            <p className={styles.category}>{info.categories[0]}</p>
          )}
          <button
            className={styles.detailBtn}
            onClick={() => onDetail(book)}
            type="button"
          >
            {t("books.detail")}
          </button>
        </div>

        <p className={styles.title} title={info.title}>
          {info.title}
        </p>
      </div>
    </article>
  );
};

export default BookCard;
