import { useState } from "react";
import { Button, TextInput, Modal } from "@/components/ui";
import { signInWithEmail } from "@/services/auth";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userData = await signInWithEmail(email, password);
      if (onSuccess) {
        onSuccess(userData);
      } else {
        onClose();
      }
      // Reset form
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      console.error("Sign in error:", error);
      // Handle common Firebase auth errors
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

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign In" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <TextInput
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            required
            disabled={isLoading}
            aria-label="Email address"
          />
        </div>

        <div>
          <TextInput
            type="password"
            value={password}
            onChange={setPassword}
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

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center text-sm text-zinc-400">
            Don't have an account? Contact your administrator.
          </div>
        </div>
      </form>
    </Modal>
  );
}
