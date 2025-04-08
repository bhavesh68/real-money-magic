import React from "react";
import ProfileForm from "../components/ProfileForm";

const ProfilePage = () => {
  return (
    <div
      className="min-h-screen bg-money-bg bg-cover bg-center relative flex flex-col items-center px-4 py-6"
    >
      {/* Background Blur Layer */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      {/* ✨ Sparkle Overlay Layer */}
      <div className="sparkle-layer">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

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
            <p className="text-gray-700">No active projects yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
