"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { authApi } from "@/lib/api/clientApi";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sessionValid = await authApi.checkSession();

        if (sessionValid) {
          const user = await authApi.getMe();
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
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
