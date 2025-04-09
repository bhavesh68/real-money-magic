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
    console.log("📥 Fetched Profile Info:", { firstName, lastName, email });
  }, [firstName, lastName, email]);

  if (loading) return <div className="p-4">Loading profile...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading profile.</div>;

  return (
    <div className="p-4 space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">👤 Edit Profile</h2>
        
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#29AB87]"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#29AB87]"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#29AB87]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <button
          className="bg-[#29AB87] text-white px-4 py-2 rounded-full font-medium hover:bg-[#218F71] transition"
          onClick={handleProfileUpdate}
        >
          Save
        </button>

        {successMsg && <p className="text-green-600">{successMsg}</p>}
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">🔐 Change Password</h2>

        <label htmlFor="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          type="password"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#29AB87]"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
        />

        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#29AB87]"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />

        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input
          id="confirmPassword"
          type="password"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#29AB87]"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
        />

        <button
          className="bg-[#29AB87] text-white px-4 py-2 rounded-full font-medium hover:bg-[#218F71] transition"
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
