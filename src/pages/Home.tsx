import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Home.module.css";
import LanguageSwitcher from "../components/LanguageSwitcher";

interface AppCard {
  emoji: string;
  titleKey: string;
  descKey: string;
  tags: string[];
  path: string;
  gradient: string;
}

const apps: AppCard[] = [
  {
    emoji: "🌤",
    titleKey: "nav.weather",
    descKey: "home.weather_desc",
    tags: ["OpenWeatherMap API", "React Context", "MUI"],
    path: "/weather",
    gradient: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
  },
  {
    emoji: "🧪",
    titleKey: "nav.rickmorty",
    descKey: "home.rickmorty_desc",
    tags: ["GraphQL", "Apollo Client", "Pagination"],
    path: "/rickmorty",
    gradient: "linear-gradient(135deg, #a8e6cf 0%, #3d9970 100%)",
  },
  {
    emoji: "📊",
    titleKey: "nav.bmi",
    descKey: "home.bmi_desc",
    tags: ["localStorage", "Styled Components", "React Router"],
    path: "/bmi",
    gradient: "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)",
  },
  {
    emoji: "👗",
    titleKey: "nav.shop",
    descKey: "home.shop_desc",
    tags: ["Axios", "MockAPI.io", "Styled Components", "localStorage"],
    path: "/shop",
    gradient: "linear-gradient(135deg, #f8a5c2 0%, #c0392b 100%)",
  },
  {
    emoji: "📒",
    titleKey: "nav.notes",
    descKey: "home.notes_desc",
    tags: ["localStorage", "React Router", "Notion-like"],
    path: "/notes",
    gradient: "linear-gradient(135deg, #636e72 0%, #2d3436 100%)",
  },
  {
    emoji: "💬",
    titleKey: "nav.chat",
    descKey: "home.chat_desc",
    tags: ["Socket.io", "Real-time", "Node.js"],
    path: "/chat",
    gradient: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
  },
  {
    emoji: "🪙",
    titleKey: "nav.crypto",
    descKey: "home.crypto_desc",
    tags: ["CoinGecko API", "Axios", "React Hooks"],
    path: "/crypto",
    gradient: "linear-gradient(135deg, #f9ca24 0%, #f0932b 100%)",
  },
  {
    emoji: "🧠",
    titleKey: "nav.memory",
    descKey: "home.memory_desc",
    tags: ["localStorage", "CSS 3D Flip", "Game Logic"],
    path: "/memory",
    gradient: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
  },
  {
    emoji: "📚",
    titleKey: "nav.books",
    descKey: "home.books_desc",
    tags: ["Google Books API", "Axios", "Modal"],
    path: "/books",
    gradient: "linear-gradient(135deg, #e17055 0%, #d63031 100%)",
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroTop}>
          <LanguageSwitcher />
        </div>
        <h1 className={styles.heroTitle}>{t("home.title")}</h1>
        <p className={styles.heroSub}>{t("home.subtitle")}</p>
      </header>

      <main className={styles.grid}>
        {apps.map((app) => (
          <button
            key={app.path}
            className={styles.card}
            onClick={() => navigate(app.path)}
          >
            <div
              className={styles.cardBanner}
              style={{ background: app.gradient }}
            >
              <span className={styles.cardEmoji}>{app.emoji}</span>
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{t(app.titleKey)}</h2>
              <p className={styles.cardDesc}>{t(app.descKey)}</p>
              <div className={styles.tags}>
                {app.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className={styles.cta}>{t("home.open")}</span>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
};

export default Home;
