import { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Create New Note - NoteHub",
  description: "Create a new note with title, content and tags",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Create New Note - NoteHub",
    description: "Create a new note with title, content and tags",
    url: "/notes/action/create",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
