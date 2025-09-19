import { useState } from "react";
import { Button } from "@/components/ui";
import { TextInput, FormField } from "@/components/ui/core/primitives";
import { ErrorDisplay } from "@/components/ui/core/feedback";
import { Modal } from "@/components/modals";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@/components/ui/core/layout/Tabs";
import { useLoadingState, useAuthMutations } from "@/hooks";
import { signInWithEmail, signUpWithEmail } from "@/services";
import { logger } from "@/utils";
import GoogleSignInSection from "./GoogleSignInSection";

// Type guard for Firebase errors
function isFirebaseError(error: unknown): error is { code?: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

// Error message constants
const AUTH_ERRORS = {
  PASSWORDS_DONT_MATCH: "Passwords do not match.",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters long.",
  USER_NOT_FOUND: "No account found with this email address.",
  WRONG_PASSWORD: "Incorrect password.",
  INVALID_EMAIL: "Invalid email address.",
  TOO_MANY_REQUESTS: "Too many failed attempts. Please try again later.",
  EMAIL_IN_USE: "An account with this email already exists.",
  WEAK_PASSWORD: "Password is too weak. Please choose a stronger password.",
  SIGN_IN_FAILED: "Failed to sign in. Please try again.",
  SIGN_UP_FAILED: "Failed to create account. Please try again.",
  PASSWORD_RESET_FAILED:
    "Failed to send password reset email. Please try again.",
  GOOGLE_SIGN_IN_FAILED: "Failed to sign in with Google. Please try again.",
  GOOGLE_SIGN_IN_CANCELLED: "Google sign-in was cancelled.",
} as const;

// Custom hooks for form state management
function useSignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const reset = () => {
    setEmail("");
    setPassword("");
  };

  const isValid = email && password;

  return {
    email,
    setEmail,
    password,
    setPassword,
    reset,
    isValid,
  };
}

function useSignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const reset = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const isValid = email && password && confirmPassword;

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    reset,
    isValid,
  };
}

function usePasswordResetForm() {
  const [email, setEmail] = useState("");

  const reset = () => {
    setEmail("");
  };

  const isValid = email;

  return {
    email,
    setEmail,
    reset,
    isValid,
  };
}

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (userData: { uid: string; email: string | null }) => void;
}

