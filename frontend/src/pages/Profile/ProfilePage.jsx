import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import { Input, PrimaryButton, SecondaryButton, PageShell } from "../../components/common/ui";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";

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



  const profileMutation = useMutation({
    mutationFn: (form) => authService.updateProfile(form),
    onSuccess: (response) => {
      updateUser(response.data);
      toast.success(response.message || "Profile updated");
    },
    onError: (requestError) => {
      toast.error(
        requestError.error ||
          requestError.message ||
          "Could not update profile",
      );
    }
  });

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    profileMutation.mutate(profileForm);
  };

  const passwordMutation = useMutation({
    mutationFn: (form) => authService.changePassword(form),
    onSuccess: (response) => {
      toast.success(response.message || "Password changed");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (requestError) => {
      toast.error(
        requestError.error ||
          requestError.message ||
          "Could not change password",
      );
    }
  });

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    passwordMutation.mutate(passwordForm);
  };

  const savingProfile = profileMutation.isPending;
  const savingPassword = passwordMutation.isPending;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-safe">
      <PageShell
        title="Profile Settings"
        description="Manage your account details and learning preferences."
      >
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
                  <label className="cursor-pointer border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-md text-label-md px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-1.5">
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
                      className="border border-error/50 text-error font-label-md text-label-md px-4 py-2.5 rounded-lg hover:bg-error-container hover:text-error transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md pt-sm">
                  <Input
                    type="text"
                    label="Full Name"
                    maxLength={50}
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
                    maxLength={255}
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
                maxLength={255}
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
                maxLength={255}
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
                maxLength={255}
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
      </div>

      <div className="h-xl w-full" />
      </PageShell>
    </div>
  );
};

export default ProfilePage;
