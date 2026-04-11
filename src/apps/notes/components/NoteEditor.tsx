import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNotes } from "../contexts/NotesContext";
import { NOTE_COLORS, EMOJI_LIST, NoteColor } from "../types";
import styles from "./NoteEditor.module.css";

const NoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { notes, updateNote, deleteNote } = useNotes();
  const note = notes.find((n) => n.id === id);

  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  // Re-sync local state when navigating to a different note
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
    setEmojiOpen(false);
    setColorOpen(false);
    setConfirmDel(false);
    // Only re-run when the note ID changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  // Close emoji picker on outside click
  useEffect(() => {
    if (!emojiOpen) return;
    const fn = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setEmojiOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [emojiOpen]);

  if (!note) {
    return (
      <div className={styles.notFound}>
        <span>🪄</span>
        <p>{t("notes.note_not_found")}</p>
        <button onClick={() => navigate("/notes")}>{t("notes.back")}</button>
      </div>
    );
  }

  const { gradient, accent } = NOTE_COLORS[note.color];

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (id) updateNote(id, { title: v });
  };

  const handleContentChange = (v: string) => {
    setContent(v);
    if (id) updateNote(id, { content: v });
  };

  const handleEmojiSelect = (emoji: string) => {
    if (id) updateNote(id, { emoji });
    setEmojiOpen(false);
  };

  const handleColorSelect = (color: NoteColor) => {
    if (id) updateNote(id, { color });
    setColorOpen(false);
  };

  const handleDelete = () => {
    if (!confirmDel) {
      setConfirmDel(true);
      setTimeout(() => setConfirmDel(false), 3000);
      return;
    }
    if (id) deleteNote(id);
    navigate("/notes");
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const savedTime = new Date(note.updatedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.wrap}>
      {/* Coloured cover band */}
      <div className={styles.cover} style={{ background: gradient }}>
        <div className={styles.toolbar}>
          {/* Color picker */}
          <div className={styles.toolGroup}>
            <button
              className={`${styles.toolBtn} ${
                colorOpen ? styles.toolBtnActive : ""
              }`}
              onClick={() => {
                setColorOpen((o) => !o);
                setEmojiOpen(false);
              }}
              title={t("notes.change_color")}
            >
              🎨
            </button>
            {colorOpen && (
              <div className={styles.colorPicker}>
                {(Object.keys(NOTE_COLORS) as NoteColor[]).map((c) => (
                  <button
                    key={c}
                    className={`${styles.colorChip} ${
                      note.color === c ? styles.colorChipActive : ""
                    }`}
                    style={{ background: NOTE_COLORS[c].accent }}
                    onClick={() => handleColorSelect(c)}
                    title={c}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Delete */}
          <button
            className={`${styles.toolBtn} ${
              confirmDel ? styles.toolBtnDanger : ""
            }`}
            onClick={handleDelete}
            title={confirmDel ? t("notes.confirm_delete") : t("notes.delete")}
          >
            {confirmDel ? `⚠️ ${t("notes.confirm_yes")}` : "🗑️"}
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div className={styles.body}>
        {/* Emoji row with picker */}
        <div className={styles.emojiRow} ref={emojiRef}>
          <button
            className={styles.emojiBtn}
            onClick={() => {
              setEmojiOpen((o) => !o);
              setColorOpen(false);
            }}
            title={t("notes.change_emoji")}
            style={{ borderColor: emojiOpen ? accent : "transparent" }}
          >
            {note.emoji}
          </button>
          {emojiOpen && (
            <div className={styles.emojiPicker}>
              {EMOJI_LIST.map((em) => (
                <button
                  key={em}
                  className={`${styles.emojiOption} ${
                    note.emoji === em ? styles.emojiOptionActive : ""
                  }`}
                  onClick={() => handleEmojiSelect(em)}
                >
                  {em}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <input
          className={styles.titleInput}
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder={t("notes.title_placeholder")}
          autoFocus={!note.title}
        />

        {/* Accent divider */}
        <div className={styles.divider} style={{ background: accent }} />

        {/* Content */}
        <textarea
          ref={textareaRef}
          className={styles.contentArea}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={t("notes.content_placeholder")}
          spellCheck={false}
        />
      </div>

      {/* Footer stats */}
      <div className={styles.footer}>
        <span>
          {wordCount} {t("notes.words")}
        </span>
        <span className={styles.sep}>·</span>
        <span>
          {content.length} {t("notes.chars")}
        </span>
        <span className={styles.sep}>·</span>
        <span>
          {t("notes.last_saved")}: {savedTime}
        </span>
      </div>
    </div>
  );
};

export default NoteEditor;
