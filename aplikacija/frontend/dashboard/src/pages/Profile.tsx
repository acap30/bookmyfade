import { Mail, Phone, Shield, User } from "lucide-react";

import UserAvatar from "../components/ui/UserAvatar";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ProfileInput from "../components/profile/ProfileInput";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";
import { updateProfile } from "../api/authApi";

const Profile = () => {
  const { user, updateUser } = useAuth();

  if (!user) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const newUser = {
        ...user,
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        phoneNumber: formData.phoneNumber || null,
      };

      const res = await updateProfile(newUser);
      console.log(res.data.message);

      updateUser(newUser);

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
    });

    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        {/* Top Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* Avatar */}
          <UserAvatar fullName={user.fullName} size={72} />

          {/* User Info */}
          <div className="space-y-2">
            <div>
              <h2 className="text-xl font-semibold text-text">
                {user.fullName}
              </h2>

              <div className="flex items-center gap-2">
                <p className="text-sm text-muted">@{user.username}</p>

                {/* Role */}
                <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted">
                  <Shield size={14} />
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-border" />

        {/* Details */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* First Name */}
          <ProfileInput
            icon={<User size={16} />}
            label="First Name"
            name="firstName"
            value={formData.firstName}
            disabled={!isEditing}
            onChange={handleChange}
          />

          {/* Last Name */}
          <ProfileInput
            icon={<User size={16} />}
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            disabled={!isEditing}
            onChange={handleChange}
          />

          {/* Username */}
          <ProfileInput
            icon={<User size={16} />}
            label="Username"
            name="username"
            value={formData.username}
            disabled={!isEditing}
            onChange={handleChange}
          />

          {/* Email */}
          <ProfileInput
            icon={<Mail size={16} />}
            label="Email"
            name="email"
            value={formData.email}
            disabled={!isEditing}
            onChange={handleChange}
          />

          {/* Phone */}
          <ProfileInput
            icon={<Phone size={16} />}
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber || "Not Provided"}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Edit Profile
              </button>

              <button
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-text transition-all hover:bg-accent hover:scale-[1.02] active:scale-95 cursor-pointer"
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change Password
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Save Changes
              </button>

              <button
                onClick={handleCancel}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-text transition-all hover:bg-accent hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
