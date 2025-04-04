import { gql } from "@apollo/client";

export const QUERY_GET_USER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      message
      success
      user {
        _id
        name
        email
      }
    }
  }
`;

export const QUERY_ALL_USERS = gql`
  query allUsers {
    users {
      _id
      name
      email
    }
  }
`;

export const QUERY_HELLO = gql`
  query hello {
    hello
  }
`;
