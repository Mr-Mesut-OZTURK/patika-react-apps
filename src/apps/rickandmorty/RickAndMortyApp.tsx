import React, { useState } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from "@apollo/client/link/http";
import { useTranslation } from "react-i18next";
import { RickMortyProvider } from "./contexts/RickMortyContext";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import CharacterList from "./components/CharacterList";
import styles from "./RickAndMortyApp.module.css";

const client = new ApolloClient({
  link: new HttpLink({ uri: "https://rickandmortyapi.com/graphql" }),
  cache: new InMemoryCache(),
});

const RickAndMortyApp: React.FC = () => {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <ApolloProvider client={client}>
      <RickMortyProvider>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Rick and Morty Characters</h1>
            <SearchBar />
            <button
              className={styles.filterToggle}
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
            >
              {filtersOpen
                ? t("rickmorty.filters_hide")
                : t("rickmorty.filters_show")}
            </button>
          </header>
          <aside
            className={`${styles.sidebar}${filtersOpen ? ` ${styles.sidebarOpen}` : ""}`}
          >
            <h2 className={styles.filterTitle}>
              {t("rickmorty.filters_title")}
            </h2>
            <Filters />
          </aside>
          <main className={styles.main}>
            <CharacterList />
          </main>
        </div>
      </RickMortyProvider>
    </ApolloProvider>
  );
};

export default RickAndMortyApp;
