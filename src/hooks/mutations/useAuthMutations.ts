import { useMutation } from "@tanstack/react-query";
import { sendPasswordReset } from "@/services/auth";
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
  };
}
