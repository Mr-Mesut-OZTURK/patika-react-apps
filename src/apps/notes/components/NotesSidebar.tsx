import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNotes } from "../contexts/NotesContext";
import { Note, NOTE_COLORS } from "../types";
import styles from "./NotesSidebar.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NotesSidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id: activeId } = useParams<{ id: string }>();
  const { notes, createNote, deleteNote, togglePin } = useNotes();
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleNew = () => {
    const note = createNote();
    navigate(`/notes/${note.id}`);
    onClose();
  };

  const handleSelect = (id: string) => {
    navigate(`/notes/${id}`);
    setConfirmId(null);
    onClose();
  };

  const handlePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    togglePin(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirmId === id) {
      deleteNote(id);
      if (activeId === id) navigate("/notes");
      setConfirmId(null);
    } else {
      setConfirmId(id);
      setTimeout(() => setConfirmId((c) => (c === id ? null : c)), 3000);
    }
  };

  const fmtDate = (iso: string): string => {
    const d = new Date(iso);
    const mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 1) return t("notes.just_now");
    if (mins < 60) return `${mins} ${t("notes.min_ago")}`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ${t("notes.hr_ago")}`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return t("notes.yesterday");
    return d.toLocaleDateString(i18n.language, {
      day: "numeric",
      month: "short",
    });
  };

  const sorted = useMemo(() => {
    let list = [...notes];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, search]);

  const pinned = sorted.filter((n) => n.pinned);
  const others = sorted.filter((n) => !n.pinned);

  const renderItem = (note: Note) => {
    const isActive = note.id === activeId;
    const isConfirm = confirmId === note.id;
    return (
      <div
        key={note.id}
        className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
        style={
          isActive ? { borderLeftColor: NOTE_COLORS[note.color].accent } : {}
        }
        onClick={() => handleSelect(note.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleSelect(note.id)}
      >
        <span className={styles.itemEmoji}>{note.emoji}</span>
        <div className={styles.itemMeta}>
          <span className={styles.itemTitle}>
            {note.title || t("notes.untitled")}
          </span>
          <span className={styles.itemDate}>{fmtDate(note.updatedAt)}</span>
          {note.content && (
            <span className={styles.itemPreview}>
              {note.content.slice(0, 55).replace(/\n/g, " ")}
            </span>
          )}
        </div>
        <div className={styles.itemActions}>
          <button
            className={`${styles.actionBtn} ${
              note.pinned ? styles.pinActive : ""
            }`}
            onClick={(e) => handlePin(e, note.id)}
            title={note.pinned ? t("notes.unpin") : t("notes.pin")}
          >
            📌
          </button>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn} ${
              isConfirm ? styles.deleteBtnConfirm : ""
            }`}
            onClick={(e) => handleDelete(e, note.id)}
            title={isConfirm ? t("notes.confirm_delete") : t("notes.delete")}
          >
            {isConfirm ? "✓" : "🗑"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.header}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>📒</span>
            <span className={styles.brandName}>{t("notes.app_title")}</span>
          </div>
          <button
            className={styles.newBtn}
            onClick={handleNew}
            title={t("notes.new_note")}
          >
            +
          </button>
        </div>

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("notes.search_placeholder")}
          />
          {search && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.list}>
          {notes.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>{t("notes.no_notes")}</p>
              <button className={styles.createFirstBtn} onClick={handleNew}>
                {t("notes.create_first")}
              </button>
            </div>
          ) : sorted.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>{t("notes.no_search_results")}</p>
            </div>
          ) : (
            <>
              {pinned.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionLabel}>{t("notes.pinned")}</div>
                  {pinned.map(renderItem)}
                </div>
              )}
              {others.length > 0 && (
                <div className={styles.section}>
                  {pinned.length > 0 && (
                    <div className={styles.sectionLabel}>
                      {t("notes.all_notes")}
                    </div>
                  )}
                  {others.map(renderItem)}
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.count}>
            {notes.length} {t("notes.notes_count")}
          </span>
        </div>
      </aside>
    </>
  );
};

export default NotesSidebar;
