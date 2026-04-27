import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

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
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
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

  const handleSubmit = async (event) => {
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

    setSubmitting(true);
    try {
      const response = await authService.verifyEmail(email, code);
      login(response.data.user);
      toast.success(response.message || "Email verified successfully");
      navigate(returnTo, { replace: true });
    } catch (error) {
      toast.error(error.error || error.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Missing email. Please register again.");
      return;
    }

    setResending(true);
    try {
      const response = await authService.resendOtp(email);
      toast.success(response.message || "OTP sent again");
      if (typeof window !== "undefined") {
        localStorage.setItem(
          getCooldownStorageKey(email),
          String(Date.now() + RESEND_COOLDOWN_SECONDS * 1000),
        );
      }
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      toast.error(error.error || error.message || "Unable to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-gutter font-body-md text-on-background">
      <main className="max-w-md w-full bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(26,20,107,0.05)] border border-surface-variant p-xl flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-margin border-2 border-surface-variant">
          <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>
            mark_email_read
          </span>
        </div>

        <h1 className="font-h2 text-h2 text-primary mb-md">Check your inbox</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
          We&apos;ve sent a 6-digit verification code to your email address. Please enter the code below to verify your account.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-md">
          <div className="flex flex-col gap-lg w-full mb-md">
            <div className="flex justify-between gap-sm mx-auto w-full max-w-xs" id="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  className="w-12 h-14 text-center text-h3 font-bold border-2 border-surface-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest"
                  maxLength={1}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(event) => handleDigitChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                />
              ))}
            </div>

            <button
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-md px-lg rounded-lg hover:bg-primary-container transition-colors duration-200"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>

        <Link className="w-full bg-transparent text-primary font-label-md text-label-md py-md px-lg rounded-lg hover:bg-surface-container-low transition-colors duration-200 flex items-center justify-center gap-sm" to={`/login${location.search ? `?${new URLSearchParams({ returnTo }).toString()}` : ""}`}>
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Login
        </Link>

        <p className="font-body-sm text-body-sm text-outline mt-margin">
          Didn&apos;t receive a code?{" "}
          <button type="button" className="text-primary font-semibold hover:underline" onClick={handleResendOtp} disabled={resending || cooldown > 0}>
            {resending ? "Resending..." : cooldown > 0 ? `Resend in ${formatSeconds(cooldown)}` : "Resend Code"}
          </button>{" "}
          or{" "}
          <Link className="text-primary hover:underline" to="/help-center">
            contact support
          </Link>.
        </p>
      </main>
    </div>
  );
};

export default VerifyEmailPage;
