import { gql, useQuery } from "@apollo/client";
import { ProjectSummary } from "../types/project";

const GET_PROJECTS = gql`
  query {
    myProjects {
      id
      title
      createdAt
    }
  }
`;

export const useAllProjects = (): {
    loading: boolean;
    error: any;
    projects: ProjectSummary[];
  } => {
    const { data, loading, error } = useQuery(GET_PROJECTS);
    return {
      loading,
      error,
      projects: data?.myProjects || [],
    };
};
