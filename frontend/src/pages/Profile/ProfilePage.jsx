import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import { Input, PrimaryButton, SecondaryButton } from "../../components/common/ui";

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    profileImage: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Preference settings state
  const [studyGoal, setStudyGoal] = useState(() => {
    return localStorage.getItem("distilllearn-preferences-studygoal") || "30 Minutes";
  });
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem("distilllearn-preferences-notifications");
      return stored ? JSON.parse(stored) : { dailyReminders: true, courseUpdates: true, communityMentions: false };
    } catch {
      return { dailyReminders: true, courseUpdates: true, communityMentions: false };
    }
  });
  const [deepFocusMode, setDeepFocusMode] = useState(() => {
    const stored = localStorage.getItem("distilllearn-preferences-deepfocus");
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    setProfileForm({
      username: user?.username || "",
      email: user?.email || "",
      profileImage: user?.profileImage || "",
    });
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile photo must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm((current) => ({
        ...current,
        profileImage: reader.result,
      }));
      toast.success("Photo uploaded. Save changes to persist.");
    };
    reader.readAsDataURL(file);
  };

  const toggleNotification = (key) => {
    setNotifications((current) => {
      const next = { ...current, [key]: !current[key] };
      localStorage.setItem("distilllearn-preferences-notifications", JSON.stringify(next));
      return next;
    });
  };

  const toggleDeepFocus = () => {
    setDeepFocusMode((current) => {
      const next = !current;
      localStorage.setItem("distilllearn-preferences-deepfocus", String(next));
      return next;
    });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      setSavingProfile(true);
      const response = await authService.updateProfile(profileForm);
      updateUser(response.data);
      toast.success(response.message || "Profile updated");
    } catch (requestError) {
      toast.error(
        requestError.error ||
          requestError.message ||
          "Could not update profile",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setSavingPassword(true);
      const response = await authService.changePassword(passwordForm);
      toast.success(response.message || "Password changed");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (requestError) {
      toast.error(
        requestError.error ||
          requestError.message ||
          "Could not change password",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-safe">
      <div className="mb-margin">
        <h1 className="font-h1 text-h1 text-on-background tracking-tight font-black">Profile Settings</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Manage your account details and learning preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 flex flex-col gap-lg">
          {/* Personal Information */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl">
            <h2 className="font-h3 text-h3 text-on-background mb-md font-bold">
              Personal Information
            </h2>
            <div className="flex flex-col sm:flex-row gap-gutter items-start sm:items-center mb-md">
              <div className="relative group">
                {profileForm.profileImage ? (
                  <img
                    alt="Profile Picture"
                    className="w-24 h-24 rounded-full object-cover border border-outline-variant/30 shadow-sm"
                    src={profileForm.profileImage}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-3xl border border-outline-variant/30 select-none shadow-sm">
                    {(profileForm.username || user?.username || "?").slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 w-full space-y-md">
                <div className="flex flex-wrap gap-sm items-center">
                  <label className="cursor-pointer bg-surface border border-outline-variant/60 hover:border-slate-400 text-slate-700 font-label-md text-label-md px-md py-2.5 rounded-lg transition-colors inline-flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {profileForm.profileImage && (
                    <button
                      type="button"
                      onClick={() => setProfileForm((current) => ({ ...current, profileImage: "" }))}
                      className="border border-rose-200 text-rose-700 font-label-md text-label-md px-md py-2.5 rounded-lg hover:bg-rose-50/50 transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md pt-sm">
                  <Input
                    type="text"
                    label="Full Name"
                    value={profileForm.username}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        username: event.target.value,
                      }))
                    }
                  />
                  <Input
                    type="email"
                    label="Email Address"
                    value={profileForm.email}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-sm">
              <PrimaryButton
                type="button"
                onClick={handleProfileSubmit}
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </PrimaryButton>
            </div>
          </section>

          {/* Account Security */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl">
            <h2 className="font-h3 text-h3 text-on-background mb-md font-bold">
              Account Security
            </h2>
            <div className="space-y-md max-w-md">
              <Input
                id="current-pass"
                label="Current Password"
                placeholder="••••••••"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) =>
                  setPasswordForm((current) => ({
                    ...current,
                    currentPassword: event.target.value,
                  }))
                }
              />
              <Input
                id="new-pass"
                label="New Password"
                placeholder="Enter new password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) =>
                  setPasswordForm((current) => ({
                    ...current,
                    newPassword: event.target.value,
                  }))
                }
              />
              <Input
                id="confirm-pass"
                label="Confirm New Password"
                placeholder="Confirm new password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) =>
                  setPasswordForm((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
              />
              <div className="pt-sm flex flex-wrap gap-3">
                <PrimaryButton
                  type="button"
                  onClick={handlePasswordSubmit}
                  disabled={savingPassword}
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </PrimaryButton>
                <SecondaryButton
                  type="button"
                  onClick={logout}
                >
                  Sign Out
                </SecondaryButton>
              </div>
            </div>
          </section>
        </div>

        {/* Learning Preferences */}
        <div className="flex flex-col gap-lg">
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl h-full">
            <h2 className="font-h3 text-h3 text-on-background mb-md font-bold">
              Learning Preferences
            </h2>
            <div className="space-y-lg">
              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-wide">
                  Daily Study Goal
                </h3>
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">
                    timer
                  </span>
                  <select
                    value={studyGoal}
                    onChange={(event) => {
                      const val = event.target.value;
                      setStudyGoal(val);
                      localStorage.setItem("distilllearn-preferences-studygoal", val);
                    }}
                    className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-sm py-2 font-body-md text-body-md text-on-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                  >
                    <option value="15 Minutes">15 Minutes</option>
                    <option value="30 Minutes">30 Minutes</option>
                    <option value="60 Minutes">60 Minutes</option>
                    <option value="120 Minutes">120 Minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-wide">
                  Notifications
                </h3>
                <div className="space-y-md">
                  {/* Daily Reminders */}
                  <label className="flex items-center gap-sm cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notifications.dailyReminders}
                        onChange={() => toggleNotification("dailyReminders")}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${notifications.dailyReminders ? "bg-secondary" : "bg-outline-variant"}`} />
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications.dailyReminders ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                    <span className="font-body-sm text-body-sm text-on-background font-medium">
                      Daily Reminders
                    </span>
                  </label>

                  {/* Course Updates */}
                  <label className="flex items-center gap-sm cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notifications.courseUpdates}
                        onChange={() => toggleNotification("courseUpdates")}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${notifications.courseUpdates ? "bg-secondary" : "bg-outline-variant"}`} />
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications.courseUpdates ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                    <span className="font-body-sm text-body-sm text-on-background font-medium">
                      Course Updates
                    </span>
                  </label>

                  {/* Community Mentions */}
                  <label className="flex items-center gap-sm cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notifications.communityMentions}
                        onChange={() => toggleNotification("communityMentions")}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${notifications.communityMentions ? "bg-secondary" : "bg-outline-variant"}`} />
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications.communityMentions ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                    <span className="font-body-sm text-body-sm text-on-background font-medium">
                      Community Mentions
                    </span>
                  </label>
                </div>
              </div>

              {/* Deep Focus Mode Info Box */}
              <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant/60">
                <div className="flex items-center gap-sm mb-xs">
                  <span className="material-symbols-outlined text-primary">
                    do_not_disturb_on
                  </span>
                  <h4 className="font-label-md text-label-md text-on-background font-bold">
                    Deep Focus Mode
                  </h4>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">
                  Automatically silence all notifications while viewing course
                  materials.
                </p>
                <label className="flex items-center gap-sm cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={deepFocusMode}
                      onChange={toggleDeepFocus}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${deepFocusMode ? "bg-secondary" : "bg-outline-variant"}`} />
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${deepFocusMode ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                  <span className={`font-label-sm text-label-sm uppercase font-bold ${deepFocusMode ? "text-secondary" : "text-slate-500"}`}>
                    {deepFocusMode ? "Enabled" : "Disabled"}
                  </span>
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="h-xl w-full" />
    </div>
  );
};

export default ProfilePage;
