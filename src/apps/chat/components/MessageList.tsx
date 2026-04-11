import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AnyMessage, ChatMessage } from "../types";
import styles from "./MessageList.module.css";

interface Props {
  messages: AnyMessage[];
  mySocketId: string;
}

const fmt = (at: number) =>
  new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const MessageList: React.FC<Props> = ({ messages, mySocketId }) => {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.list}>
      {messages.map((msg) => {
        if (msg.type === "join") {
          return (
            <div key={msg.id} className={styles.system}>
              {t("chat.user_joined", { username: msg.username })}
            </div>
          );
        }
        if (msg.type === "leave") {
          return (
            <div key={msg.id} className={styles.system}>
              {t("chat.user_left", { username: msg.username })}
            </div>
          );
        }
        const chatMsg = msg as ChatMessage;
        const isOwn = chatMsg.socketId === mySocketId;
        return (
          <div
            key={chatMsg.id}
            className={`${styles.bubble} ${isOwn ? styles.own : styles.other}`}
          >
            {!isOwn && (
              <span className={styles.author}>{chatMsg.username}</span>
            )}
            <div className={styles.text}>{chatMsg.text}</div>
            <span className={styles.time}>{fmt(chatMsg.at)}</span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
