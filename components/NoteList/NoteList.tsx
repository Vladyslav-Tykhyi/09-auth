import { useQueryClient, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Note } from "@/types/note";
import styles from "@/components/NoteList/NoteList.module.css";
import { clientApi } from "@/lib/api/clientApi";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: clientApi.deleteNote,
    onMutate: async (id: string) => {
      // Скасовуємо поточні запити для уникнення конфліктів
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      // Зберігаємо попередні дані для відкату
      const previousNotes = queryClient.getQueryData<{
        notes: Note[];
        totalPages: number;
      }>(["notes"]);

      // Оптимістично оновлюємо UI
      if (previousNotes) {
        queryClient.setQueryData(["notes"], {
          ...previousNotes,
          notes: previousNotes.notes.filter((note) => note.id !== id),
        });
      }

      return { previousNotes };
    },
    onError: (error, id, context) => {
      console.error("Помилка при видаленні:", error);

      // Відкатуємо зміни у разі помилки
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }

      // Інвалідуємо запити для оновлення даних
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onSuccess: () => {
      // Інвалідуємо запити для оновлення даних після успішного видалення
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Ви впевнені, що хочете видалити цю нотатку?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.listItem}>
          <div className={styles.cardContent}>
            <h2 className={styles.title}>{note.title}</h2>
            <p className={styles.content}>{note.content}</p>
          </div>

          <div className={styles.footer}>
            <span className={styles.tag}>{note.tag}</span>
            <div className={styles.actions}>
              <Link
                href={`/notes/${note.id}`}
                className={styles.link}
                scroll={false}
              >
                View details
              </Link>
              <button
                className={styles.button}
                onClick={(e) => handleDelete(note.id, e)}
                disabled={
                  deleteMutation.isPending &&
                  deleteMutation.variables === note.id
                }
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
