import React, { useState, KeyboardEvent, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./MessageInput.module.css";

interface Props {
  onSend: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
}

const TYPING_TIMEOUT = 2000;

const MessageInput: React.FC<Props> = ({ onSend, onTyping }) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const typingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTyping = () => {
    if (typingRef.current) {
      typingRef.current = false;
      onTyping(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (!typingRef.current) {
      typingRef.current = true;
      onTyping(true);
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(stopTyping, TYPING_TIMEOUT);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onSend(trimmed);
      setText("");
      stopTyping();
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <textarea
        className={styles.textarea}
        placeholder={t("chat.msg_placeholder")}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        maxLength={2000}
      />
      <button
        className={styles.btn}
        onClick={handleSend}
        disabled={!text.trim()}
        aria-label={t("chat.send")}
      >
        ➤
      </button>
    </div>
  );
};

export default MessageInput;
