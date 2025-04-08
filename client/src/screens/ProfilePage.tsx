import React from "react";
import ProfileForm from "../components/ProfileForm";
import { useAllProjects } from "../hooks/useAllProjects";
import { useNavigate } from "react-router-dom";
import { ProjectSummary } from "../types/project";

const ProfilePage = () => {
  const { projects, loading, error } = useAllProjects();
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-money-bg bg-cover bg-center relative flex flex-col items-center px-4 py-6"
    >
      {/* Background Blur Layer */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 border border-[#29AB87]">
        {/* Top Section */}
        <h1 className="text-3xl font-bold text-[#1D7E5F] mb-2">Profile</h1>
        <p className="text-lg text-[#1D7E5F] font-medium mb-6">✨ Hey there, RockStar!</p>

        {/* Profile Details */}
        <ProfileForm />

        {/* Future Enhancements Placeholder */}
        <div className="mt-8 space-y-4">
          <div>
            <h2 className="text-[#1D7E5F] font-semibold">📧 Email</h2>
            <p className="text-gray-700">[user@example.com]</p>
          </div>

          <div>
            <h2 className="text-[#1D7E5F] font-semibold">🔐 Password</h2>
            <a href="/change-password" className="text-[#29AB87] hover:underline">
              Change your password
            </a>
          </div>

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

              <ul className="mt-2 space-y-2">
                {projects.map((project: ProjectSummary) => (
                  <li
                    key={project.id}
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="cursor-pointer px-4 py-2 rounded-lg bg-white shadow hover:bg-gray-100 border border-[#29AB87]"
                  >
                    <div className="text-lg font-semibold text-[#1D7E5F]">
                      {project.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(project.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
