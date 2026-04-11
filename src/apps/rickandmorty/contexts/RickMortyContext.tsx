import React, { createContext, useContext, useState, ReactNode } from "react";
import { CharacterFilter } from "../types";

interface RickMortyContextType {
  page: number;
  setPage: (page: number) => void;
  search: string;
  setSearch: (v: string) => void;
  filter: CharacterFilter;
  setFilter: (f: CharacterFilter) => void;
  clearFilters: () => void;
  locationFilter: string;
  setLocationFilter: (v: string) => void;
}

const RickMortyContext = createContext<RickMortyContextType | undefined>(
  undefined,
);

export const RickMortyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CharacterFilter>({});
  const [locationFilter, setLocationFilter] = useState("");

  const handleSetSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const handleSetFilter = (f: CharacterFilter) => {
    setFilter(f);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setFilter({});
    setLocationFilter("");
    setPage(1);
  };

  return (
    <RickMortyContext.Provider
      value={{
        page,
        setPage,
        search,
        setSearch: handleSetSearch,
        filter,
        setFilter: handleSetFilter,
        clearFilters,
        locationFilter,
        setLocationFilter,
      }}
    >
      {children}
    </RickMortyContext.Provider>
  );
};

export const useRickMorty = (): RickMortyContextType => {
  const ctx = useContext(RickMortyContext);
  if (!ctx)
    throw new Error("useRickMorty must be used inside RickMortyProvider");
  return ctx;
};
