import styles from "./layout.module.css";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
