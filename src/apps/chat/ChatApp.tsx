import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSocket } from "./hooks/useSocket";
import JoinScreen from "./components/JoinScreen";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import UserPanel from "./components/UserPanel";
import styles from "./ChatApp.module.css";

const ChatApp: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const {
    messages,
    users,
    connected,
    typingUsers,
    sendMessage,
    emitTyping,
    mySocketId,
  } = useSocket(username);

  const formatTyping = (): string | null => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1)
      return t("chat.typing_one", { user: typingUsers[0] });
    if (typingUsers.length === 2)
      return t("chat.typing_two", {
        user1: typingUsers[0],
        user2: typingUsers[1],
      });
    return t("chat.typing_many");
  };

  const typingText = formatTyping();

  return (
    <div className={styles.root}>
      {!username && <JoinScreen onJoin={setUsername} />}

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.appTitle}>{t("chat.app_title")}</span>
        </div>
        <div className={styles.headerRight}>
          <span
            className={`${styles.dot} ${
              connected ? styles.dotOn : styles.dotOff
            }`}
          />
          <span className={styles.statusText}>
            {connected ? t("chat.connected") : t("chat.disconnected")}
          </span>
        </div>
      </header>

      {username && !connected && (
        <div className={styles.disconnectBanner}>
          ⚠️ {t("chat.not_connected")}
          <code className={styles.startCmd}>
            cd server &amp;&amp; npm run dev
          </code>
        </div>
      )}

      <div className={styles.chatArea}>
        <div className={styles.mainChat}>
          <MessageList messages={messages} mySocketId={mySocketId} />
          {typingText && <div className={styles.typing}>{typingText}</div>}
          <MessageInput onSend={sendMessage} onTyping={emitTyping} />
        </div>

        {users.length > 0 && (
          <UserPanel users={users} mySocketId={mySocketId} />
        )}
      </div>
    </div>
  );
};

export default ChatApp;
