export interface CharacterLocation {
  id: string | null;
  name: string;
}

export interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: CharacterLocation;
  location: CharacterLocation;
  image: string;
}

export interface PageInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface CharactersResult {
  info: PageInfo;
  results: Character[];
}

export interface CharactersData {
  characters: CharactersResult;
}

export interface CharactersVars {
  page: number;
  filter: CharacterFilter;
}

export interface CharacterFilter {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
}

export interface LocationInfo {
  id: string;
  name: string;
}

export interface LocationsData {
  locations: {
    results: LocationInfo[];
  };
}
