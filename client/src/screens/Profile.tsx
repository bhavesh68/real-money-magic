import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { GET_USER_PROFILE } from "../graphql/queries";

const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      name
      email
    }
  }
`;

const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($name: String!, $email: String!) {
    updateUserProfile(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      success
      message
    }
  }
`;

const Profile: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USER_PROFILE);
  const [updateProfile] = useMutation(UPDATE_USER_PROFILE);
  const [changePassword] = useMutation(CHANGE_PASSWORD);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  if (!loading && data && name === "" && email === "") {
    setName(data.me.name);
    setEmail(data.me.email);
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        variables: { name, email },
        refetchQueries: [{ query: GET_USER_PROFILE }],
      });
      setSuccessMsg("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg("❌ New passwords do not match.");
      return;
    }
    try {
      const res = await changePassword({
        variables: { currentPassword, newPassword },
      });
      if (res.data.changePassword.success) {
        setPasswordMsg("✅ Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg(`❌ ${res.data.changePassword.message}`);
      }
    } catch (err) {
      setPasswordMsg("❌ Error changing password.");
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Loading profile...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading profile.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-8">
      {/* Profile Update */}
      <div>
        <h2 className="text-2xl font-bold mb-4">👤 Edit Profile</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>

          {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
        </form>
      </div>

      {/* Password Change */}
      <div>
        <h2 className="text-2xl font-bold mb-4">🔐 Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Current Password
            </label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Change Password
          </button>

          {passwordMsg && (
            <p className="mt-2 text-sm text-red-600">{passwordMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
