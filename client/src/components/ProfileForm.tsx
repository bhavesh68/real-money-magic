import React, { useEffect } from "react";
import { useProfile } from "../hooks/useProfile";

const ProfilePage: React.FC = () => {
  const {
    loading,
    error,
    firstName,
    lastName,
    setFirstName,
    setLastName,
    email,
    setEmail,
    successMsg,
    handleProfileUpdate,
    currentPassword,
    newPassword,
    confirmPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    passwordMsg,
    handlePasswordChange,
  } = useProfile();

  useEffect(() => {
    console.log("📥 Fetched Profile Info:");
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);
  }, [firstName, lastName, email]);

  if (loading) return <div className="p-4">Loading profile...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading profile.</div>;

  return (
    <div className="p-4 space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">👤 Edit Profile</h2>
        <input
          className="border rounded p-2 w-full"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Name"
        />
        <input
          className="border rounded p-2 w-full"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
        <input
          className="border rounded p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleProfileUpdate}
        >
          Save
        </button>
        {successMsg && <p className="text-green-600">{successMsg}</p>}
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">🔐 Change Password</h2>
        <input
          type="password"
          className="border rounded p-2 w-full"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
        />
        <input
          type="password"
          className="border rounded p-2 w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
        <input
          type="password"
          className="border rounded p-2 w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handlePasswordChange}
        >
          Change Password
        </button>
        {passwordMsg && <p className="text-red-600">{passwordMsg}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;
