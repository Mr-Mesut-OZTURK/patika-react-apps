import React from "react";
import { useTranslation } from "react-i18next";
import { ChatUser } from "../types";
import styles from "./UserPanel.module.css";

interface Props {
  users: ChatUser[];
  mySocketId: string;
}

const COLORS = [
  "#00b894",
  "#0984e3",
  "#6c5ce7",
  "#e17055",
  "#fdcb6e",
  "#fd79a8",
  "#00cec9",
  "#55efc4",
];

const colorFor = (username: string) =>
  COLORS[
    username.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
      COLORS.length
  ];

const UserPanel: React.FC<Props> = ({ users, mySocketId }) => {
  const { t } = useTranslation();

  return (
    <aside className={styles.panel}>
      <div className={styles.title}>
        <span className={styles.dot} />
        {t("chat.users_title")}
        <span className={styles.count}>{users.length}</span>
      </div>
      <ul className={styles.list}>
        {users.map((u) => (
          <li key={u.socketId} className={styles.item}>
            <span
              className={styles.avatar}
              style={{ background: colorFor(u.username) }}
            >
              {u.username[0].toUpperCase()}
            </span>
            <span className={styles.name}>
              {u.username}
              {u.socketId === mySocketId && (
                <span className={styles.you}>{t("chat.you")}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default UserPanel;
