import css from './NoteList.module.css';
import type { Note } from '../../types/note';

interface NoteListProps {
  notes: Note[];
  onDelete: (id: number) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <p className={css.tag}>{note.tag}</p>
          <button className={css.button} onClick={() => onDelete(note.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}