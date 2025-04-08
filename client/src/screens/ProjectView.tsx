import { useParams } from "react-router-dom";
import { useProject } from "../hooks/useProject";

const ProjectView = () => {
  const { id } = useParams();
  const { project, loading, error, saveBudgetData, saveCalendarData } = useProject(id!);

  if (loading) return <p>Loading project...</p>;
  if (error) return <p>Error loading project</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{project?.title}</h2>

      {/* Placeholder for Budget/Calendar inputs */}
      {/* Example: <SetBudget data={project.budgetData} onSave={saveBudgetData} /> */}
      {/* Example: <CalendarView data={project.calendarData} onSave={saveCalendarData} /> */}
    </div>
  );
};

export default ProjectView;
