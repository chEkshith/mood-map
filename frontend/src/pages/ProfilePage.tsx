import { Camera, Check, Loader2, Pencil, Shield, Trash2, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/client";
import { useMoodStore } from "../store/moodStore";

function Avatar({ name, url }: { name: string; url: string | null }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/20 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)]"
      />
    );
  }

  return (
    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-400/70 to-sky-400/70 ring-2 ring-white/25 flex items-center justify-center text-xl font-bold text-white shadow-[0_12px_30px_-12px_rgba(76,29,149,0.7)]">
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
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  if (!user) return null;

  const handleSaveName = async () => {
    if (!displayName.trim()) return;
    setIsSavingName(true);
    try {
      const updated = await authApi.updateProfile({ display_name: displayName.trim() });
      setUser(updated);
      setIsEditingName(false);
      toast.success("Name updated!");
    } catch {
      toast.error("Failed to update name.");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const { avatar_url } = await authApi.uploadAvatar(file);
      setUser({ ...user, avatar_url });
      toast.success("Profile photo updated!");
    } catch {
      toast.error("Failed to upload photo.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setIsChangingPassword(true);
    try {
      await authApi.changePassword({ current_password: currentPassword, new_password: newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordSection(false);
    } catch {
      toast.error("Current password is incorrect.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await authApi.deleteAccount();
      clearUser();
      navigate("/login");
    } catch {
      toast.error("Failed to delete account.");
      setIsDeletingAccount(false);
    }
  };

  return (
    <div
      className="max-w-lg mx-auto px-4 py-6 space-y-5 anim-stagger"
      style={{ animationDelay: "0.35s" }}
    >
      <div className="anim-stagger" style={{ animationDelay: "0.45s" }}>
        <span className="glass-chip px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-violet-100/70 mb-3">
          Account
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Your <span className="text-gradient">profile</span>
        </h1>
        <p className="text-sm text-white/50 mt-1.5">Manage your account settings</p>
      </div>

      {/* Avatar & Name Card */}
      <div className="card p-6 anim-stagger" style={{ animationDelay: "0.55s" }}>
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <Avatar name={user.display_name} url={user.avatar_url} />
            <label
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center
                         cursor-pointer hover:brightness-110 transition-all shadow-[0_8px_20px_-6px_rgba(76,29,149,0.8)] ring-1 ring-white/30"
              aria-label="Change photo"
            >
              {isUploadingAvatar
                ? <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                : <Camera className="h-3.5 w-3.5 text-white" />
              }
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>

          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-field !py-2 flex-1"
                  placeholder="Display name"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveName();
                    if (e.key === "Escape") setIsEditingName(false);
                  }}
                />
                <button
                  onClick={handleSaveName}
                  disabled={isSavingName}
                  className="glass-icon h-9 w-9 rounded-xl text-violet-200 hover:bg-white/15 transition-colors"
                >
                  {isSavingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => { setIsEditingName(false); setDisplayName(user.display_name); }}
                  className="glass-icon h-9 w-9 rounded-xl text-white/40 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h2 className="text-lg font-semibold font-display text-white truncate tracking-tight">{user.display_name}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="h-6 w-6 rounded-lg text-white/30 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Edit name"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              </div>
            )}
            <p className="text-sm text-white/40 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-2 gap-4">
          <div className="text-center rounded-xl glass-subtle py-3">
            <p className="text-xl font-semibold font-display text-white">{user.total_entries}</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/40 mt-1">Total entries</p>
          </div>
          <div className="text-center rounded-xl glass-subtle py-3">
            <p className="text-xl font-semibold font-display text-white">{user.mood_streak} days</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/40 mt-1">Mood streak</p>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="card p-5 anim-stagger" style={{ animationDelay: "0.65s" }}>
        <button
          onClick={() => setShowPasswordSection((v) => !v)}
          className="flex items-center justify-between w-full text-left group"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-white/50" />
            <span className="text-sm font-semibold text-white tracking-tight">Change password</span>
          </div>
          <span className="text-white/30 text-sm">{showPasswordSection ? "▲" : "▼"}</span>
        </button>

        {showPasswordSection && (
          <form onSubmit={handleChangePassword} className="mt-4 space-y-3 animate-slide-up">
            <input
              type="password"
              placeholder="Current password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input-field"
              autoComplete="current-password"
            />
            <input
              type="password"
              placeholder="New password (min. 8 chars)"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field"
              autoComplete="new-password"
            />
            <button
              type="submit"
              disabled={isChangingPassword}
              className="btn-primary w-full !py-2.5"
            >
              {isChangingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
              {isChangingPassword ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>

      {/* Danger Zone */}
      <div className="card p-5 border-rose-400/20 bg-rose-500/5 anim-stagger" style={{ animationDelay: "0.75s" }}>
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="h-4 w-4 text-rose-300" />
          <h3 className="text-sm font-semibold text-rose-300 tracking-tight">Danger zone</h3>
        </div>
        <p className="text-xs text-white/40 mb-4">
          Permanently deletes your account and all mood history. This cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-danger !text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete my account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-rose-200">
              Are you absolutely sure? This cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="btn-danger"
              >
                {isDeletingAccount && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isDeletingAccount ? "Deleting…" : "Yes, delete permanently"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-sm text-white/40 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
