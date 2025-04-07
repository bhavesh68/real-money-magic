import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Observable } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined in your environment");
}

// HTTP link to the GraphQL backend
const httpLink = createHttpLink({
  uri: `${API_URL}/graphql`,
  credentials: "include",
});

// Auth middleware to attach token
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error handler with auto-refresh logic
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  return new Observable(observer => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.message.includes("Signature has expired")) {
          const refreshToken = localStorage.getItem("refreshToken");

          fetch(`${API_URL}/graphql`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
            body: JSON.stringify({
              query: `
                mutation {
                  refresh {
                    accessToken
                  }
                }
              `,
            }),
          })
            .then(res => res.json())
            .then(json => {
              const newToken = json.data?.refresh?.accessToken;
              if (!newToken) throw new Error("No access token in refresh response");

              localStorage.setItem("token", newToken);

              operation.setContext(({ headers = {} }) => ({
                headers: {
                  ...headers,
                  Authorization: `Bearer ${newToken}`,
                },
              }));

              // Retry the original operation with the new token
              forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            })
            .catch(err => {
              console.error("Token refresh failed:", err);
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              window.location.href = "/login";
              observer.error(err);
            });

          return;
        }
      }
    }

    // If no auth error, continue as normal
    forward(operation).subscribe({
      next: observer.next.bind(observer),
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer),
    });
  });
});

// Final Apollo Client setup
const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

export default client;
