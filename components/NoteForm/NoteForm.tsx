"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clientApi } from "@/lib/api/clientApi"; // Змінено імпорт

import { toast } from "react-hot-toast";
import styles from "./NoteForm.module.css";
import { NewNote, NoteTag } from "../../types/note";
import { useNoteDraftStore } from "@/lib/store/noteStore";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Отримуємо стан чернетки та функції для роботи з нею
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const mutation = useMutation({
    mutationFn: clientApi.createNote, // Використовуємо clientApi.createNote
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created successfully!");
      clearDraft(); // Очищаємо чернетку після успішного створення
      router.push("/notes/filter/All");
    },
    onError: (error) => {
      toast.error("Failed to create note");
      console.error(error);
    },
  });

  // Обробник зміни полів форми
  const handleChange = (field: keyof typeof draft, value: string) => {
    setDraft({ [field]: value });
  };

  const handleSubmit = (formData: FormData) => {
    const values: NewNote = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as NoteTag,
    };

    mutation.mutate(values);
  };

  const handleCancel = () => {
    // Чернетка НЕ очищається при скасуванні
    router.push("/notes/filter/All");
  };

  return (
    <form action={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={styles.input}
          required
          minLength={3}
          maxLength={50}
          value={draft.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={styles.textarea}
          maxLength={500}
          value={draft.content}
          onChange={(e) => handleChange("content", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={styles.select}
          required
          value={draft.tag}
          onChange={(e) => handleChange("tag", e.target.value as NoteTag)}
        >
          <option value={NoteTag.Todo}>Todo</option>
          <option value={NoteTag.Work}>Work</option>
          <option value={NoteTag.Personal}>Personal</option>
          <option value={NoteTag.Meeting}>Meeting</option>
          <option value={NoteTag.Shopping}>Shopping</option>
        </select>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
