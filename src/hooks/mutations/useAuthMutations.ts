import { useMutation } from "@tanstack/react-query";
import { sendPasswordReset, signInWithGoogle } from "@/services";
import { getErrorMessage, logger } from "@/utils";

/**
 * Authentication-related mutations
 */
export function useAuthMutations() {
  const passwordResetMutation = useMutation({
    mutationFn: (email: string) => sendPasswordReset(email),
    onError: (error) => {
      logger.error("Password reset error:", error);
    },
  });

  const googleSignInMutation = useMutation({
    mutationFn: () => signInWithGoogle(),
    onError: (error) => {
      logger.error("Google sign-in error:", error);
    },
  });

  return {
    sendPasswordReset: {
      mutate: passwordResetMutation.mutate,
      mutateAsync: passwordResetMutation.mutateAsync,
      isPending: passwordResetMutation.isPending,
      error: passwordResetMutation.error
        ? getErrorMessage(passwordResetMutation.error)
        : null,
      isError: passwordResetMutation.isError,
      isSuccess: passwordResetMutation.isSuccess,
      reset: passwordResetMutation.reset,
    },
    signInWithGoogle: {
      mutate: googleSignInMutation.mutate,
      mutateAsync: googleSignInMutation.mutateAsync,
      isPending: googleSignInMutation.isPending,
      error: googleSignInMutation.error
        ? getErrorMessage(googleSignInMutation.error)
        : null,
      isError: googleSignInMutation.isError,
      isSuccess: googleSignInMutation.isSuccess,
      reset: googleSignInMutation.reset,
    },
  };
}
