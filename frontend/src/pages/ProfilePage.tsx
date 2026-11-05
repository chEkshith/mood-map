import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  Loader2,
  Mail,
  Pencil,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/client";
import { useMoodStore } from "../store/moodStore";

function Avatar({ name, url }: { name: string; url: string | null }) {
  const initials =
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "MM";

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="h-24 w-24 rounded-[1.35rem] object-cover ring-2 ring-white/20 shadow-[0_18px_44px_-18px_rgba(0,0,0,0.8)]"
      />
    );
  }

  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-violet-400/80 to-sky-400/70 text-2xl font-bold text-white ring-2 ring-white/25 shadow-[0_18px_44px_-18px_rgba(76,29,149,0.85)]">
      {initials}
    </div>
  );
}

function formatMemberSince(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
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
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (!showDeleteConfirm) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeletingAccount) {
        setShowDeleteConfirm(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showDeleteConfirm, isDeletingAccount]);

  if (!user) return null;

  const memberSince = formatMemberSince(user.created_at);

  const statCards = [
    {
      label: "Member since",
      value: <span>{memberSince}</span>,
      meta: "Part of your journey",
      emoji: "🗓️",
      accent: "border-sky-400/20 bg-sky-400/10",
      glow: "bg-sky-500/20",
      line: "from-sky-400/50 via-sky-400/10 to-transparent",
    },
    {
      label: "Account status",
      value: (
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Active
        </span>
      ),
      meta: "Secure and private",
      emoji: "🛡️",
      accent: "border-emerald-400/20 bg-emerald-400/10",
      glow: "bg-emerald-500/20",
      line: "from-emerald-400/50 via-emerald-400/10 to-transparent",
    },
  ];

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

  const handleAvatarRemove = async () => {
    if (!user.avatar_url) return;

    setIsRemovingAvatar(true);
    try {
      await authApi.deleteAvatar();
      setUser({ ...user, avatar_url: null });
      toast.success("Profile photo removed!");
    } catch {
      toast.error("Failed to remove photo.");
    } finally {
      setIsRemovingAvatar(false);
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
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
      <section
        className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-[#16182d]/95 via-[#0a0c1b]/90 to-[#06070f]/88 p-5 backdrop-blur-xl anim-stagger md:p-6"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-violet-500/15 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-sky-500/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="glass-chip px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-violet-100/70">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Account settings
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-white/45">
                <CalendarDays className="h-3.5 w-3.5" />
                Member since {memberSince}
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Your <span className="text-gradient">profile</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              Your identity, security, and account preferences — all in one calm place.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="btn-secondary group !px-4 !py-2.5 !text-xs self-start md:self-auto"
          >
            View dashboard
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <section
            className="card dashboard-card anim-stagger overflow-hidden"
            style={{ animationDelay: "0.5s" }}
          >
          <div className="relative z-10 flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 md:px-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Identity
              </p>
              <h2 className="mt-1 flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-white">
                <UserRound className="h-4 w-4 text-violet-200" />
                Personal details
              </h2>
            </div>
            <span className="glass-chip hidden px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/50 sm:inline-flex">
              Private profile
            </span>
          </div>

          <div className="relative z-10 p-5 md:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative shrink-0 self-start">
                <div className="rounded-[1.6rem] bg-gradient-to-br from-violet-400/30 via-white/10 to-sky-400/20 p-1 shadow-[0_20px_60px_-24px_rgba(76,29,149,0.8)]">
                  <Avatar name={user.display_name} url={user.avatar_url} />
                </div>
                <label
                  className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 ring-1 ring-white/30 shadow-[0_8px_20px_-6px_rgba(76,29,149,0.8)] transition-all hover:brightness-110"
                  aria-label="Change photo"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Camera className="h-4 w-4 text-white" />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
                {user.avatar_url && (
                  <button
                    type="button"
                    onClick={handleAvatarRemove}
                    disabled={isRemovingAvatar || isUploadingAvatar}
                    className="absolute -bottom-2 -left-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 ring-1 ring-white/30 shadow-[0_8px_20px_-6px_rgba(190,18,60,0.8)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Remove photo"
                  >
                    {isRemovingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-white" />
                    )}
                  </button>
                )}
              </div>

              <div className="min-w-0 flex-1">
                {isEditingName ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="input-field !py-2 min-w-0 flex-1"
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
                      className="glass-icon h-9 w-9 shrink-0 rounded-xl text-violet-200 transition-colors hover:bg-white/15"
                      aria-label="Save name"
                    >
                      {isSavingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setDisplayName(user.display_name);
                      }}
                      className="glass-icon h-9 w-9 shrink-0 rounded-xl text-white/40 transition-colors hover:bg-white/15 hover:text-white"
                      aria-label="Cancel name edit"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="group flex items-center gap-2">
                    <h3 className="truncate font-display text-xl font-semibold tracking-tight text-white">
                      {user.display_name}
                    </h3>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 opacity-0 transition-all hover:bg-white/10 hover:text-white group-hover:opacity-100"
                      aria-label="Edit name"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <p className="mt-2 flex items-center gap-2 truncate text-sm text-white/50">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Display name
                </p>
                <p className="mt-1.5 truncate text-sm font-medium text-white/80">
                  {user.display_name}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Email address
                </p>
                <p className="mt-1.5 truncate text-sm font-medium text-white/80">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section
              className="card dashboard-card anim-stagger overflow-hidden"
              style={{ animationDelay: "0.58s" }}
            >
            <button
              type="button"
              onClick={() => setShowPasswordSection((v) => !v)}
              className="relative z-10 flex w-full items-start justify-between gap-4 px-5 py-4 text-left md:px-6"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Security
                </p>
                <h2 className="mt-1 flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-white">
                  <ShieldCheck className="h-4 w-4 text-emerald-200" />
                  Password
                </h2>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
                  Keep your account protected with a strong, unique password.
                </p>
              </div>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition-transform duration-300 ${
                  showPasswordSection ? "rotate-180" : ""
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>

            {showPasswordSection && (
              <form
                onSubmit={handleChangePassword}
                className="relative z-10 animate-slide-up space-y-3 border-t border-white/5 px-5 py-5 md:px-6"
              >
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
          </section>

          <section
            className="card dashboard-card anim-stagger overflow-hidden border-rose-400/20"
            style={{ animationDelay: "0.66s" }}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl" />
            <div className="relative z-10 p-5 md:p-6">
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-rose-300" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-200/70">
                  Danger zone
                </p>
              </div>
              <h2 className="mt-2 font-display text-lg font-semibold tracking-tight text-rose-200">
                Delete account
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-white/45">
                Permanently deletes your account and all mood history. This cannot be undone.
              </p>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-danger mt-4 !text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete my account
              </button>
            </div>
            </section>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-4">
          {statCards.map(
            ({ label, value, meta, emoji, accent, glow, line }, index) => (
              <div
                key={label}
                className="card dashboard-card group relative overflow-hidden p-5 anim-stagger"
                style={{ animationDelay: `${0.6 + index * 0.07}s` }}
              >
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125 ${glow}`}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                      {label}
                    </p>
                    <p className="mt-2 truncate font-display text-2xl font-semibold tracking-tight text-white md:text-[28px]">
                      {value}
                    </p>
                  </div>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 ${accent}`}
                  >
                    {emoji}
                  </span>
                </div>
                <p className="relative mt-4 text-[11px] text-white/45">{meta}</p>
                <div
                  className={`relative mt-4 h-px w-full bg-gradient-to-r ${line}`}
                />
              </div>
            )
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close delete account dialog"
            className="absolute inset-0 animate-fade-in bg-black/75 backdrop-blur-md"
            onClick={() => !isDeletingAccount && setShowDeleteConfirm(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            aria-describedby="delete-account-description"
            className="relative w-full max-w-md animate-scale-in overflow-hidden rounded-[1.6rem] border border-rose-400/30 bg-gradient-to-br from-[#2a0d18] via-[#170a13] to-[#080508] p-6 shadow-[0_40px_120px_-30px_rgba(244,63,94,0.5)] md:p-7"
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-rose-500/20 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-24 left-0 h-44 w-44 rounded-full bg-rose-600/10 blur-[90px]" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-500/15 text-rose-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_35px_-18px_rgba(244,63,94,0.8)]">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <button
                  type="button"
                  onClick={() => !isDeletingAccount && setShowDeleteConfirm(false)}
                  disabled={isDeletingAccount}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/40 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-300/70">
                  Permanent action
                </p>
                <h2
                  id="delete-account-title"
                  className="mt-2 font-display text-2xl font-semibold tracking-tight text-white"
                >
                  Delete your account?
                </h2>
                <p
                  id="delete-account-description"
                  className="mt-2 text-sm leading-relaxed text-white/60"
                >
                  This will permanently erase your profile, mood entries, streaks, and saved places. There is no way to recover your data.
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/[0.07] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-200">
                  This cannot be undone
                </p>
                <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-rose-100/60">
                  <li>• Your mood history will be permanently deleted.</li>
                  <li>• Your account and profile details will be removed.</li>
                  <li>• You will be signed out immediately.</li>
                </ul>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => !isDeletingAccount && setShowDeleteConfirm(false)}
                  disabled={isDeletingAccount}
                  className="btn-secondary !text-xs disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Keep my account
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="btn-danger !text-xs"
                >
                  {isDeletingAccount && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {isDeletingAccount ? "Deleting account…" : "Delete permanently"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
