import React from "react";
import ProfileForm from "../components/ProfileForm";

const ProfilePage = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
