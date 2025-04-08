import { useQuery, useMutation, gql } from "@apollo/client";
import { useState, useEffect } from "react";

const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      first_name
      last_name
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

export const useProfile = () => {
  const { loading, error, data, refetch } = useQuery(GET_USER_PROFILE);
  const [updateProfile] = useMutation(UPDATE_USER_PROFILE);
  const [changePassword] = useMutation(CHANGE_PASSWORD);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  
  useEffect(() => {
    if (!loading && data) {
      setFirstName(data.me.first_name);
      setLastName(data.me.last_name);
      setEmail(data.me.email);
    }
  }, [loading, data]);  

  const handleProfileUpdate = async () => {
    try {
      await updateProfile({ variables: { name, email } });
      setSuccessMsg("✅ Profile updated successfully!");
      refetch();
    } catch (err) {
      console.error(err);
      setSuccessMsg("❌ Error updating profile.");
    }
  };

  const handlePasswordChange = async () => {
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

  return {
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
  };
};
