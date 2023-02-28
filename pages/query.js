import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        launches: offsetLimitPagination(),
      },
    },
  },
});

export const client = new ApolloClient({
  uri: "https://spacex-production.up.railway.app/",
  cache,
});
export const LIST_LAUNCHES = gql`
  query Launches($offset: Int!, $limit: Int!) {
    launches: launches(
      offset: $offset
      limit: $limit
      sort: "launch_date_local"
      order: "asc"
    ) {
      id
      launch_date_local
      mission_name
      launch_site {
        site_name_long
      }
      links {
        article_link
        video_link
        mission_patch
        flickr_images
        reddit_media
      }
      rocket {
        rocket_name
      }
      details
    }
  }
`;
export const LAUNCH_DETAILS = gql`
  query Launch($launchId: ID!) {
    launch: launch(id: $launchId) {
      details
      mission_name
      launch_date_local
      tentative_max_precision
    }
  }
`;
