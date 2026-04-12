import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBookSearch } from "./hooks/useBookSearch";
import SearchForm from "./components/SearchForm";
import BookCard from "./components/BookCard";
import BookModal from "./components/BookModal";
import { BookVolume } from "./types";
import styles from "./BooksApp.module.css";

const BooksApp: React.FC = () => {
  const { t } = useTranslation();
  const { books, loading, error, totalItems, lastQuery, search } =
    useBookSearch();
  const [selectedBook, setSelectedBook] = useState<BookVolume | null>(null);
  const hasSearched = lastQuery !== "";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.titleGroup}>
            <span className={styles.titleIcon}>📚</span>
            <div>
              <h1 className={styles.title}>{t("books.app_title")}</h1>
              <p className={styles.subtitle}>{t("books.subtitle")}</p>
            </div>
          </div>
          <SearchForm onSearch={search} loading={loading} />
        </div>
      </header>

      <main className={styles.main}>
        {/* Idle state */}
        {!hasSearched && !loading && (
          <div className={styles.idle}>
            <span className={styles.idleIcon}>🔍</span>
            <p>{t("books.idle")}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className={styles.grid}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className={styles.errorBox}>
            <span>⚠️</span>
            <p>{t("books.error_fetch")}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && hasSearched && (
          <>
            <p className={styles.resultMeta}>
              {books.length === 0
                ? t("books.no_results", { query: lastQuery })
                : t("books.result_count", {
                    count: books.length,
                    total: totalItems,
                    query: lastQuery,
                  })}
            </p>

            {books.length > 0 && (
              <div className={styles.grid}>
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onDetail={setSelectedBook}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

export default BooksApp;
