import { gql } from "@apollo/client/core";

export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        type
        gender
        origin {
          id
          name
        }
        location {
          id
          name
        }
        image
      }
    }
  }
`;

export const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      results {
        id
        name
      }
    }
  }
`;
