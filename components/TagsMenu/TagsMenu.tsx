"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./TagsMenu.module.css";

const ALL_TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={styles.menuContainer}>
      <button className={styles.menuButton} onClick={toggleMenu}>
        Notes ▾
      </button>

      {isOpen && (
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <Link
              href="/notes/filter/All"
              className={styles.menuLink}
              onClick={toggleMenu}
            >
              All Notes
            </Link>
          </li>

          {ALL_TAGS.map((tag) => (
            <li key={tag} className={styles.menuItem}>
              <Link
                href={`/notes/filter/${tag}`}
                className={styles.menuLink}
                onClick={toggleMenu}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
