import React, { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styles from "./FormBuilderApp.module.css";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type FieldType = "text" | "textarea" | "dropdown";

interface DropdownOption {
  id: string;
  label: string;
}

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  options: DropdownOption[]; // only used by dropdown
}

interface ToolboxItem {
  type: FieldType;
  icon: string;
  labelKey: string;
  descKey: string;
}

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const TOOLBOX_ITEMS: ToolboxItem[] = [
  {
    type: "text",
    icon: "✏️",
    labelKey: "fb.tool_text",
    descKey: "fb.tool_text_desc",
  },
  {
    type: "textarea",
    icon: "📝",
    labelKey: "fb.tool_textarea",
    descKey: "fb.tool_textarea_desc",
  },
  {
    type: "dropdown",
    icon: "🔽",
    labelKey: "fb.tool_dropdown",
    descKey: "fb.tool_dropdown_desc",
  },
];

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function createField(type: FieldType): FormField {
  return {
    id: uid(),
    type,
    label:
      type === "text"
        ? "Text Input"
        : type === "textarea"
          ? "Textarea"
          : "Dropdown",
    placeholder: type === "dropdown" ? "" : "Enter value…",
    required: false,
    options:
      type === "dropdown"
        ? [
            { id: uid(), label: "Option 1" },
            { id: uid(), label: "Option 2" },
          ]
        : [],
  };
}

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */

