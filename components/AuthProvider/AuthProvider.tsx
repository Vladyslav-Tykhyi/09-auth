"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { authApi } from "@/lib/api/clientApi";
import type { ApiError } from "@/lib/api/api";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      try {
        const user = await authApi.checkSession();
        setUser(user); // als unauthorized → null
      } catch (error) {
        const apiError = error as ApiError;

        if (apiError?.response?.status === 401) {
          // Niet ingelogd, geen error tonen in console
          setUser(null);
        } else {
          console.error("Auth check failed:", error);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
