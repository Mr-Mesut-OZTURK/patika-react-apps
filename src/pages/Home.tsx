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
    gradient: "linear-gradient(135deg,#74b9ff,#0984e3)",
  },
  {
    emoji: "🧪",
    titleKey: "nav.rickmorty",
    descKey: "home.rickmorty_desc",
    tags: ["GraphQL", "Apollo Client", "Pagination"],
    path: "/rickmorty",
    gradient: "linear-gradient(135deg,#a8e6cf,#3d9970)",
  },
  {
    emoji: "📊",
    titleKey: "nav.bmi",
    descKey: "home.bmi_desc",
    tags: ["localStorage", "Styled Components", "React Router"],
    path: "/bmi",
    gradient: "linear-gradient(135deg,#fd79a8,#e84393)",
  },
  {
    emoji: "👗",
    titleKey: "nav.shop",
    descKey: "home.shop_desc",
    tags: ["Axios", "MockAPI.io", "Styled Components"],
    path: "/shop",
    gradient: "linear-gradient(135deg,#f8a5c2,#c0392b)",
  },
  {
    emoji: "📒",
    titleKey: "nav.notes",
    descKey: "home.notes_desc",
    tags: ["localStorage", "React Router", "Notion-like"],
    path: "/notes",
    gradient: "linear-gradient(135deg,#636e72,#2d3436)",
  },
  {
    emoji: "💬",
    titleKey: "nav.chat",
    descKey: "home.chat_desc",
    tags: ["Socket.io", "Real-time", "Node.js"],
    path: "/chat",
    gradient: "linear-gradient(135deg,#00b894,#00cec9)",
  },
  {
    emoji: "🪙",
    titleKey: "nav.crypto",
    descKey: "home.crypto_desc",
    tags: ["CoinGecko API", "Axios", "React Hooks"],
    path: "/crypto",
    gradient: "linear-gradient(135deg,#f9ca24,#f0932b)",
  },
  {
    emoji: "🧠",
    titleKey: "nav.memory",
    descKey: "home.memory_desc",
    tags: ["localStorage", "CSS 3D Flip", "Game Logic"],
    path: "/memory",
    gradient: "linear-gradient(135deg,#6c5ce7,#a29bfe)",
  },
  {
    emoji: "📚",
    titleKey: "nav.books",
    descKey: "home.books_desc",
    tags: ["Google Books API", "Axios", "Modal"],
    path: "/books",
    gradient: "linear-gradient(135deg,#e17055,#d63031)",
  },
  {
    emoji: "✊",
    titleKey: "nav.rps",
    descKey: "home.rps_desc",
    tags: ["CSS Animations", "State Machine", "Game Logic"],
    path: "/rps",
    gradient: "linear-gradient(135deg,#a29bfe,#6c5ce7)",
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.orb1} aria-hidden="true" />
        <div className={styles.orb2} aria-hidden="true" />
        <div className={styles.orb3} aria-hidden="true" />

        <div className={styles.langRow}>
          <LanguageSwitcher />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badge}>⚡ {t("home.badge")}</div>
          <h1 className={styles.heroTitle}>{t("home.title")}</h1>
          <p className={styles.heroSub}>{t("home.subtitle")}</p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>10</strong>
              <span>{t("home.stat_apps")}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <strong>15+</strong>
              <span>{t("home.stat_tech")}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <strong>TS</strong>
              <span>TypeScript</span>
            </div>
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <span className={styles.chevron} />
        </div>
      </header>

      {/* ── Projects ── */}
      <main className={styles.main}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLine} />
          <h2 className={styles.sectionTitle}>{t("home.projects")}</h2>
          <div className={styles.sectionLine} />
        </div>

        <div className={styles.grid}>
          {apps.map((app, i) => (
            <button
              key={app.path}
              className={styles.card}
              style={{ "--i": i } as React.CSSProperties}
              onClick={() => navigate(app.path)}
            >
              <div
                className={styles.cardBanner}
                style={{ background: app.gradient }}
              >
                <div className={styles.bannerOverlay} />
                <span className={styles.cardEmoji}>{app.emoji}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{t(app.titleKey)}</h3>
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
        </div>
      </main>
    </div>
  );
};

export default Home;