/** Inline editable field in the canvas */
function FieldCard({
  field,
  index,
  total,
  onUpdate,
  onDelete,
  onMove,
  dragHandleProps,
}: {
  field: FormField;
  index: number;
  total: number;
  onUpdate: (id: string, patch: Partial<FormField>) => void;
  onDelete: (id: string) => void;
  onMove: (from: number, to: number) => void;
  dragHandleProps: {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragEnd: () => void;
  };
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const typeLabel =
    field.type === "text"
      ? t("fb.tool_text")
      : field.type === "textarea"
        ? t("fb.tool_textarea")
        : t("fb.tool_dropdown");

  const typeIcon =
    field.type === "text" ? "✏️" : field.type === "textarea" ? "📝" : "🔽";

  return (
    <div className={styles.fieldCard} {...dragHandleProps}>
      {/* ── Header ── */}
      <div className={styles.fieldCardHeader}>
        <div className={styles.fieldCardLeft}>
          <span className={styles.dragHandle} title={t("fb.drag_to_reorder")}>
            ⠿
          </span>
          <span className={styles.fieldTypeTag}>
            {typeIcon} {typeLabel}
          </span>
          <span className={styles.fieldLabelPreview}>{field.label}</span>
        </div>
        <div className={styles.fieldCardActions}>
          <button
            className={styles.iconBtn}
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0}
            title={t("fb.move_up")}
            type="button"
          >
            ↑
          </button>
          <button
            className={styles.iconBtn}
            onClick={() => onMove(index, index + 1)}
            disabled={index === total - 1}
            title={t("fb.move_down")}
            type="button"
          >
            ↓
          </button>
          <button
            className={`${styles.iconBtn} ${expanded ? styles.iconBtnActive : ""}`}
            onClick={() => setExpanded((p) => !p)}
            title={t("fb.edit")}
            type="button"
          >
            ✎
          </button>
          <button
            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
            onClick={() => onDelete(field.id)}
            title={t("fb.delete")}
            type="button"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Edit Panel ── */}
      {expanded && (
        <div className={styles.editPanel}>
          <div className={styles.editRow}>
            <label className={styles.editLabel}>{t("fb.label")}</label>
            <input
              className={styles.editInput}
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.target.value })}
            />
          </div>

          {field.type !== "dropdown" && (
            <div className={styles.editRow}>
              <label className={styles.editLabel}>{t("fb.placeholder")}</label>
              <input
                className={styles.editInput}
                value={field.placeholder}
                onChange={(e) =>
                  onUpdate(field.id, { placeholder: e.target.value })
                }
              />
            </div>
          )}

          <div className={styles.editRow}>
            <label className={styles.editLabel}>{t("fb.required")}</label>
            <div className={styles.toggleWrapper}>
              <button
                type="button"
                role="switch"
                aria-checked={field.required}
                className={`${styles.toggle} ${field.required ? styles.toggleOn : ""}`}
                onClick={() =>
                  onUpdate(field.id, { required: !field.required })
                }
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </div>

          {field.type === "dropdown" && (
            <div className={styles.editRow}>
              <label className={styles.editLabel}>{t("fb.options")}</label>
              <div className={styles.optionsList}>
                {field.options.map((opt, oi) => (
                  <div key={opt.id} className={styles.optionRow}>
                    <input
                      className={styles.editInput}
                      value={opt.label}
                      onChange={(e) => {
                        const next = field.options.map((o, idx) =>
                          idx === oi ? { ...o, label: e.target.value } : o,
                        );
                        onUpdate(field.id, { options: next });
                      }}
                    />
                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                      onClick={() => {
                        const next = field.options.filter(
                          (_, idx) => idx !== oi,
                        );
                        onUpdate(field.id, { options: next });
                      }}
                      disabled={field.options.length <= 1}
                      title={t("fb.delete")}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className={styles.addOptionBtn}
                  onClick={() => {
                    onUpdate(field.id, {
                      options: [
                        ...field.options,
                        {
                          id: uid(),
                          label: `Option ${field.options.length + 1}`,
                        },
                      ],
                    });
                  }}
                >
                  + {t("fb.add_option")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Preview ── */}
      <div className={styles.fieldPreview}>
        <span className={styles.fieldPreviewLabel}>
          {field.label}
          {field.required && <span className={styles.requiredStar}> *</span>}
        </span>
        {field.type === "text" && (
          <div className={styles.previewInput}>{field.placeholder || "…"}</div>
        )}
        {field.type === "textarea" && (
          <div className={`${styles.previewInput} ${styles.previewTextarea}`}>
            {field.placeholder || "…"}
          </div>
        )}
        {field.type === "dropdown" && (
          <div className={styles.previewSelect}>
            <span>{field.options[0]?.label ?? t("fb.select")}</span>
            <span className={styles.previewSelectArrow}>▾</span>
          </div>
        )}
      </div>
    </div>
  );
}

/** Modal showing the rendered form */
function PreviewModal({
  fields,
  onClose,
}: {
  fields: FormField[];
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t("fb.preview_title")}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{t("fb.preview_title")}</h2>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onClose}
            aria-label={t("fb.close")}
          >
            ✕
          </button>
        </div>
        <div className={styles.modalBody}>
          {fields.length === 0 ? (
            <p className={styles.modalEmpty}>{t("fb.empty_preview")}</p>
          ) : (
            <form
              className={styles.previewForm}
              onSubmit={(e) => e.preventDefault()}
            >
              {fields.map((field) => (
                <div key={field.id} className={styles.previewFormGroup}>
                  <label className={styles.previewFormLabel}>
                    {field.label}
                    {field.required && (
                      <span className={styles.requiredStar}> *</span>
                    )}
                  </label>
                  {field.type === "text" && (
                    <input
                      className={styles.previewFormInput}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  {field.type === "textarea" && (
                    <textarea
                      className={`${styles.previewFormInput} ${styles.previewFormTextarea}`}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={4}
                    />
                  )}
                  {field.type === "dropdown" && (
                    <select
                      className={styles.previewFormInput}
                      required={field.required}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        {t("fb.select")}…
                      </option>
                      {field.options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              <button type="submit" className={styles.submitBtn}>
                {t("fb.submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
const FormBuilderApp: React.FC = () => {
  const { t } = useTranslation();
  const [fields, setFields] = useState<FormField[]>([]);
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const dragFromToolbox = useRef<FieldType | null>(null);
  const dragFromCanvas = useRef<number | null>(null);
  const dragOverCanvas = useRef<number | null>(null);

  /* ── Handlers ── */
  const addField = useCallback((type: FieldType) => {
    setFields((prev) => [...prev, createField(type)]);
  }, []);

  const updateField = useCallback((id: string, patch: Partial<FormField>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    );
  }, []);

  const deleteField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const moveField = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= fields.length) return;
      setFields((prev) => {
        const next = [...prev];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        return next;
      });
    },
    [fields.length],
  );

  /* ── Toolbox drag ── */
  const onToolboxDragStart = (type: FieldType) => {
    dragFromToolbox.current = type;
    dragFromCanvas.current = null;
  };

  /* ── Canvas drop zone ── */
  const onCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCanvas(true);
  };

  const onCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCanvas(false);
    if (dragFromToolbox.current) {
      addField(dragFromToolbox.current);
      dragFromToolbox.current = null;
    }
  };

  const onCanvasDragLeave = () => setIsDragOverCanvas(false);

  /* ── Card re-order drag ── */
  const onCardDragStart = (e: React.DragEvent, index: number) => {
    dragFromCanvas.current = index;
    dragFromToolbox.current = null;
    e.dataTransfer.effectAllowed = "move";
  };

  const onCardDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    dragOverCanvas.current = index;
    setIsDragOverCanvas(false);
  };

  const onCardDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      dragFromCanvas.current !== null &&
      dragOverCanvas.current !== null &&
      dragFromCanvas.current !== dragOverCanvas.current
    ) {
      moveField(dragFromCanvas.current, dragOverCanvas.current);
    }
    dragFromCanvas.current = null;
    dragOverCanvas.current = null;
  };

  const onCardDragEnd = () => {
    dragFromCanvas.current = null;
    dragOverCanvas.current = null;
  };

  return (
    <div className={styles.page}>
      {/* ══ Header ════════════════════════════════ */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>🧱</span>
            <div>
              <h1 className={styles.headerTitle}>{t("fb.title")}</h1>
              <p className={styles.headerSub}>{t("fb.subtitle")}</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.fieldCount}>
              {fields.length} {t("fb.fields")}
            </span>
            <button
              type="button"
              className={styles.previewBtn}
              onClick={() => setShowPreview(true)}
            >
              <span>👁</span> {t("fb.preview_btn")}
            </button>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setFields([])}
              disabled={fields.length === 0}
            >
              {t("fb.clear")}
            </button>
          </div>
        </div>
      </header>

      {/* ══ Workspace ═════════════════════════════ */}
      <div className={styles.workspace}>
        {/* ── Toolbox ── */}
        <aside className={styles.toolbox}>
          <h2 className={styles.toolboxTitle}>{t("fb.toolbox")}</h2>
          <p className={styles.toolboxHint}>{t("fb.toolbox_hint")}</p>
          <div className={styles.toolboxList}>
            {TOOLBOX_ITEMS.map((item) => (
              <div
                key={item.type}
                className={styles.toolboxItem}
                draggable
                onDragStart={() => onToolboxDragStart(item.type)}
                onClick={() => addField(item.type)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && addField(item.type)}
                aria-label={t(item.labelKey)}
              >
                <span className={styles.toolboxIcon}>{item.icon}</span>
                <div className={styles.toolboxMeta}>
                  <span className={styles.toolboxLabel}>
                    {t(item.labelKey)}
                  </span>
                  <span className={styles.toolboxDesc}>{t(item.descKey)}</span>
                </div>
                <span className={styles.toolboxPlus}>+</span>
              </div>
            ))}
          </div>

          <div className={styles.toolboxTip}>
            <span className={styles.toolboxTipIcon}>💡</span>
            <span>{t("fb.toolbox_tip")}</span>
          </div>
        </aside>

        {/* ── Canvas ── */}
        <main
          className={`${styles.canvas} ${isDragOverCanvas ? styles.canvasDragOver : ""}`}
          onDragOver={onCanvasDragOver}
          onDrop={onCanvasDrop}
          onDragLeave={onCanvasDragLeave}
        >
          {fields.length === 0 ? (
            <div className={styles.canvasEmpty}>
              <div className={styles.canvasEmptyIcon}>⊕</div>
              <p className={styles.canvasEmptyTitle}>{t("fb.canvas_empty")}</p>
              <p className={styles.canvasEmptyHint}>{t("fb.canvas_hint")}</p>
            </div>
          ) : (
            <div className={styles.fieldList}>
              {fields.map((field, i) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  index={i}
                  total={fields.length}
                  onUpdate={updateField}
                  onDelete={deleteField}
                  onMove={moveField}
                  dragHandleProps={{
                    draggable: true,
                    onDragStart: (e) => onCardDragStart(e, i),
                    onDragOver: (e) => onCardDragOver(e, i),
                    onDrop: onCardDrop,
                    onDragEnd: onCardDragEnd,
                  }}
                />
              ))}
            </div>
          )}

          {fields.length > 0 && (
            <div
              className={`${styles.dropZoneBottom} ${isDragOverCanvas ? styles.dropZoneActive : ""}`}
            >
              <span>⊕ {t("fb.drop_here")}</span>
            </div>
          )}
        </main>
      </div>

      {/* ══ Preview Modal ══════════════════════════ */}
      {showPreview && (
        <PreviewModal fields={fields} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

export default FormBuilderApp;
