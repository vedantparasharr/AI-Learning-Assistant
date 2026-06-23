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
    <div className="flex min-h-screen items-center justify-center bg-background text-on-surface p-md">
      <main className="w-full max-w-[440px] mx-auto">
        <div className="text-center mb-xl">
          <h1 className="font-h1 text-h1 text-primary mb-sm tracking-tight font-black">DistillLearn</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Verify your email</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl shadow-[0_8px_30px_rgba(26,20,107,0.04)] flex flex-col items-center">
          <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-lg border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
              mark_email_read
            </span>
          </div>

          <h2 className="font-title text-title text-on-surface mb-xs text-center font-bold">Check your inbox</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-xl text-center">
            We&apos;ve sent a 6-digit verification code to your email. Please enter it below.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-lg">
            <div className="flex justify-between gap-2 mx-auto w-full max-w-xs" id="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  className="w-11 h-13 text-center text-h2 font-semibold border border-outline-variant/60 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface-container-lowest outline-none transition-colors"
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
              className="w-full flex justify-center items-center py-2.5 px-lg border border-transparent rounded-lg bg-primary font-label-md text-label-md text-on-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 cursor-pointer"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-lg">
            <Link className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors inline-flex items-center justify-center gap-xs" to={`/login${location.search ? `?${new URLSearchParams({ returnTo }).toString()}` : ""}`}>
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Login
            </Link>
          </div>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant mt-xl text-center">
          Didn&apos;t receive a code?{" "}
          <button type="button" className="text-primary font-semibold hover:text-primary-container transition-colors hover:underline" onClick={handleResendOtp} disabled={resending || cooldown > 0}>
            {resending ? "Resending..." : cooldown > 0 ? `Resend in ${formatSeconds(cooldown)}` : "Resend Code"}
          </button>{" "}
          or{" "}
          <Link className="text-primary hover:text-primary-container transition-colors hover:underline" to="/help-center">
            contact support
          </Link>.
        </p>
      </main>
    </div>
  );
};

export default VerifyEmailPage;
