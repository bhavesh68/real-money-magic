import { useParams, Navigate } from "react-router-dom";

const ProjectView = () => {
  const { id } = useParams();

  if (!id) return <Navigate to="/profile" />;
  return <Navigate to={`/dashboard/${id}`} />;
};

export default ProjectView;
