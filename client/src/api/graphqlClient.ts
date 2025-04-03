import { ApolloClient, InMemoryCache } from '@apollo/client';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined in your environment');
}

const client = new ApolloClient({
  uri: `${API_URL}/graphql`, // Backend GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;