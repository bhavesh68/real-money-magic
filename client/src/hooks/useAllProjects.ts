import { gql, useQuery } from "@apollo/client";
import { ProjectSummary } from "../types/project";

const GET_PROJECTS = gql`
  query GetMyProjects {
    myProjects {
      id
      title
      notes
      createdAt
    }
  }
`;

export const useAllProjects = (): {
  loading: boolean;
  error: any;
  projects: ProjectSummary[];
  refetch: () => void;
} => {
  const { data, loading, error, refetch } = useQuery(GET_PROJECTS);
  return {
    loading,
    error,
    projects: data?.myProjects || [],
    refetch,
  };
};
