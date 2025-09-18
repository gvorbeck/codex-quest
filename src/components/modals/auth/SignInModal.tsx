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
import { signInWithEmail, signUpWithEmail } from "@/services/auth";
import { logger } from "@/utils";

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
        const firebaseError = error as { code?: string };
        if (firebaseError.code === "auth/user-not-found") {
          setError(AUTH_ERRORS.USER_NOT_FOUND);
        } else if (firebaseError.code === "auth/wrong-password") {
          setError(AUTH_ERRORS.WRONG_PASSWORD);
        } else if (firebaseError.code === "auth/invalid-email") {
          setError(AUTH_ERRORS.INVALID_EMAIL);
        } else if (firebaseError.code === "auth/too-many-requests") {
          setError(AUTH_ERRORS.TOO_MANY_REQUESTS);
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
        const firebaseError = error as { code?: string };
        if (firebaseError.code === "auth/email-already-in-use") {
          setError(AUTH_ERRORS.EMAIL_IN_USE);
        } else if (firebaseError.code === "auth/invalid-email") {
          setError(AUTH_ERRORS.INVALID_EMAIL);
        } else if (firebaseError.code === "auth/weak-password") {
          setError(AUTH_ERRORS.WEAK_PASSWORD);
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
      const firebaseError = error as { code?: string };
      if (firebaseError.code === "auth/user-not-found") {
        setError(AUTH_ERRORS.USER_NOT_FOUND);
      } else if (firebaseError.code === "auth/invalid-email") {
        setError(AUTH_ERRORS.INVALID_EMAIL);
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
      const firebaseError = error as { code?: string };
      if (
        firebaseError.code === "auth/cancelled-popup-request" ||
        firebaseError.code === "auth/popup-closed-by-user"
      ) {
        setError(AUTH_ERRORS.GOOGLE_SIGN_IN_CANCELLED);
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
            <div className="space-y-6">
              {/* Google Sign In Button */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || signInWithGoogle.isPending}
                variant="secondary"
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {signInWithGoogle.isPending
                  ? "Signing in..."
                  : "Continue with Google"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 py-1 bg-zinc-900 text-zinc-400 rounded">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>

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
            <div className="space-y-6">
              {/* Google Sign In Button */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || signInWithGoogle.isPending}
                variant="secondary"
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {signInWithGoogle.isPending
                  ? "Signing in..."
                  : "Continue with Google"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 py-1 bg-zinc-900 text-zinc-400 rounded">
                    Or create account with email
                  </span>
                </div>
              </div>
            </div>

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
