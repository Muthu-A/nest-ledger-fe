import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import logo from "../../assets/nestledger_logo.svg";
import "./login.css";
import NotificationModal from "./NotificationModal";
import { requestNotificationPermission } from "../../firebase/notificationService";
import { apiPost } from "../../services/api";

interface InvitationDetails {
  familyName: string;
  expiresAt: string;
  email: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showJoinCode, setShowJoinCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitationDetails, setInvitationDetails] =
    useState<InvitationDetails | null>(null);
  const [isLoadingInvitation, setIsLoadingInvitation] = useState(false);
  const [showNotificationCard, setShowNotificationCard] = useState(false);
  const [postAuthRedirect, setPostAuthRedirect] = useState<string | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useAuth();

  const shouldShowNotificationPrompt = () =>
    Notification.permission !== "granted" &&
    !localStorage.getItem("notification_dismissed");

  // Check if URL has invitation code
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setInvitationCode(codeFromUrl);
      setShowJoinCode(true);
      validateInvitationCode(codeFromUrl);
    }
  }, [searchParams]);

  // Validate invitation code
  const validateInvitationCode = async (code: string) => {
    if (!code.trim()) {
      setInvitationDetails(null);
      return;
    }

    setIsLoadingInvitation(true);
    try {
      const response = await fetch(`/api/family/invite/${code.trim()}/details`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Invitation code not found");
        } else if (response.status === 400) {
          setError("Invitation has expired");
        } else {
          setError("Failed to verify invitation code");
        }
        setInvitationDetails(null);
        return;
      }

      const data = await response.json();
      setInvitationDetails(data.data.invitation);
      setError(null);
    } catch (err) {
      setError("Failed to verify invitation code");
      setInvitationDetails(null);
      console.error("Invitation validation error:", err);
    } finally {
      setIsLoadingInvitation(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase();
    setInvitationCode(code);

    if (code.length > 0) {
      validateInvitationCode(code);
    } else {
      setInvitationDetails(null);
      setError(null);
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (showJoinCode) {
        // Join with code mode
        if (!invitationCode.trim()) {
          throw new Error("Please enter an invitation code");
        }

        if (!invitationDetails) {
          throw new Error("Invalid invitation code");
        }

        // Sign up first, then login, then join the family and navigate
        if (!name.trim()) {
          throw new Error("Please enter your name for new account");
        }
        await auth.signup(email, password, name.trim());
        await auth.login(email, password);

        // Now join the family
        await auth.joinFamily(invitationCode);

        // Wait briefly for AuthContext to reflect the joined familyId so ProtectedRoute doesn't redirect.
        const waitForFamily = async (timeout = 1000) => {
          const start = Date.now();
          while (Date.now() - start < timeout) {
            if (auth.familyId) return true;
            // small delay
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 50));
          }
          return false;
        };

        await waitForFamily();

        if (shouldShowNotificationPrompt()) {
          setPostAuthRedirect("/dashboard");
          setShowNotificationCard(true);
        } else {
          navigate("/dashboard");
        }
      } else if (isSignup) {
        // Normal signup mode
        if (!name.trim()) throw new Error("Name is required");
        await auth.signup(email, password, name.trim());

        if (shouldShowNotificationPrompt()) {
          setPostAuthRedirect("/family/setup");
          setShowNotificationCard(true);
        } else {
          navigate("/family/setup");
        }
      } else {
        // Normal login mode
        await auth.login(email, password);

        if (shouldShowNotificationPrompt()) {
          setPostAuthRedirect("/post-login");
          setShowNotificationCard(true);
        } else {
          navigate("/post-login");
        }
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  }
  const handleEnableNotifications = async () => {
    const token = await requestNotificationPermission();

    try {
      if (token) {
        await apiPost("/notifications/register-token", { token });
      }
    } catch (error) {
      console.error("Failed to register notification token:", error);
    } finally {
      setShowNotificationCard(false);
      if (postAuthRedirect) {
        navigate(postAuthRedirect);
        setPostAuthRedirect(null);
      }
    }
  };

  const handleDismissNotificationModal = () => {
    localStorage.setItem("notification_dismissed", "true");
    localStorage.setItem("notification_dismissed_at", Date.now().toString());
    setShowNotificationCard(false);

    if (postAuthRedirect) {
      navigate(postAuthRedirect);
      setPostAuthRedirect(null);
    }
  };

  return (
    <section className="login-page">
      <div className="login-container">
        {showNotificationCard && (
          <NotificationModal
            onEnable={handleEnableNotifications}
            onDismiss={handleDismissNotificationModal}
          />
        )}
        {/* Left Section - Branding */}
        <div className="login-left">
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#1c3829",
                letterSpacing: "-0.5px",
                lineHeight: 1.1,
              }}
            >
              Nest<span style={{ color: "#16a34a" }}>Ledger</span>
            </span>

            <span
              className="header-subtitle"
              style={{
                fontSize: "0.62rem",
                fontWeight: 600,
                color: "#16a34a",
                letterSpacing: "2.8px",
                textTransform: "uppercase",
              }}
            >
              Family Budget Tracker
            </span>
          </div>

          <div className="login-features">
            <div className="feature-item">
              <div className="feature-icon">💰</div>
              <div>
                <h3>Track Expenses</h3>
                <p>Monitor every rupee you spend</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <div>
                <h3>Set Goals</h3>
                <p>Plan for your family's future</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div>
                <h3>Smart Insights</h3>
                <p>Get financial recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-branding">
                <img src={logo} alt="NestLedger" className="login-logo" />
              </div>
              <h2>
                {showJoinCode
                  ? invitationDetails
                    ? `Join ${invitationDetails.familyName}`
                    : "Join Family"
                  : isSignup
                    ? "Create account"
                    : "Welcome Back"}
              </h2>
              <p className="login-description">
                {showJoinCode
                  ? invitationDetails
                    ? `Sign in or create account to join ${invitationDetails.familyName}`
                    : "Enter your invitation code"
                  : isSignup
                    ? "Sign up to get started"
                    : "Sign in to your family budget account"}
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {/* Invitation Code Section */}
              {showJoinCode && (
                <>
                  <div className="form-group">
                    <label htmlFor="code">Invitation Code</label>
                    <div className="input-wrapper">
                      <input
                        id="code"
                        type="text"
                        placeholder="Enter code (e.g., ABC123XYZ)"
                        value={invitationCode}
                        onChange={handleCodeChange}
                        disabled={isLoadingInvitation}
                        maxLength={20}
                        style={{ textTransform: "uppercase" }}
                        required={showJoinCode}
                      />
                      {isLoadingInvitation && (
                        <div className="input-loading">
                          <div className="spinner" />
                        </div>
                      )}
                    </div>
                    {invitationDetails && !error && (
                      <div className="invitation-details">
                        <p style={{ color: "#16a34a", fontSize: "0.9rem" }}>
                          ✓ Valid invitation for{" "}
                          <strong>{invitationDetails.familyName}</strong>
                        </p>
                        <p
                          style={{
                            color: "#666",
                            fontSize: "0.8rem",
                            marginTop: "4px",
                          }}
                        >
                          Expires:{" "}
                          {new Date(
                            invitationDetails.expiresAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* <div className="divider">
                    <span>Then login or create account</span>
                  </div> */}
                </>
              )}

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {showJoinCode &&
                  invitationDetails &&
                  email !== invitationDetails.email && (
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#ff9800",
                        marginTop: "4px",
                      }}
                    >
                      ⚠️ This invitation is for {invitationDetails.email}
                    </p>
                  )}
              </div>

              {/* Name Field (for signup or join code) */}
              {(isSignup || showJoinCode) && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignup}
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot (only in normal login) */}
              {/* {!showJoinCode && !isSignup && (
                <div className="form-footer">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Forgot password flow not implemented");
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
              )} */}

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="button primary login-button"
                disabled={
                  isLoading ||
                  (showJoinCode && !invitationDetails) ||
                  isLoadingInvitation
                }
              >
                {isLoading
                  ? showJoinCode
                    ? "Joining..."
                    : isSignup
                      ? "Creating…"
                      : "Signing in..."
                  : showJoinCode
                    ? "Join Family"
                    : isSignup
                      ? "Sign up"
                      : "Sign In"}
              </button>
            </form>

            {/* Bottom Actions */}
            <div className="login-footer">
              {!showJoinCode ? (
                <>
                  <div className="divider">
                    <span>
                      {isSignup ? "Have an account?" : "Don't have an account?"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="button secondary signup-button"
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setError(null);
                    }}
                  >
                    {isSignup ? "Back to Sign in" : "Create Family Account"}
                  </button>

                  <div className="divider">
                    <span>Or</span>
                  </div>

                  <button
                    type="button"
                    className="button outline join-code-button"
                    onClick={() => {
                      setShowJoinCode(true);
                      setError(null);
                      setIsSignup(false);
                    }}
                  >
                    Join with Invitation Code
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="button text back-button"
                  onClick={() => {
                    setShowJoinCode(false);
                    setInvitationCode("");
                    setInvitationDetails(null);
                    setError(null);
                  }}
                >
                  ← Back to Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
