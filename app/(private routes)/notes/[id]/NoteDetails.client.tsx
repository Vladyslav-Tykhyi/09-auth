"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import { Note } from "@/types/note";
import styles from "./NoteDetails.client.module.css";

interface NoteDetailsClientProps {
  note: Note;
}

export default function NoteDetailsClient({ note }: NoteDetailsClientProps) {
  const {
    data: noteData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", note.id],
    queryFn: () => fetchNoteById(note.id),
    initialData: note, // Використовуємо initialData з серверного рендерингу
  });

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  if (!noteData) {
    return <div className={styles.error}>Note not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{noteData.title}</h1>
      <p className={styles.content}>{noteData.content}</p>
      <div className={styles.meta}>
        <span className={styles.tag}>Tag: {noteData.tag}</span>
        {noteData.updatedAt && (
          <span className={styles.date}>
            Updated: {new Date(noteData.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
