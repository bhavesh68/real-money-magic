import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";

// ─── GraphQL Queries & Mutations ──────────────────────────────

const GET_PROJECT = gql`
  query GetProject($projectId: ID!) {
    getProject(id: $projectId) {
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
      stressData {
        date
        emoji
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
          note
          recurring
          __typename    
        }
        __typename       
      }
      __typename        
    }
  }
`;


const UPDATE_STRESS = gql`
  mutation UpdateStressData($projectId: ID!, $stressData: [StressDataInput!]!) {
    updateStressData(projectId: $projectId, stressData: $stressData) {
      id
      stressData {
        date
        emoji
      }
    }
  }
`;

// ─── Custom Hook ──────────────────────────────────────────────

export const useProject = (projectId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_PROJECT, {
    variables: { projectId },
    onError: (err) => console.error("❌ useProject error:", err.message),
    fetchPolicy: "cache-and-network",
    skip: !projectId,
  });

  const [updateBudget] = useMutation(UPDATE_BUDGET);
  const [updateStress] = useMutation(UPDATE_STRESS);
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

  const saveStressData = async (stressData: { [date: string]: string }) => {
    const dataToSend = Object.entries(stressData).map(([date, emoji]) => ({
      date,
      emoji,
    }));
    try {
      await updateStress({
        variables: { projectId, stressData: dataToSend },
      });
      refetch();
    } catch (err) {
      console.error("Failed to update stress data", err);
    }
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
    project: data?.getProject,
    saveBudgetData,
    saveCalendarData,
    saveStressData,
    saving,
  };
};
