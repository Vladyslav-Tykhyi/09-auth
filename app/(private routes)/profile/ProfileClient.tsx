"use client";

import { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./ProfilePage.module.css";
import Link from "next/link";
import Image from "next/image"; // Додаємо імпорт Image

interface ProfileClientProps {
  user: User | null;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <div className={css.loading}>Loading profile...</div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <p className={css.errorMessage}>
            Please sign in to view your profile.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"} // Використовуємо аватарку з user
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>
            <strong>Username:</strong> {user.username || "Not set"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>
    </main>
  );
}
