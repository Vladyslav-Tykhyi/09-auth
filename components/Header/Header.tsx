import styles from "./Header.module.css";
import Link from "next/link";
import TagsMenu from "@/components/TagsMenu/TagsMenu";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/" aria-label="Home" className={styles.headerLink}>
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={styles.navigation}>
          <li className={styles.navigationItem}>
            <Link href="/" className={styles.navigationLink}>
              Home
            </Link>
          </li>
          <li className={styles.navigationItem}>
            <TagsMenu />
          </li>
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
};

export default Header;
