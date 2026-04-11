import React from "react";
import { useRickMorty } from "../contexts/RickMortyContext";
import styles from "./Pagination.module.css";

interface Props {
  totalPages: number;
}

const Pagination: React.FC<Props> = ({ totalPages }) => {
  const { page, setPage } = useRickMorty();

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages,
  );

  return (
    <div className={styles.container}>
      <button
        className={styles.btn}
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        ‹ Prev
      </button>

      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <React.Fragment key={p}>
            {showEllipsis && <span className={styles.ellipsis}>…</span>}
            <button
              className={`${styles.pageBtn} ${p === page ? styles.active : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          </React.Fragment>
        );
      })}

      <button
        className={styles.btn}
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
      >
        Next ›
      </button>
    </div>
  );
};

export default Pagination;
