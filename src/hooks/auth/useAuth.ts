import { useState, useEffect } from "react";
import { onAuthStateChange } from "@/services";
import type { AuthUser } from "@/services";
import { useLoadingState } from "../ui/useLoadingState";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const { loading, stopLoading } = useLoadingState({ initialState: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      stopLoading();
    });

    return unsubscribe;
  }, [stopLoading]);

  return { user, loading };
}
