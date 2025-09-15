export enum NoteTag {
  Todo = "Todo",
  Work = "Work",
  Personal = "Personal",
  Meeting = "Meeting",
  Shopping = "Shopping",
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}
