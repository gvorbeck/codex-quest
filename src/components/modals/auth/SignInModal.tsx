import { useState } from "react";
import { Button } from "@/components/ui";
import { TextInput, FormField } from "@/components/ui/inputs";
import { ErrorDisplay } from "@/components/ui/feedback";
import { Modal } from "../base";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@/components/ui/layout/Tabs";
import { useLoadingState } from "@/hooks";
import { signInWithEmail, signUpWithEmail } from "@/services/auth";
import { logger } from "@/utils/logger";

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

  // Form state using custom hooks
  const signInForm = useSignInForm();
  const signUpForm = useSignUpForm();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    await withLoading(async () => {
      try {
        const userData = await signInWithEmail(signInForm.email, signInForm.password);
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
        const userData = await signUpWithEmail(signUpForm.email, signUpForm.password);
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

  const resetForms = () => {
    signInForm.reset();
    signUpForm.reset();
    setError("");
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
        </TabList>

        <TabPanels>
          <TabPanel value="signin">
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
        </TabPanels>
      </Tabs>
    </Modal>
  );
}
