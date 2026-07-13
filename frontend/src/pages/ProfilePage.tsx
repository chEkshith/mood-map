import { Pencil, Trash2 } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/client";
import { useMoodStore } from "../store/moodStore";

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="h-20 w-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
      {initials}
    </div>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useMoodStore((s) => s.user);
  const setUser = useMoodStore((s) => s.setUser);
  const clearUser = useMoodStore((s) => s.clearUser);

  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name ?? "");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) return null;

  const handleSaveName = async () => {
    const updated = await authApi.updateProfile({ display_name: displayName });
    setUser(updated);
    setIsEditingName(false);
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const { avatar_url } = await authApi.uploadAvatar(file);
      setUser({ ...user, avatar_url });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    try {
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setPasswordMessage("Could not change password. Check your current password.");
    }
  };

  const handleDeleteAccount = async () => {
    await authApi.deleteAccount();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-3">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.display_name}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <Initials name={user.display_name} />
        )}
        <label className="text-sm font-medium text-indigo-600 cursor-pointer hover:underline">
          {isUploadingAvatar ? "Uploading..." : "Change photo"}
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </label>

        {isEditingName ? (
          <div className="flex items-center gap-2 w-full">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 p-2 text-sm"
            />
            <button
              onClick={handleSaveName}
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">{user.display_name}</h2>
            <button onClick={() => setIsEditingName(true)} aria-label="Edit name">
              <Pencil className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        )}
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <button
          onClick={() => setShowPasswordSection((v) => !v)}
          className="text-sm font-semibold text-gray-700"
        >
          Change password {showPasswordSection ? "▲" : "▼"}
        </button>
        {showPasswordSection && (
          <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
            {passwordMessage && <p className="text-sm text-gray-600">{passwordMessage}</p>}
            <input
              type="password"
              placeholder="Current password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
            />
            <input
              type="password"
              placeholder="New password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 text-white font-medium py-2 hover:bg-indigo-700 transition"
            >
              Update password
            </button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
        <h3 className="text-sm font-semibold text-red-600 mb-2">Danger zone</h3>
        <p className="text-sm text-gray-500 mb-3">
          Deleting your account permanently removes all your mood history.
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:underline"
          >
            <Trash2 className="h-4 w-4" /> Delete account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteAccount}
              className="rounded-lg bg-red-600 text-white text-sm font-medium px-3 py-2 hover:bg-red-700"
            >
              Yes, delete permanently
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
