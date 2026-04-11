import React, { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { GET_CHARACTERS } from "../graphql/queries";
import { Character, CharactersData, CharactersVars } from "../types";
import { useRickMorty } from "../contexts/RickMortyContext";
import CharacterCard from "./CharacterCard";
import Pagination from "./Pagination";
import styles from "./CharacterList.module.css";

const CharacterList: React.FC = () => {
  const { page, search, filter, locationFilter } = useRickMorty();
  const { t } = useTranslation();

  const gqlFilter = useMemo(
    () => ({
      ...(search ? { name: search } : {}),
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.gender ? { gender: filter.gender } : {}),
      ...(filter.species ? { species: filter.species } : {}),
    }),
    [search, filter],
  );

  const { data, loading, error } = useQuery<CharactersData, CharactersVars>(
    GET_CHARACTERS,
    {
      variables: { page, filter: gqlFilter },
    },
  );

  const characters = useMemo(() => {
    if (!data?.characters.results) return [];
    if (!locationFilter) return data.characters.results;
    return data.characters.results.filter(
      (c: Character) => c.location.name === locationFilter,
    );
  }, [data, locationFilter]);

  if (loading)
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
        <p>{t("rickmorty.loading")}</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.center}>
        <p className={styles.error}>
          {t("rickmorty.error", { message: error.message })}
        </p>
      </div>
    );

  if (!characters.length)
    return (
      <div className={styles.center}>
        <p className={styles.noResult}>{t("rickmorty.no_result")}</p>
      </div>
    );

  const totalPages = data?.characters.info.pages ?? 1;
  const count = data?.characters.info.count ?? 0;

  return (
    <div>
      <p className={styles.count}>
        {t("rickmorty.count_other", { count })}
        {locationFilter
          ? t("rickmorty.count_in", { location: locationFilter })
          : ""}
      </p>
      <div className={styles.grid}>
        {characters.map((c: Character) => (
          <CharacterCard key={c.id} character={c} />
        ))}
      </div>
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default CharacterList;
