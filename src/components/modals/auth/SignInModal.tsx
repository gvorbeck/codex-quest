import { useState } from "react";
import { Button } from "@/components/ui";
import { TextInput } from "@/components/ui/inputs";
import { Modal } from "../base";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@/components/ui/layout/Tabs";
import { signInWithEmail, signUpWithEmail } from "@/services/auth";
import { logger } from "@/utils/logger";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sign in form state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign up form state
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userData = await signInWithEmail(signInEmail, signInPassword);
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
        setError("No account found with this email address.");
      } else if (firebaseError.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (firebaseError.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (signUpPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate password strength
    if (signUpPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const userData = await signUpWithEmail(signUpEmail, signUpPassword);
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
        setError("An account with this email already exists.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (firebaseError.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setSignInEmail("");
    setSignInPassword("");
    setSignUpEmail("");
    setSignUpPassword("");
    setConfirmPassword("");
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
              <div>
                <TextInput
                  type="email"
                  value={signInEmail}
                  onChange={setSignInEmail}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  aria-label="Email address"
                />
              </div>

              <div>
                <TextInput
                  type="password"
                  value={signInPassword}
                  onChange={setSignInPassword}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  aria-label="Password"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="text-red-400 text-sm bg-red-950/20 border border-red-600/30 rounded-lg p-3"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !signInEmail || !signInPassword}
                className="w-full"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabPanel>

          <TabPanel value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <TextInput
                  type="email"
                  value={signUpEmail}
                  onChange={setSignUpEmail}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  aria-label="Email address for new account"
                />
              </div>

              <div>
                <TextInput
                  type="password"
                  value={signUpPassword}
                  onChange={setSignUpPassword}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                  aria-label="Password for new account"
                />
              </div>

              <div>
                <TextInput
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                  aria-label="Confirm password"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="text-red-400 text-sm bg-red-950/20 border border-red-600/30 rounded-lg p-3"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !signUpEmail ||
                  !signUpPassword ||
                  !confirmPassword
                }
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
