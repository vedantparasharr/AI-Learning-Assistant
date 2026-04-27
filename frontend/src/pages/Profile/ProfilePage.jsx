import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

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

  useEffect(() => {
    setProfileForm({
      username: user?.username || "",
      email: user?.email || "",
      profileImage: user?.profileImage || "",
    });
  }, [user]);

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
        <h1 className="font-h1 text-h1 text-on-background">Profile Settings</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Manage your account details and learning preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 flex flex-col gap-lg">
          <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_10px_rgba(26,20,107,0.15)] p-md border-t-2 border-primary">
            <h2 className="font-h3 text-h3 text-on-background mb-md">
              Personal Information
            </h2>
            <div className="flex flex-col sm:flex-row gap-gutter items-start sm:items-center mb-md">
              <div className="relative group">
                <img
                  alt="Profile Picture"
                  className="w-24 h-24 rounded-full object-cover"
                  src={
                    user?.profileImage ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBwqtVkCUmFAkIW03CmRpsmlIWaT-Nfh4ahNBAdKqEmmP2pZSVECCbBdBdXZ6gIinCH3AwEkHIkLCODKRWgFoLyDB1yK93tLcsW0JgOHQrLsJVZu14-flkuxoHDVpBjT7TFo96wZmBmtwa6hlNqF0udbS66ka7BrV8gGNOfLwwdYWxfnZL_5h_l-iQs40OMHgwTb6PMDRo3dsjX7m_q_2WkmNwUcDomzPW1vXK-HHQRusmojn1nBHpbdQciv_ReZs867kddbFIC-7rY"
                  }
                />
              </div>
              <div className="flex-1 w-full space-y-sm">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-transparent border border-outline-variant rounded-DEFAULT px-sm py-2 font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:border-2 transition-all"
                    type="text"
                    value={profileForm.username}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        username: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">
                    Email Address
                  </label>
                  <input
                    className="w-full bg-transparent border border-outline-variant rounded-DEFAULT px-sm py-2 font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:border-2 transition-all"
                    type="email"
                    value={profileForm.email}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">
                    Profile Image URL
                  </label>
                  <input
                    className="w-full bg-transparent border border-outline-variant rounded-DEFAULT px-sm py-2 font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:border-2 transition-all"
                    type="text"
                    value={profileForm.profileImage}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        profileImage: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleProfileSubmit}
                disabled={savingProfile}
                className="bg-primary text-on-primary font-label-md text-label-md px-md py-2 rounded-DEFAULT hover:bg-primary-container transition-colors disabled:opacity-60"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_10px_rgba(26,20,107,0.15)] p-md">
            <h2 className="font-h3 text-h3 text-on-background mb-md">
              Account Security
            </h2>
            <div className="space-y-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">
                  Current Password
                </label>
                <input
                  className="w-full max-w-md bg-transparent border border-outline-variant rounded-DEFAULT px-sm py-2 font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:border-2 transition-all"
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
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">
                  New Password
                </label>
                <input
                  className="w-full max-w-md bg-transparent border border-outline-variant rounded-DEFAULT px-sm py-2 font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:border-2 transition-all"
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
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">
                  Confirm New Password
                </label>
                <input
                  className="w-full max-w-md bg-transparent border border-outline-variant rounded-DEFAULT px-sm py-2 font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:border-2 transition-all"
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
              </div>
              <div className="pt-sm flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  disabled={savingPassword}
                  className="border border-primary text-primary font-label-md text-label-md px-md py-2 rounded-DEFAULT hover:bg-surface-container-low transition-colors disabled:opacity-60"
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="border border-outline-variant text-on-surface font-label-md text-label-md px-md py-2 rounded-DEFAULT hover:bg-surface-container-low transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-lg">
          <section className="bg-surface-container-lowest rounded-xl shadow-ambient p-md h-full">
            <h2 className="font-h3 text-h3 text-on-background mb-md">
              Learning Preferences
            </h2>
            <div className="space-y-lg">
              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase">
                  Daily Study Goal
                </h3>
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">
                    timer
                  </span>
                  <select className="bg-transparent border border-outline-variant rounded-DEFAULT px-sm py-1 font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:border-2 transition-all cursor-pointer">
                    <option>15 Minutes</option>
                    <option selected>30 Minutes</option>
                    <option>60 Minutes</option>
                    <option>120 Minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase">
                  Notifications
                </h3>
                <div className="space-y-sm">
                  <label className="flex items-center gap-sm cursor-pointer">
                    <div className="relative">
                      <input
                        checked
                        readOnly
                        className="sr-only"
                        type="checkbox"
                      />
                      <div className="block bg-secondary w-10 h-6 rounded-full" />
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4" />
                    </div>
                    <span className="font-body-sm text-body-sm text-on-background">
                      Daily Reminders
                    </span>
                  </label>
                  <label className="flex items-center gap-sm cursor-pointer">
                    <div className="relative">
                      <input
                        checked
                        readOnly
                        className="sr-only"
                        type="checkbox"
                      />
                      <div className="block bg-secondary w-10 h-6 rounded-full" />
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4" />
                    </div>
                    <span className="font-body-sm text-body-sm text-on-background">
                      Course Updates
                    </span>
                  </label>
                  <label className="flex items-center gap-sm cursor-pointer">
                    <div className="relative">
                      <input className="sr-only" type="checkbox" />
                      <div className="block bg-outline-variant w-10 h-6 rounded-full" />
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition" />
                    </div>
                    <span className="font-body-sm text-body-sm text-on-background">
                      Community Mentions
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-surface-container-low p-sm rounded-lg border border-outline-variant">
                <div className="flex items-center gap-sm mb-xs">
                  <span className="material-symbols-outlined text-primary">
                    do_not_disturb_on
                  </span>
                  <h4 className="font-label-md text-label-md text-on-background">
                    Deep Focus Mode
                  </h4>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">
                  Automatically silence all notifications while viewing course
                  materials.
                </p>
                <label className="flex items-center gap-sm cursor-pointer">
                  <div className="relative">
                    <input
                      checked
                      readOnly
                      className="sr-only"
                      type="checkbox"
                    />
                    <div className="block bg-secondary w-10 h-6 rounded-full" />
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4" />
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase">
                    Enabled
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
