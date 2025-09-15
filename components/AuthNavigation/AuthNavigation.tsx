"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { signOut } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

interface LogoutError {
  message?: string;
}

const AuthNavigation = () => {
  const { user, isAuthenticated, clearAuth, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      clearAuth();
      router.push("/sign-in");
    } catch (err) {
      const error = err as LogoutError;
      if (
        error.message?.includes("404") ||
        error.message?.includes("Logout endpoint")
      ) {
        clearAuth();
        router.push("/sign-in");
      } else {
        console.error("Logout error:", error);
        alert("Logout failed: " + error.message);
      }
    }
  };

  if (isLoading) {
    return <li className={css.navigationItem}>Loading...</li>;
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
            <button className={css.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
};

export default AuthNavigation;
