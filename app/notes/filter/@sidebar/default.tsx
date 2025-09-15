import Link from "next/link";
import styles from "./SidebarNotes.module.css";

const ALL_TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function SidebarNotes() {
  return (
    <div className={styles.sidebar}>
      <h3>Filter by Tag</h3>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <Link href="/notes/filter/All" className={styles.menuLink}>
            All Notes
          </Link>
        </li>

        {ALL_TAGS.map((tag) => (
          <li key={tag} className={styles.menuItem}>
            <Link href={`/notes/filter/${tag}`} className={styles.menuLink}>
              {tag}
            </Link>
          </li>
        ))}

        <li className={styles.menuItem}>
          <Link
            href="/notes/action/create"
            className={`${styles.menuLink} ${styles.createLink}`}
          >
            Create note +
          </Link>
        </li>
      </ul>
    </div>
  );
}
