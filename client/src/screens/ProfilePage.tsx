import { useState } from "react";
import ProfileForm from "../components/ProfileForm";
import { useAllProjects } from "../hooks/useAllProjects";
import { useNavigate } from "react-router-dom";
import { ProjectSummary } from "../types/project";
import { useMutation } from "@apollo/client";
import '../css/sparkles.css';
import { 
  CREATE_PROJECT, 
  DELETE_PROJECT, 
  UPDATE_PROJECT
} from "../graphql/mutations";

const ProfilePage = () => {
  const { projects, loading, error, refetch } = useAllProjects();
  const navigate = useNavigate();

  const [createProject] = useMutation(CREATE_PROJECT, {
    refetchQueries: ["GetMyProjects"], 
  });
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const [updateProject] = useMutation(UPDATE_PROJECT);

  const [editingProject, setEditingProject] = useState<ProjectSummary | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // ✅ Accordion toggle state
  const [showAccordion, setShowAccordion] = useState(false);

  const handleCreateProject = async () => {
    try {
      const { data } = await createProject({
        variables: {
          title: "Untitled Project",
          notes: "",
        },
      });

      const newId = data.createProject.id;
      navigate(`/project/${newId}`);
    } catch (err) {
      console.error("❌ Error creating project:", err);
      alert("Failed to create project.");
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject({ variables: { projectId } });
      await refetch();
    } catch (err) {
      console.error("❌ Error deleting project:", err);
      alert("Failed to delete project.");
    }
  };

  const handleEditSave = async () => {
    try {
      await updateProject({
        variables: {
          projectId: editingProject?.id,
          title: editTitle,
          notes: editNotes,
        },
      });
      setEditingProject(null);
      await refetch();
    } catch (err) {
      console.error("❌ Error updating project:", err);
      alert("Failed to update project.");
    }
  };  

  return (
    <div className="min-h-screen bg-money-bg bg-cover bg-center relative flex flex-col items-center px-4 py-6">
      {/* Background Blur Layer */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      {/* ✨ Sparkle Overlay Layer */}
      <div className="sparkle-layer">
        {[...Array(25)].map((_, i) => (
          <div key={i} className={`sparkle sparkle-${i + 1}`} />
        ))}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 border border-[#29AB87]">
        {/* Top Section */}
        <h1 className="text-3xl font-bold text-[#1D7E5F] mb-2">Profile</h1>
        <p className="text-lg text-[#1D7E5F] font-medium mb-6">✨ Hey there, RockStar!</p>

        {/* ✅ Accordion for Edit User Info */}
        <div className="border border-[#29AB87] rounded-lg overflow-hidden shadow mb-6">
          <button
            onClick={() => setShowAccordion(!showAccordion)}
            className="w-full text-left px-4 py-3 bg-[#29AB87] text-white font-semibold flex justify-between items-center hover:bg-[#218F71] transition"
          >
            📝 Edit User Info
            <span>{showAccordion ? '▲' : '▼'}</span>
          </button>

          {showAccordion && (
            <div className="p-4 bg-white">
              <ProfileForm />
            </div>
          )}
        </div>

        {/* Future Enhancements Placeholder */}
        <div className="mt-8 space-y-4">
          <div>
            <h2 className="text-[#1D7E5F] font-semibold">🤝 Connected Users</h2>
            <p className="text-gray-700">You are connected with 0 users.</p>
          </div>

          <div>
            <h2 className="text-[#1D7E5F] font-semibold">📁 Projects</h2>

            {loading && <p className="text-gray-700">Loading your projects...</p>}
            {error && <p className="text-red-500">Error fetching projects 😢</p>}
            {!loading && projects.length === 0 && (
              <p className="text-gray-700">No active projects yet.</p>
            )}

            {projects.length < 3 && (
              <button
                onClick={handleCreateProject}
                className="mb-4 bg-[#29AB87] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#218F71]"
              >
                ➕ New Project
              </button>
            )}

            <ul className="mt-2 space-y-2">
              {projects.map((project: ProjectSummary) => (
                <li
                  key={project.id}
                  className="flex justify-between items-center px-4 py-3 rounded-lg bg-white shadow border border-[#29AB87]"
                >
                  <div
                    className="cursor-pointer flex-1"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <div className="text-lg font-semibold text-[#1D7E5F]">{project.title}</div>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(project.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setEditTitle(project.title);
                        setEditNotes(project.notes || "");
                      }}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                      title="Edit project"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-800 font-bold"
                      title="Delete project"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {editingProject && (
              <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-md border border-[#29AB87] relative">
                  <h2 className="text-2xl font-bold text-[#1D7E5F] mb-4">Edit Project</h2>
                  <label className="block mb-2 font-medium text-[#1D7E5F]">Title</label>
                  <input
                    type="text"
                    placeholder="Enter project title"
                    title="Project title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full mb-4 p-2 border rounded-md"
                  />
                  <label className="block mb-2 font-medium text-[#1D7E5F]">Notes</label>
                  <textarea
                    value={editNotes}
                    placeholder="Enter project notes"
                    title="Project notes"
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full mb-4 p-2 border rounded-md"
                    rows={4}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingProject(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSave}
                      className="bg-[#29AB87] text-white px-4 py-2 rounded-md hover:bg-[#218F71]"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
