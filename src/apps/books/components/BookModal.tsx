import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BookVolume } from "../types";
import styles from "./BookModal.module.css";

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='192' viewBox='0 0 128 192'%3E%3Crect width='128' height='192' fill='%23f0eeeb'/%3E%3Ctext x='64' y='104' font-size='48' text-anchor='middle' dominant-baseline='middle' fill='%23ccc'%3E📖%3C/text%3E%3C/svg%3E";

interface Props {
  book: BookVolume;
  onClose: () => void;
}

const BookModal: React.FC<Props> = ({ book, onClose }) => {
  const { t } = useTranslation();
  const info = book.volumeInfo;

  const cover =
    info.imageLinks?.thumbnail?.replace("http:", "https:") ??
    info.imageLinks?.smallThumbnail?.replace("http:", "https:") ??
    FALLBACK;

  const authors = info.authors?.join(", ") ?? t("books.unknown_author");

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const rows: { label: string; value: string | number | undefined }[] = [
    { label: t("books.detail_authors"), value: authors },
    { label: t("books.detail_publisher"), value: info.publisher },
    { label: t("books.detail_published"), value: info.publishedDate },
    { label: t("books.detail_pages"), value: info.pageCount },
    { label: t("books.detail_language"), value: info.language?.toUpperCase() },
    {
      label: t("books.detail_rating"),
      value: info.averageRating
        ? `${info.averageRating} / 5 (${info.ratingsCount ?? 0} votes)`
        : undefined,
    },
    { label: t("books.detail_categories"), value: info.categories?.join(", ") },
  ];

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={info.title}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={t("books.close")}
          type="button"
        >
          ✕
        </button>

        <div className={styles.top}>
          <img
            className={styles.cover}
            src={cover}
            alt={info.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK;
            }}
          />
          <div className={styles.topInfo}>
            <h2 className={styles.title}>{info.title}</h2>
            <p className={styles.authors}>{authors}</p>

            {info.description && (
              <p className={styles.desc}>
                {info.description.length > 420
                  ? info.description.slice(0, 420) + "…"
                  : info.description}
              </p>
            )}

            {info.previewLink && (
              <a
                className={styles.previewLink}
                href={info.previewLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("books.preview_on_google")} →
              </a>
            )}
          </div>
        </div>

        <div className={styles.details}>
          {rows.map(
            ({ label, value }) =>
              value !== undefined &&
              value !== "" && (
                <div key={label} className={styles.row}>
                  <span className={styles.rowLabel}>{label}</span>
                  <span className={styles.rowValue}>{value}</span>
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

export default BookModal;
