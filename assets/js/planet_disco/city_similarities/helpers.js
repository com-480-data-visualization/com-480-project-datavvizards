import { gql } from 'apollo-boost'

export const RETRIEVE_CITY_BY_ID = gql`
  query CityById($cityId: String) {
    cities(byId: $cityId){
      entries {
        id,
        city,
        population,
        humanCountry,
        coord
      }
      cursor
    }
  }
`;