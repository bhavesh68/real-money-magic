import { gql } from "@apollo/client";

export const REGISTER_PROFILE = gql`
  mutation registerUser($name: String!, $email: String!) {
    registerUser(name: $name, email: $email) {
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

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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
