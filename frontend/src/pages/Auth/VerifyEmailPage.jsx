import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";
import { PrimaryButton, SecondaryButton } from "../../components/common/ui";
import Logo from "../../components/common/Logo";
const RESEND_COOLDOWN_SECONDS = 30;

const getCooldownStorageKey = (email) => `otp-resend-cooldown-until:${(email || "").toLowerCase()}`;

const getRemainingCooldown = (email) => {
  if (typeof window === "undefined" || !email) {
    return 0;
  }

  const until = Number(localStorage.getItem(getCooldownStorageKey(email)));
  if (!until || Number.isNaN(until)) {
    return 0;
  }

  const remaining = Math.ceil((until - Date.now()) / 1000);
  if (remaining <= 0) {
    localStorage.removeItem(getCooldownStorageKey(email));
    return 0;
  }

  return remaining;
};

const formatSeconds = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const inputRefs = useRef([]);

  const email = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("email") || "";
  }, [location.search]);

  const returnTo = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("returnTo") || "/dashboard";
  }, [location.search]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(() => getRemainingCooldown(email));

  useEffect(() => {
    setCooldown(getRemainingCooldown(email));
  }, [email]);

  useEffect(() => {
    if (cooldown <= 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCooldown((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [cooldown]);

  const handleDigitChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });

    if (digit && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) {
      return;
    }

    event.preventDefault();
    const next = ["", "", "", "", "", ""];
    pasted.split("").forEach((digit, index) => {
      next[index] = digit;
    });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const verifyMutation = useMutation({
    mutationFn: ({ email, code }) => authService.verifyEmail(email, code),
    onSuccess: (response) => {
      login(response.data.user);
      toast.success(response.message || "Email verified successfully");
      navigate(returnTo, { replace: true });
    },
    onError: (error) => {
      toast.error(error.error || error.message || "Verification failed");
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      toast.error("Missing email. Please register again.");
      return;
    }

    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter the full 6-digit code.");
      return;
    }

    verifyMutation.mutate({ email, code });
  };

  const resendMutation = useMutation({
    mutationFn: () => authService.resendOtp(email),
    onSuccess: (response) => {
      toast.success(response.message || "OTP sent again");
      if (typeof window !== "undefined") {
        localStorage.setItem(
          getCooldownStorageKey(email),
          String(Date.now() + RESEND_COOLDOWN_SECONDS * 1000),
        );
      }
      setCooldown(RESEND_COOLDOWN_SECONDS);
    },
    onError: (error) => {
      toast.error(error.error || error.message || "Unable to resend OTP");
    }
  });

  const handleResendOtp = () => {
    if (!email) {
      toast.error("Missing email. Please register again.");
      return;
    }

    resendMutation.mutate();
  };

  const submitting = verifyMutation.isPending;
  const resending = resendMutation.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-on-surface p-md">
      <main className="w-full max-w-[400px] mx-auto">

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-xl flex flex-col gap-md">
          {/* Brand */}
          <div className="flex justify-center pb-xs">
            <Logo className="h-10" />
          </div>
          <div className="text-center">
            <h2 className="font-title text-title text-on-surface font-bold">Verify email</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              We sent a verification code to {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-md">
            <div className="grid grid-cols-6 gap-2 w-full" id="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  className="h-14 w-full text-center text-h2 font-semibold border border-outline-variant/60 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface-container-lowest outline-none transition-colors p-0"
                  maxLength={1}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(event) => handleDigitChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                />
              ))}
            </div>
            <button type="button" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors self-center" onClick={handleResendOtp} disabled={resending || cooldown > 0}>
              {cooldown > 0 ? `Resend(${formatSeconds(cooldown)})` : `Resend`}
            </button>
            <div className="flex gap-md" >
              <SecondaryButton
                type="button"
                className="w-full flex justify-center"
                onClick={() => navigate(`/login${location.search ? `?${new URLSearchParams({ returnTo }).toString()}` : ""}`)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center"
              >
                Confirm
              </PrimaryButton>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default VerifyEmailPage;
