// graphqlClient.ts
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { Observable } from "@apollo/client/core";

// 🌐 Your backend URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
if (!API_URL) throw new Error("VITE_API_URL is not defined");

// 🔗 Standard GraphQL link
const httpLink = createHttpLink({
  uri: `${API_URL}/graphql`,
  credentials: "include",
});

// 🔐 Auth middleware to attach access token
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// 🔄 Error link to handle expired tokens
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  return new Observable(observer => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.message.includes("Signature has expired")) {
          const refreshToken = localStorage.getItem("refreshToken");

          // 🚨 No refresh token = force logout
          if (!refreshToken) {
            localStorage.clear();
            window.location.href = "/login";
            return observer.error("No refresh token. Logging out.");
          }

          // 🔁 Try to refresh the access token
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
              if (!newToken) throw new Error("Refresh failed, no accessToken");

              // ✅ Save new token
              localStorage.setItem("token", newToken);

              // 🔄 Retry original operation with new token
              operation.setContext(({ headers = {} }) => ({
                headers: {
                  ...headers,
                  Authorization: `Bearer ${newToken}`,
                },
              }));

              forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            })
            .catch(err => {
              console.error("🔴 Refresh failed:", err);
              localStorage.clear();
              window.location.href = "/login";
              observer.error(err);
            });

          return;
        }
      }
    }

    // No error? Just continue normally
    forward(operation).subscribe({
      next: observer.next.bind(observer),
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer),
    });
  });
});

// ✅ Final Apollo Client instance
const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

export default client;
