import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";

// ─── GraphQL Queries & Mutations ──────────────────────────────

const GET_PROJECT = gql`
  query GetProject($projectId: ID!) {
    myProjects {
      id
      title
      notes
      createdAt
      budgetData {
        category
        amount
        type
        recurring
        note
      }
      calendarData {
        date
        entries {
          category
          amount
          type
          recurring
          note
        }
      }
    }
  }
`;

const UPDATE_BUDGET = gql`
  mutation UpdateBudgetData($projectId: ID!, $budgetData: [BudgetEntryInput!]!) {
    updateBudgetData(projectId: $projectId, budgetData: $budgetData) {
      id
      budgetData {
        category
        amount
        type
        recurring
        note
      }
    }
  }
`;

const UPDATE_CALENDAR = gql`
  mutation UpdateCalendarData($projectId: ID!, $calendarData: [CalendarEntryInput!]!) {
    updateCalendarData(projectId: $projectId, calendarData: $calendarData) {
      id
      calendarData {
        date
        entries {
          category
          amount
          type
          recurring
          note
        }
      }
    }
  }
`;

// ─── Custom Hook ──────────────────────────────────────────────

export const useProject = (projectId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_PROJECT, {
    variables: { projectId },
    fetchPolicy: "cache-and-network",
  });

  const [updateBudget] = useMutation(UPDATE_BUDGET);
  const [updateCalendar] = useMutation(UPDATE_CALENDAR);

  const [saving, setSaving] = useState(false);

  const saveBudgetData = async (budgetData: any[]) => {
    setSaving(true);
    try {
      await updateBudget({
        variables: {
          projectId,
          budgetData,
        },
      });
      refetch();
    } catch (err) {
      console.error("Failed to update budget", err);
    }
    setSaving(false);
  };

  const saveCalendarData = async (calendarData: any[]) => {
    setSaving(true);
    try {
      await updateCalendar({
        variables: {
          projectId,
          calendarData,
        },
      });
      refetch();
    } catch (err) {
      console.error("Failed to update calendar", err);
    }
    setSaving(false);
  };

  return {
    loading,
    error,
    project: data?.myProjects?.find((p: any) => p.id === projectId),
    saveBudgetData,
    saveCalendarData,
    saving,
  };
};