export default function SignInModal({
  isOpen,
  onClose,
  onSuccess,
}: SignInModalProps) {
  // Shared state
  const [activeTab, setActiveTab] = useState("signin");
  const { loading: isLoading, withLoading } = useLoadingState();
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Form state using custom hooks
  const signInForm = useSignInForm();
  const signUpForm = useSignUpForm();
  const resetForm = usePasswordResetForm();

  // Auth mutations
  const { sendPasswordReset, signInWithGoogle } = useAuthMutations();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    await withLoading(async () => {
      try {
        const userData = await signInWithEmail(
          signInForm.email,
          signInForm.password
        );
        if (onSuccess) {
          onSuccess(userData);
        } else {
          onClose();
        }
        resetForms();
      } catch (error: unknown) {
        logger.error("Sign in error:", error);
        if (isFirebaseError(error)) {
          if (error.code === "auth/user-not-found") {
            setError(AUTH_ERRORS.USER_NOT_FOUND);
          } else if (error.code === "auth/wrong-password") {
            setError(AUTH_ERRORS.WRONG_PASSWORD);
          } else if (error.code === "auth/invalid-email") {
            setError(AUTH_ERRORS.INVALID_EMAIL);
          } else if (error.code === "auth/too-many-requests") {
            setError(AUTH_ERRORS.TOO_MANY_REQUESTS);
          } else {
            setError(AUTH_ERRORS.SIGN_IN_FAILED);
          }
        } else {
          setError(AUTH_ERRORS.SIGN_IN_FAILED);
        }
      }
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError(AUTH_ERRORS.PASSWORDS_DONT_MATCH);
      return;
    }

    // Validate password strength
    if (signUpForm.password.length < 6) {
      setError(AUTH_ERRORS.PASSWORD_TOO_SHORT);
      return;
    }

    await withLoading(async () => {
      try {
        const userData = await signUpWithEmail(
          signUpForm.email,
          signUpForm.password
        );
        if (onSuccess) {
          onSuccess(userData);
        } else {
          onClose();
        }
        resetForms();
      } catch (error: unknown) {
        logger.error("Sign up error:", error);
        if (isFirebaseError(error)) {
          if (error.code === "auth/email-already-in-use") {
            setError(AUTH_ERRORS.EMAIL_IN_USE);
          } else if (error.code === "auth/invalid-email") {
            setError(AUTH_ERRORS.INVALID_EMAIL);
          } else if (error.code === "auth/weak-password") {
            setError(AUTH_ERRORS.WEAK_PASSWORD);
          } else {
            setError(AUTH_ERRORS.SIGN_UP_FAILED);
          }
        } else {
          setError(AUTH_ERRORS.SIGN_UP_FAILED);
        }
      }
    });
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetSuccess(false);

    try {
      await sendPasswordReset.mutateAsync(resetForm.email);
      setResetSuccess(true);
      resetForm.reset();
    } catch (error: unknown) {
      logger.error("Password reset error:", error);
      if (isFirebaseError(error)) {
        if (error.code === "auth/user-not-found") {
          setError(AUTH_ERRORS.USER_NOT_FOUND);
        } else if (error.code === "auth/invalid-email") {
          setError(AUTH_ERRORS.INVALID_EMAIL);
        } else {
          setError(AUTH_ERRORS.PASSWORD_RESET_FAILED);
        }
      } else {
        setError(AUTH_ERRORS.PASSWORD_RESET_FAILED);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");

    try {
      const userData = await signInWithGoogle.mutateAsync();
      if (onSuccess) {
        onSuccess(userData);
      } else {
        onClose();
      }
      resetForms();
    } catch (error: unknown) {
      logger.error("Google sign-in error:", error);
      if (isFirebaseError(error)) {
        if (
          error.code === "auth/cancelled-popup-request" ||
          error.code === "auth/popup-closed-by-user"
        ) {
          setError(AUTH_ERRORS.GOOGLE_SIGN_IN_CANCELLED);
        } else {
          setError(AUTH_ERRORS.GOOGLE_SIGN_IN_FAILED);
        }
      } else {
        setError(AUTH_ERRORS.GOOGLE_SIGN_IN_FAILED);
      }
    }
  };

  const resetForms = () => {
    signInForm.reset();
    signUpForm.reset();
    resetForm.reset();
    setError("");
    setResetSuccess(false);
  };

  const handleClose = () => {
    resetForms();
    setActiveTab("signin");
    onClose();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setError(""); // Clear errors when switching tabs
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Authentication"
      size="sm"
    >
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        variant="underline"
      >
        <TabList aria-label="Authentication options">
          <Tab value="signin">Sign In</Tab>
          <Tab value="signup">Sign Up</Tab>
          <Tab value="reset">Reset Password</Tab>
        </TabList>

        <TabPanels>
          <TabPanel value="signin">
            <GoogleSignInSection
              onClick={handleGoogleSignIn}
              disabled={isLoading || signInWithGoogle.isPending}
              isPending={signInWithGoogle.isPending}
              dividerText="Or continue with email"
            />

            <form onSubmit={handleSignIn} className="space-y-4">
              <FormField label="Email address" required>
                <TextInput
                  type="email"
                  value={signInForm.email}
                  onChange={signInForm.setEmail}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </FormField>

              <FormField label="Password" required>
                <TextInput
                  type="password"
                  value={signInForm.password}
                  onChange={signInForm.setPassword}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </FormField>

              <div className="text-right">
                <Button
                  type="button"
                  onClick={() => setActiveTab("reset")}
                  variant="ghost"
                  size="sm"
                  disabled={isLoading}
                >
                  Forgot Password?
                </Button>
              </div>

              <ErrorDisplay error={error} />

              <Button
                type="submit"
                disabled={isLoading || !signInForm.isValid}
                className="w-full"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabPanel>

          <TabPanel value="signup">
            <GoogleSignInSection
              onClick={handleGoogleSignIn}
              disabled={isLoading || signInWithGoogle.isPending}
              isPending={signInWithGoogle.isPending}
              dividerText="Or create account with email"
            />

            <form onSubmit={handleSignUp} className="space-y-4">
              <FormField label="Email address" required>
                <TextInput
                  type="email"
                  value={signUpForm.email}
                  onChange={signUpForm.setEmail}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </FormField>

              <FormField label="Password" required>
                <TextInput
                  type="password"
                  value={signUpForm.password}
                  onChange={signUpForm.setPassword}
                  placeholder="Create a password"
                  disabled={isLoading}
                />
              </FormField>

              <FormField label="Confirm password" required>
                <TextInput
                  type="password"
                  value={signUpForm.confirmPassword}
                  onChange={signUpForm.setConfirmPassword}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </FormField>

              <ErrorDisplay error={error} />

              <Button
                type="submit"
                disabled={isLoading || !signUpForm.isValid}
                className="w-full"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </TabPanel>

          <TabPanel value="reset">
            {resetSuccess ? (
              <div className="space-y-4 text-center">
                <div className="text-green-400">
                  <p className="font-medium">Password reset email sent!</p>
                  <p className="text-sm text-zinc-400 mt-2">
                    Check your email for instructions to reset your password.
                  </p>
                </div>
                <Button
                  onClick={() => setActiveTab("signin")}
                  variant="ghost"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="text-center text-sm text-zinc-400 mb-4">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </div>

                <FormField label="Email address" required>
                  <TextInput
                    type="email"
                    value={resetForm.email}
                    onChange={resetForm.setEmail}
                    placeholder="Enter your email"
                    disabled={sendPasswordReset.isPending}
                  />
                </FormField>

                <ErrorDisplay error={error} />

                <Button
                  type="submit"
                  disabled={sendPasswordReset.isPending || !resetForm.isValid}
                  className="w-full"
                >
                  {sendPasswordReset.isPending
                    ? "Sending..."
                    : "Send Reset Email"}
                </Button>

                <Button
                  type="button"
                  onClick={() => setActiveTab("signin")}
                  variant="ghost"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </form>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Modal>
  );
}
