import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
  uri: "https://evolving-cougar-47.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret":
      "gj1XzW0cTY7TrtpfjvouymS0dv7sv2q2bA8wZQdkC8nVzt1NZ4quLMY8P9SjrDcb",
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://evolving-cougar-47.hasura.app/v1/graphql",
    connectionParams: {
      headers: {
        "x-hasura-admin-secret":
          "gj1XzW0cTY7TrtpfjvouymS0dv7sv2q2bA8wZQdkC8nVzt1NZ4quLMY8P9SjrDcb",
      },
    },
  })
);

// const wsLnik = new WebSoc({
//   uri: "wss://evolving-cougar-47.hasura.app/v1/graphql",
//   options: {
//     reconnect: true,
//     connectionParams: {
//       headers: {
//         "x-hasura-admin-secret":
//           "gj1XzW0cTY7TrtpfjvouymS0dv7sv2q2bA8wZQdkC8nVzt1NZ4quLMY8P9SjrDcb",
//       },
//     },
//   },
// });

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
