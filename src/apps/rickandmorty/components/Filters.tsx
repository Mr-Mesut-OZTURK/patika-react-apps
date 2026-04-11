import React from "react";
import { useQuery } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { GET_LOCATIONS } from "../graphql/queries";
import { useRickMorty } from "../contexts/RickMortyContext";
import { LocationInfo, LocationsData } from "../types";
import styles from "./Filters.module.css";

const GENDERS = ["", "Male", "Female", "Genderless", "unknown"];
const SPECIES = [
  "",
  "Human",
  "Alien",
  "Humanoid",
  "Robot",
  "Animal",
  "Mythological Creature",
  "unknown",
];
const STATUSES = ["", "Alive", "Dead", "unknown"];

const Filters: React.FC = () => {
  const {
    filter,
    setFilter,
    clearFilters,
    locationFilter,
    setLocationFilter,
    search,
  } = useRickMorty();
  const { data: locData } = useQuery<LocationsData>(GET_LOCATIONS);
  const { t } = useTranslation();

  const hasActive =
    !!search ||
    !!filter.gender ||
    !!filter.species ||
    !!filter.status ||
    !!locationFilter;

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <label className={styles.label}>{t("rickmorty.filter_status")}</label>
        <select
          className={styles.select}
          value={filter.status ?? ""}
          onChange={(e) =>
            setFilter({ ...filter, status: e.target.value || undefined })
          }
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s || t("rickmorty.filter_all")}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <label className={styles.label}>{t("rickmorty.filter_gender")}</label>
        <select
          className={styles.select}
          value={filter.gender ?? ""}
          onChange={(e) =>
            setFilter({ ...filter, gender: e.target.value || undefined })
          }
        >
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g || t("rickmorty.filter_all")}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <label className={styles.label}>{t("rickmorty.filter_species")}</label>
        <select
          className={styles.select}
          value={filter.species ?? ""}
          onChange={(e) =>
            setFilter({ ...filter, species: e.target.value || undefined })
          }
        >
          {SPECIES.map((s) => (
            <option key={s} value={s}>
              {s || t("rickmorty.filter_all")}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <label className={styles.label}>{t("rickmorty.filter_location")}</label>
        <select
          className={styles.select}
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">{t("rickmorty.filter_all")}</option>
          {locData?.locations.results.map((loc: LocationInfo) => (
            <option key={loc.id} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {hasActive && (
        <button className={styles.clearBtn} onClick={clearFilters}>
          {t("rickmorty.clear_filters")}
        </button>
      )}
    </div>
  );
};

export default Filters;
