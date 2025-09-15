"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import NoteDetailsClient from "@/app/(private routes)/notes/[id]/NoteDetails.client";
import Modal from "@/components/Modal/Modal";

interface NotePreviewProps {
  noteId: string;
}

export default function NotePreview({ noteId }: NotePreviewProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading note...</p>
        </div>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal onClose={handleClose}>
        <div className="error-container">
          <h3>Error loading note</h3>
          <p>{(error as Error).message}</p>
        </div>
      </Modal>
    );
  }

  if (!note) {
    return (
      <Modal onClose={handleClose}>
        <div className="not-found-container">
          <h3>Note not found</h3>
          <p>The requested note could not be found.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleClose}>
      <NoteDetailsClient note={note} />
    </Modal>
  );
}
