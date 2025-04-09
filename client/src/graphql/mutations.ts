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

export const CREATE_PROJECT = gql`
  mutation CreateProject($title: String!, $notes: String) {
    createProject(title: $title, notes: $notes) {
      id
      title
      notes
      createdAt
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId)
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($projectId: ID!, $title: String!, $notes: String) {
    updateProject(projectId: $projectId, title: $title, notes: $notes) {
      id
      title
      notes
      createdAt
    }
  }
`;

export const SAVE_CALENDAR_DATA = gql`
  mutation SaveCalendarData($input: [CalendarEntryInput!]!) {
    saveCalendarData(input: $input) {
      calendarData {
        date
        entries {
          category
          amount
          type
          note
          recurring
        }
      }
    }
  }
`;

