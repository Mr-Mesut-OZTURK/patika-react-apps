import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "../styled/Buttons";
import styles from "./Contact.module.css";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = t("shop.contact_required");
    if (!form.email.trim()) {
      errs.email = t("shop.contact_required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t("shop.contact_invalid_email");
    }
    if (!form.subject.trim()) errs.subject = t("shop.contact_required");
    if (!form.message.trim()) errs.message = t("shop.contact_required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((er) => ({ ...er, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setForm(initialForm);
  };

  if (submitted) {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon}>✅</span>
        <h2 className={styles.successTitle}>
          {t("shop.contact_success_title")}
        </h2>
        <p className={styles.successText}>{t("shop.contact_success_text")}</p>
        <PrimaryButton onClick={() => setSubmitted(false)}>
          {t("shop.contact_send_another")}
        </PrimaryButton>
      </div>
    );
  }

  const SUBJECTS = [
    t("shop.subject_order"),
    t("shop.subject_return"),
    t("shop.subject_product"),
    t("shop.subject_other"),
  ];

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* Info panel */}
        <aside className={styles.info}>
          <h2 className={styles.infoTitle}>{t("shop.contact_title")}</h2>
          <p className={styles.infoText}>{t("shop.contact_subtitle")}</p>
          <ul className={styles.contactDetails}>
            <li>
              <span className={styles.detailIcon}>📍</span> İstanbul, Türkiye
            </li>
            <li>
              <span className={styles.detailIcon}>📧</span> destek@palashop.com
            </li>
            <li>
              <span className={styles.detailIcon}>📞</span> +90 850 123 45 67
            </li>
            <li>
              <span className={styles.detailIcon}>🕐</span>{" "}
              {t("shop.contact_hours")}
            </li>
          </ul>
        </aside>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h3 className={styles.formTitle}>{t("shop.contact_form_title")}</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                {t("shop.contact_name")}
              </label>
              <input
                id="name"
                name="name"
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                value={form.name}
                onChange={handleChange}
                placeholder={t("shop.contact_name_placeholder")}
                autoComplete="name"
              />
              {errors.name && (
                <span className={styles.error}>{errors.name}</span>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                {t("shop.contact_email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                value={form.email}
                onChange={handleChange}
                placeholder={t("shop.contact_email_placeholder")}
                autoComplete="email"
              />
              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="subject" className={styles.label}>
              {t("shop.contact_subject")}
            </label>
            <select
              id="subject"
              name="subject"
              className={`${styles.input} ${errors.subject ? styles.inputError : ""}`}
              value={form.subject}
              onChange={handleChange}
            >
              <option value="">{t("shop.contact_subject_placeholder")}</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.subject && (
              <span className={styles.error}>{errors.subject}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="message" className={styles.label}>
              {t("shop.contact_message")}
            </label>
            <textarea
              id="message"
              name="message"
              className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
              value={form.message}
              onChange={handleChange}
              placeholder={t("shop.contact_message_placeholder")}
              rows={5}
            />
            {errors.message && (
              <span className={styles.error}>{errors.message}</span>
            )}
          </div>

          <PrimaryButton type="submit">{t("shop.contact_send")}</PrimaryButton>
        </form>
      </div>
    </div>
  );
};

export default Contact;
