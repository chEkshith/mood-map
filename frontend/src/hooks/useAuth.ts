import { useEffect, useState } from "react";
import { authApi } from "../api/client";
import { useMoodStore } from "../store/moodStore";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const user = useMoodStore((s) => s.user);
  const isAuthenticated = useMoodStore((s) => s.isAuthenticated);
  const setUser = useMoodStore((s) => s.setUser);
  const clearUser = useMoodStore((s) => s.clearUser);

  useEffect(() => {
    let cancelled = false;

    async function rehydrate() {
      try {
        const me = await authApi.getMe();
        if (!cancelled) {
          setUser(me);
        }
      } catch {
        if (!cancelled) {
          clearUser();
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    rehydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isAuthenticated, isLoading };
}
