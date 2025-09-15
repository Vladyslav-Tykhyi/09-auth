"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import { Note } from "@/types/note";

interface NoteDetailsClientProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !note) return <p>Note not found</p>;

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      <small>Tag: {note.tag}</small>
    </div>
  );
}
