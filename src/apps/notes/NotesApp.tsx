import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NotesProvider, useNotes } from "./contexts/NotesContext";
import NotesSidebar from "./components/NotesSidebar";
import NoteEditor from "./components/NoteEditor";
import styles from "./NotesApp.module.css";

const EmptyState: React.FC<{ onNew: () => void }> = ({ onNew }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>📒</span>
      <h2 className={styles.emptyTitle}>{t("notes.select_or_create")}</h2>
      <p className={styles.emptySub}>{t("notes.empty_subtitle")}</p>
      <button className={styles.emptyBtn} onClick={onNew}>
        + {t("notes.new_note")}
      </button>
    </div>
  );
};

const NotesInner: React.FC = () => {
  const { createNote } = useNotes();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNew = () => {
    const note = createNote();
    navigate(`/notes/${note.id}`);
    setSidebarOpen(false);
  };

  return (
    <div className={styles.app}>
      <NotesSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={styles.mainWrap}>
        {/* Hamburger — mobile only (hidden on desktop via CSS) */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <main className={styles.main}>
          <Routes>
            <Route index element={<EmptyState onNew={handleNew} />} />
            <Route path=":id" element={<NoteEditor />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const NotesApp: React.FC = () => (
  <NotesProvider>
    <NotesInner />
  </NotesProvider>
);

export default NotesApp;
