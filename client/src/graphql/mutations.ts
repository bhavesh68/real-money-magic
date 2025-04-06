import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) 
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

export const REMOVE_USER = gql`
  mutation removeUser($email: String!) {
    removeUser(email: $email) {
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
