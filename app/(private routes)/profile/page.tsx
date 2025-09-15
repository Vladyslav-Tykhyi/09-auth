import { Metadata } from "next";
import { getMe } from "@/lib/api/serverApi";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "User Profile - NoteHub",
  description: "View and manage your user profile information",
  keywords: "profile, user, account, settings",
  authors: [{ name: "NoteHub Team" }],
  robots: "noindex, nofollow",
};

export default async function Profile() {
  let user = null;

  try {
    user = await getMe();
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }

  return <ProfileClient user={user} />;
}
